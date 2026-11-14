const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const fs = require('node:fs/promises');
const path = require('node:path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1800,
    height: 720,
    icon: path.join(__dirname, '28-logo.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadFile(path.join(__dirname, 'index.html'));
}

ipcMain.handle('export-bracket-pdf', async (event, payload) => {
  const html = payload?.html;
  if (typeof html !== 'string' || html.length > 10_000_000 || /<\s*script\b/i.test(html)) {
    return { ok: false, error: 'No se pudo preparar el documento PDF.' };
  }

  const safeName = String(payload?.fileName || 'grafica-karate')
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, '-')
    .trim()
    .slice(0, 120) || 'grafica-karate';
  const parentWindow = BrowserWindow.fromWebContents(event.sender);
  const saveResult = await dialog.showSaveDialog(parentWindow, {
    title: 'Guardar gráfica como PDF',
    defaultPath: `${safeName}.pdf`,
    filters: [{ name: 'Documento PDF', extensions: ['pdf'] }],
  });
  if (saveResult.canceled || !saveResult.filePath) return { ok: false, canceled: true };

  const printWindow = new BrowserWindow({
    show: false,
    width: 1440,
    height: 810,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  try {
    await printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);
    const pdf = await printWindow.webContents.printToPDF({
      pageSize: { width: 338667, height: 190500 },
      printBackground: true,
      margins: { marginType: 'none' },
      preferCSSPageSize: true,
    });
    await fs.writeFile(saveResult.filePath, pdf);
    return { ok: true, filePath: saveResult.filePath };
  } catch (error) {
    console.error('No se pudo exportar la gráfica a PDF:', error);
    return { ok: false, error: 'Ocurrió un error al generar el PDF.' };
  } finally {
    if (!printWindow.isDestroyed()) printWindow.close();
  }
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
