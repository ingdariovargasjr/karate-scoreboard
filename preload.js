const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  exportBracketPdf: (payload) => ipcRenderer.invoke('export-bracket-pdf', payload),
});
