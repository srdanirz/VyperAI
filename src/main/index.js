import { app, shell, BrowserWindow, ipcMain } from "electron";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import { machineIdSync } from "node-machine-id";
import {apiClient} from "./api/client";
import { runWebsocket, cleanup } from "./websocket/main";
import Store from 'electron-store';
import * as fs from "node:fs";
import fetch from 'node-fetch'
import * as path from "node:path";
const spawn = require('child_process').spawn;
const API_KEY = "p1UA4RWjHUMO-_1S5E9ksiQLxmKzTDTtZ4gj1Rgjf7s";

var child;
let isShuttingDown = false;
let shutdownTimeout;
let licenseValidation;

const LICENSE_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 5000, 
  VALIDATION_INTERVAL: 21600000,
  OFFLINE_GRACE_PERIOD: 3600000,
};

const licenseState = {
  failedAttempts: 0,
  lastSuccessfulValidation: null,
  isValidating: false
};

const store = new Store({
  name: 'vyper-store', 
  defaults: {
    archivedTasks: [],
    license: null,
    queueLink: '',
    licenseData: null
  },
  beforeAny: (store) => {
    // Verificación de seguridad
    for (let i = 0; i < process.argv.length; i++) {
      const arg = process.argv[i]
      if (arg.indexOf('--inspect') !== -1 || arg.indexOf('--remote-debugging-port') !== -1) {
        process.exit(1)
      }
    }
  }
});

var libPath;
if (process.env.NODE_ENV === 'development') {
  libPath = path.join(__dirname, '../../lib/lib');
} else {
  libPath = path.join(process.resourcesPath, 'lib/lib');
}

if (!fs.existsSync(libPath)) {
  console.error('Library not found at:', libPath);
  app.exit(1);
}

export let licenseData;

async function validateLicense(licenseKey) {
  if (licenseState.isValidating) {
    return { success: true, result: store.get('licenseData') };
  }
  
  licenseState.isValidating = true;
  const HWID = machineIdSync(true);
  const url = `https://api.whop.com/api/v2/memberships/${licenseKey}/validate_license`;
  const payload = {
    metadata: {
      HWID: HWID,
    },
  };
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
  };

  for (let attempt = 0; attempt < LICENSE_CONFIG.MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (response.ok && response.status === 201) {
        licenseState.failedAttempts = 0;
        licenseState.lastSuccessfulValidation = Date.now();
        store.set('license', licenseKey);
        store.set('licenseData', responseData);
        licenseState.isValidating = false;
        
        return {
          success: true,
          result: {
            product: responseData.product,
            email: responseData.email,
            license_key: responseData.license_key,
            valid: responseData.valid,
            user: responseData.user,
          }
        };
      }

      if (response.status === 401) {
        licenseState.isValidating = false;
        return {
          success: false,
          message: "Invalid token. Please regenerate your token"
        };
      } else if (response.status === 400) {
        licenseState.isValidating = false;
        return {
          success: false,
          message: "License key already used. Please check and try a different key"
        };
      } else if (response.status === 404) {
        licenseState.isValidating = false;
        return {
          success: false,
          message: "Incorrect License key. Please verify your key and try again"
        };
      }

      await new Promise(resolve => setTimeout(resolve, LICENSE_CONFIG.RETRY_DELAY));

    } catch (error) {
      console.error(`License validation attempt ${attempt + 1} failed:`, error);
      
      if (attempt < LICENSE_CONFIG.MAX_RETRIES - 1) {
        await new Promise(resolve => setTimeout(resolve, LICENSE_CONFIG.RETRY_DELAY));
        continue;
      }
    }
  }

  licenseState.failedAttempts++;
  
  if (licenseState.lastSuccessfulValidation) {
    const timeSinceLastValidation = Date.now() - licenseState.lastSuccessfulValidation;
    if (timeSinceLastValidation < LICENSE_CONFIG.OFFLINE_GRACE_PERIOD) {
      licenseState.isValidating = false;
      return {
        success: true,
        result: store.get('licenseData'),
        offlineMode: true
      };
    }
  }

  licenseState.isValidating = false;
  return {
    success: false,
    message: "Error validating license key. Check your internet and try again"
  };
}

export let mainWindow = null;


