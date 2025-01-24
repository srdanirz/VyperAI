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

// src/main/index.js
// Simplificar a:

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1380,
    height: 800,
    frame: false,
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      contextIsolation: true,
      nodeIntegration: true,
    },
  });

  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

app.whenReady().then(createWindow);