import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

const api = {
  validateLicense: () => Promise.resolve({ success: true, result: { email: 'test@test.com', product: { name: 'Test Product' } } }),
  isAuthenticated: () => Promise.resolve(true),
  tasks: {
    get: () => Promise.resolve([]),
    delete: () => Promise.resolve(true),
    stop: () => Promise.resolve(true),
    start: () => Promise.resolve(true)
  }
};

contextBridge.exposeInMainWorld("api", api);