async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1380,
    height: 800,
    frame: false,
    minimizable: true,
    useContentSize: true,
    icon: join(__dirname, "../../resources/logo.png"),
    ...(process.platform === "linux"
      ? { icon: join(__dirname, "../../resources/logo.png") }
      : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      devTools: true,
      contextIsolation: true,
      nodeIntegration: true,
    },
    minWidth: 1380,  // Aumentado para coincidir con el width inicial
    maxWidth: 1400,
    minHeight: 800,
    maxHeight: 800,
  });

  // Event listeners
  mainWindow.webContents.on(
    "did-fail-load",
    (_, errorCode, errorDescription) => {
      console.error(
        `Failed to load the web page: ${errorDescription} (${errorCode})`,
      );
    },
  );

  // Un solo evento ready-to-show
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
    mainWindow.center(); // Centrar después de mostrar
  });

  // Prevenir que la ventana se pueda redimensionar mediante arrastre
  mainWindow.setResizable(false);

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }

  global.mainWindow = mainWindow;
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId("com.vyper");

  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  ipcMain.on("minimize-window", () => {
    const currentWindow = BrowserWindow.getFocusedWindow();
    if (currentWindow) {
      currentWindow.minimize();
    }
  });

  ipcMain.handle('get-queue-link',  async () => {
    return store.get('queueLink')
  })

  ipcMain.handle('set-queue-link',  async (_, queueLink) => {
    return store.set('queueLink', queueLink)
  })

  licenseValidation = setInterval(async () => {
    if (store.get('license')) {
      const result = await validateLicense(store.get('license'));
      
      if (result.success || result.offlineMode) {
        return;
      }
      
      if (licenseState.failedAttempts >= LICENSE_CONFIG.MAX_RETRIES) {
        mainWindow.webContents.send('license-warning', 
          'Connection issues detected. Please check your internet connection.');
      }
      
      if (licenseState.failedAttempts >= LICENSE_CONFIG.MAX_RETRIES * 2) {
        mainWindow.webContents.send('logout-event', '');
        if (child) child.kill();
      }
    }
  }, LICENSE_CONFIG.VALIDATION_INTERVAL);

  // Improved close handler
  ipcMain.on('close', async () => {
    if (isShuttingDown) return;
    isShuttingDown = true;

    try {
      // Set a timeout for the entire shutdown process
      shutdownTimeout = setTimeout(() => {
        console.log('Shutdown timeout reached, forcing exit');
        if (child) child.kill('SIGKILL');
        app.exit(0);
      }, 5000);

      // Try to shutdown backend gracefully
      try {
        await fetch('http://localhost:58191/api/shutdown', {
          method: 'POST',
          keepalive: true,
          timeout: 3000 // 3 second timeout for the request
        });
      } catch (error) {
        console.log('Backend shutdown request failed:', error);
      }

      // Wait a moment for the backend to cleanup
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Force kill the child process if it's still running
      if (child) {
        child.kill('SIGTERM');
        
        // Give it a moment to terminate gracefully
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Force kill if still running
        if (!child.killed) {
          child.kill('SIGKILL');
        }
      }

      // Close all windows
      BrowserWindow.getAllWindows().forEach(window => {
        window.destroy();
      });

      // Clear the timeout since we're done
      clearTimeout(shutdownTimeout);
      
      // Exit the app
      app.quit();
    } catch (error) {
      console.error('Error during shutdown:', error);
      // Force exit as last resort
      app.exit(1);
    }
  });

  ipcMain.handle('get-tasks', async (_,_2) => {
    try {
      const tasks = await  apiClient.GetTasks().catch(err => false)
      if (!tasks) {
        throw new Error("")
      }
      return tasks;
    } catch (e) {
    }
  })

  ipcMain.handle('delete-task', async (_, taskId) => {
    return apiClient.DeleteTask(taskId)
  })

  ipcMain.handle('start-tasks', async (_, args) => {
    args.proxies =  args.proxies.map(y => {
      if (typeof y ==='string') {
        return y;
      }
      if (y.username ){
        return `${y.proxy}:${y.username}:${y.password}`
      } else {
        return y.proxy
      }
    })

    args.queueUrl = store.get('queueLink')
    return apiClient.StartTask(args)
  })

  ipcMain.handle('delete-tasks', async (_, args) => {
    return apiClient.DeleteTasks()
  })

  ipcMain.handle('stop-tasks', async (_, args) => {
    return apiClient.StopTasks()
  })

  ipcMain.handle('archive-tasks', async (_, tasks) => {
    try {
      const archivedTasks = store.get('archivedTasks') || [];
      const tasksToArchive = tasks.map(task => ({
        ...task,
        archivedAt: new Date().toISOString(),
        archiveDate: new Date().toLocaleDateString()
      }));
      
      store.set('archivedTasks', [...archivedTasks, ...tasksToArchive]);
      return true;
    } catch (error) {
      console.error('Error archiving tasks:', error);
      return false;
    }
  });
  
  ipcMain.handle('get-archived-tasks', async () => {
    try {
      return store.get('archivedTasks') || [];
    } catch (error) {
      console.error('Error getting archived tasks:', error);
      return [];
    }
  });

  ipcMain.handle('logout', async () => {
    child.kill()
    store.delete('license')
    return true;
  })

  ipcMain.handle('open-external-link', async (_, url) => {
    try {
      await shell.openExternal(url);
      return true;
    } catch (error) {
      console.error('Error al abrir el enlace:', error);
      return false;
    }
  });

  ipcMain.handle("is-authenticated", async (_, licenseKey) => {
    if (store.get('license')) {
      const result = await validateLicense(store.get('license'));
      console.log('result:', result.result)
      licenseData = result.result;
      if (!result.result) {
        return false;
      }
  
      // Limpiar proceso previo si existe
      try {
        if (process.platform === 'win32') {
          require('child_process').execSync(
            'FOR /F "tokens=5" %P IN (\'netstat -ano ^| find "58191" ^| find "LISTENING"\') DO taskkill /F /PID %P',
            { stdio: 'ignore' }
          );
        } else {
          require('child_process').execSync('lsof -ti:58191 | xargs kill -9', { stdio: 'ignore' });
        }
      } catch (e) {
        // Ignorar errores si no hay proceso para matar
      }
  
      // Esperar que el puerto se libere
      await new Promise(resolve => setTimeout(resolve, 1000));
    
      // Iniciar el backend
      child = spawn(libPath, ['--license', store.get('license')], {
        windowsHide: true,
        stdio: "ignore"
      });
  
      // Esperar que el backend inicie (como estaba originalmente)
      await new Promise(resolve => setTimeout(resolve, 1000));
    
      // Iniciar websocket
      runWebsocket();
      
      return result;
    } 
    return false;
  });

  ipcMain.handle("validate-license", async (_, licenseKey) => {
    const result = await validateLicense(licenseKey);
    licenseData = result.result;

    if (licenseData ){
      child = spawn(libPath, [ '--license', licenseKey], {
        stdio: "ignore",
        windowsHide: true,
      });
    }
    return result;
  });

  ipcMain.handle('delete-archived-tasks', async (_, taskNumbers) => {
    try {
      const archivedTasks = store.get('archivedTasks') || [];
      
      // Filtrar solo las tasks que NO están en taskNumbers
      const updatedTasks = archivedTasks.filter(task => 
        !taskNumbers.includes(task.taskNumber)
      );
      
      // Guardar las tasks actualizadas
      store.set('archivedTasks', updatedTasks);
      
      return true;
    } catch (error) {
      console.error('Error deleting archived tasks:', error);
      return false;
    }
  });

  ipcMain.handle('get-brightdata-usage', async () => {
  try {
    const response = await fetch('https://api.brightdata.com/customer/bw', {
      headers: {
        'Authorization': 'Bearer ada80093-dfe3-4208-8715-deb7e2afa38d'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Brightdata usage:', error);
    throw error;
  }
});

  ipcMain.handle("get-store-data", async (_, key) => {
    return store.get(key);
  });

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', async () => {
  if (isShuttingDown) return;
  isShuttingDown = true;

  try {
    shutdownTimeout = setTimeout(() => {
      console.log('Shutdown timeout reached, forcing exit');
      if (child) child.kill('SIGKILL');
      app.exit(0);
    }, 5000);

    try {
      await fetch('http://localhost:58191/api/shutdown', {
        method: 'POST',
        keepalive: true,
        timeout: 3000
      });
    } catch (error) {
      console.log('Backend shutdown request failed:', error);
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    if (child) {
      child.kill('SIGTERM');
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (!child.killed) {
        child.kill('SIGKILL');
      }
    }

    clearTimeout(shutdownTimeout);

    if (process.platform !== 'darwin') {
      app.quit();
    }
  } catch (error) {
    console.error('Error during shutdown:', error);
    app.exit(1);
  }
});

app.on('before-quit', () => {
  isShuttingDown = true;
  if (licenseValidation) {
    clearInterval(licenseValidation);
  }
  licenseState.isValidating = false;
  licenseState.failedAttempts = 0;
  cleanup();
  if (child) {
    child.kill('SIGKILL');
  }
});