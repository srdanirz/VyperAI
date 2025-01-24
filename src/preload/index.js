// preload/index.js
import { contextBridge } from 'electron'

const mockTasks = [
  {
    id: 1,
    name: "Web Scraper",
    status: "running",
    progress: 65
  },
  {
    id: 2, 
    name: "Data Processor",
    status: "paused",
    progress: 42
  }
]

const api = {
  validateLicense: () => Promise.resolve({ 
    success: true,
    result: { email: 'test@test.com', product: { name: 'Test Product' }}
  }),
  
  isAuthenticated: () => Promise.resolve(true),
  
  tasks: {
    get: () => Promise.resolve(mockTasks),
    delete: () => Promise.resolve(true),
    stop: () => Promise.resolve(true),
    start: () => Promise.resolve(true)
  }
}

contextBridge.exposeInMainWorld('api', api)