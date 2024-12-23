// Modules to control application life and create native browser window
const { app, BrowserWindow } = require("electron");
const path = require("path");
const ipc = require("electron").ipcMain;


function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    icon: path.join(__dirname, "/assets/icons/win/icon.ico"),
    width: 1360,
    height: 1024,
    modal: true,
    // fullscreen: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  function Select_GR() {
    const child = new BrowserWindow({
      icon: path.join(__dirname, "/assets/icons/win/icon.ico"),
      autoHideMenuBar: true,
      parent: mainWindow,
      height: 1000,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
      },
    });
    // child.setIcon('assets/icons/win/icon.ico');
    child.loadFile("src/modal/modal_product.html");
  }
  function Show_Modal_Examine() {
    const child = new BrowserWindow({
      icon: path.join(__dirname, "/assets/icons/win/icon.ico"),
      autoHideMenuBar: true,
      parent: mainWindow,
      height: 700,
      width: 1000,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
      },
    });
    // child.setIcon('assets/icons/win/icon.ico');
    child.loadFile("src/modal/modal_examine.html");
  }

  function printBarcode(dataRender) {
    const formbarcode = new BrowserWindow({
      width: 350,
      height: 200,
      resizable: false,
      show: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      }
    });
    // child.setIcon('assets/icons/win/icon.ico');
    formbarcode.loadFile("src/form/tagbarcode.html");

    // var current = document.getElementById('current');
    var options = {
      silent: true,
      // deviceName: "Microsoft Print to PDF",
      deviceName: 'HPRT HT300 - ZPL',
      margins: {
        marginType: "none"
      },
      landscape: false,
      dpi: {
        horizontal: 250,
        vertical: 400
      },
    }
    // formbarcode.hide();
    formbarcode.webContents.on('did-finish-load', () => {



      // Something you want delayed.
      formbarcode.webContents.send("send-barcode", dataRender);



      setTimeout(function () {
        formbarcode.webContents.print(options, (success, failureReason) => {
          if (!success) console.log(failureReason);

          // console.log('Print Initiated');
        });
      }, 500);

    })
  }

  const electronLocalshortcut = require("electron-localshortcut");

  ipc.on("notes", (event, data) => {
    accessToken = data;

    mainWindow.webContents.send("got-access-token", accessToken);
    event.sender.send("ok", "Hello World!");
  });

  ipc.on("get", (event) => {

    mainWindow.webContents.send("get-token");
  });

  ipc.on("delete", (event) => {

    mainWindow.webContents.send("delete-token");
  });

  ipc.on("message:loginShow", () => {
    Select_GR();
  });

  ipc.on("message:loginShow2", () => {
    Show_Modal_Examine();
  });

  ipc.on("message:printtags", (event, data) => {

    printBarcode(data);
  });

  electronLocalshortcut.register(mainWindow, "Escape", () => {
    mainWindow.close();
    app.quit();

  });

  Select_GR();

  mainWindow.loadFile("src/index.html");
  mainWindow.maximize();
  // mainWindow.setIcon("assets/icons/win/icon.ico");
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") { app.quit(); }
});

app.on('will-quit', function () {
  // This is a good place to add tests insuring the app is still
  // responsive and all windows are closed.
  // console.log("will-quit");
  mainWindow = null;
});