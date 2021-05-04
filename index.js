const { app, BrowserWindow, ipcMain, screen } = require("electron");
const os = require("os");
let tray = null;
const { session } = require("electron");


function createWindow() {
  const board = new BrowserWindow({
    width: screen.getPrimaryDisplay().workAreaSize.width,
    height: screen.getPrimaryDisplay().workAreaSize.height,
    webPreferences: {
      nodeIntegration: true,
      devTools: true,
    },
    transparent: true,
    frame: false,
    icon: "./assets/logo.png",
  });
  board.setAlwaysOnTop(true, "screen");
  board.loadFile("board.html");
  board.setResizable(false);

  const controller = new BrowserWindow({
    width: 1025,
    height: 120,
    webPreferences: {
      nodeIntegration: true,
      devTools: true,
    },
    transparent: true,
    frame: false,
    skipTaskbar: true,
    parent: board,
    icon: "./assets/logo.png",
  });
  controller.setPosition(205, 40);
  controller.setAlwaysOnTop(true, "screen");
  controller.loadFile("controller.html");
  controller.setResizable(false);

  function openPicker() {
    const picker = new BrowserWindow({
      width: 325,
      height: 375,
      webPreferences: {
        nodeIntegration: true,
        devTools: true,
      },
      transparent: true,
      frame: false,
      skipTaskbar: true,
      parent: board,
      icon: "./assets/logo.png",
    });
    picker.setPosition(500, 300);
    picker.setAlwaysOnTop(true, "screen");
    picker.loadFile("picker.html");
    picker.setResizable(false);
  }

  controller.on("closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  board.on("closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  ipcMain.on("resetBoard", () => {
    board.webContents.send("resetBoard");
  });
  ipcMain.on("eraserMode", () => {
    board.webContents.send("eraserMode");
  });
  ipcMain.on("setMode", (e, arg) => {
    board.webContents.send("setMode", arg);
  });

  ipcMain.on("textMode", () => {
    board.webContents.send("textMode");
  });

  ipcMain.on("colSelect", (e, arg) => {
    board.webContents.send("colSelectFill", arg);
    board.webContents.send("colSelectStroke", arg);
  });
  ipcMain.on("colSelectFill", (e, arg) => {
    board.webContents.send("colSelectFill", arg);
  });
  ipcMain.on("customColor", openPicker);
  ipcMain.on("colSubmit", (e, arg) => {
    controller.webContents.send("colSubmit", arg);
  });

  ipcMain.on("drawPolygon", () => {
    board.webContents.send("drawPolygon");
  });
  ipcMain.on("drawLine", () => {
    board.webContents.send("drawLine");
  });
  ipcMain.on("drawSquare", () => {
    board.webContents.send("drawSquare");
  });
  ipcMain.on("drawCircle", () => {
    board.webContents.send("drawCircle");
  });
  ipcMain.on("drawTriangle", () => {
    board.webContents.send("drawTriangle");
  });

  ipcMain.on("drawTick", () => {
    board.webContents.send("drawTick");
  });
  ipcMain.on("drawCross", () => {
    board.webContents.send("drawCross");
  });
  ipcMain.on("drawStar", () => {
    board.webContents.send("drawStar");
  });
  ipcMain.on("drawFreehand", () => {
    board.webContents.send("drawFreehand");
  });

  ipcMain.on("dragMode", () => {
    board.webContents.send("setMode", "drag");
    board.webContents.send("dragMode");
  });

  ipcMain.on("hideBoard", () => {
    board.hide();
    controller.setAlwaysOnTop(true, "screen")
  });
  ipcMain.on("showBoard", () => {
    board.show();
    controller.hide();
    controller.show();
  });

  ipcMain.on("minimizeWin", () => {
    board.minimize();
  });
  ipcMain.on("closeWin", () => {
    board.close();
  });

  if(os.platform == "win32") {
    setTimeout(() => {
      board.minimize()
      board.restore()
      board.hide()
      board.show()
      controller.hide()
      controller.show()
  }, 1000)
}

}

app.whenReady().then(() => {
  os.platform() == "linux" ? setTimeout(createWindow, 1000) : createWindow();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});