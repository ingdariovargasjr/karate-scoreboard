const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1800,
    height: 720,
    webPreferences: {
      nodeIntegration: true // Careful with this in production for security!
    }
  });

  // Load the index.html of the app.
  win.loadFile('index.html');
  
  // Optional: Remove the menu bar
  // win.setMenu(null);
}

// When Electron is ready, create the window
app.whenReady().then(createWindow);

// Quit when all windows are closed (Windows/Linux standard)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});