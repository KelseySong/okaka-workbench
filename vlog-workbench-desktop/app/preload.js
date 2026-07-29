// preload.js - Electron preload script
// Bridge between main process and renderer
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('desktopApp', {
  platform: process.platform,
  isDesktop: true,
  version: '1.0.0'
});
