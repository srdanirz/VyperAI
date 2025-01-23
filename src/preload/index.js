import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

const api = {
  validateLicense: (licenseKey) =>
    ipcRenderer.invoke("validate-license", licenseKey),
  isAuthenticated: () =>
    ipcRenderer.invoke("is-authenticated", ''),
  onLogout: (handleLogout) => ipcRenderer.on('logout-event', handleLogout),
  getStoreData: (key) => ipcRenderer.invoke("get-store-data", key),
  onWebSocketStatus: (func) => ipcRenderer.on("websocket-status", func),
  onTaskEvent: (func) => ipcRenderer.on("tasks-event" , func),
  getBrightDataUsage: () => ipcRenderer.invoke('get-brightdata-usage'),
  openExternal: (url) => ipcRenderer.invoke('open-external-link', url),
  clearListeners: (name) => ipcRenderer.removeAllListeners(name),
  close: async () => {
    try {
      // Primero intentar hacer shutdown del backend
      await fetch('http://localhost:58191/api/shutdown', {
        method: 'POST',
        keepalive: true // Asegura que la petición se complete incluso si la ventana se cierra
      });
      // Luego cerrar la ventana
      return ipcRenderer.send('close');
    } catch (error) {
      console.error('Error shutting down backend:', error);
      // Si falla el shutdown, cerrar la ventana de todos modos
      return ipcRenderer.send('close');
    }
  },
  logout: () => ipcRenderer.invoke('logout'),

  queueLink: {
    set: (link) => ipcRenderer.invoke('set-queue-link', link),
    get: () => ipcRenderer.invoke('get-queue-link'),

  },
  tasks: {
    get: (args) => ipcRenderer.invoke('get-tasks', args),
    delete: (args) => ipcRenderer.invoke('delete-tasks', args),
    stop: (args) => ipcRenderer.invoke('stop-tasks', args),
    deleteOne: (taskId) => ipcRenderer.invoke('delete-task', taskId),
    archiveTasks: (tasks) => ipcRenderer.invoke('archive-tasks', tasks),
    getArchivedTasks: () => ipcRenderer.invoke('get-archived-tasks'),
    deleteArchived: (taskNumbers) => ipcRenderer.invoke('delete-archived-tasks', taskNumbers), // Añadida esta línea
    start: (args) => ipcRenderer.invoke('start-tasks', args)
  }
};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = electronAPI;
  window.api = api;
}
