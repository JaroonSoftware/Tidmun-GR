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
    fullscreen: true,
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

  function printBarcode(data) {
    const formbarcode = new BrowserWindow({
      width: 400, height: 300, resizable: false, show: false , webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      }
    });
    // child.setIcon('assets/icons/win/icon.ico');
    formbarcode.loadFile("src/form/tagbarcode.html");

    // var current = document.getElementById('current');
    var options = {
      silent: true,
      printBackground: true,
      color: true,
      margin: {
        marginType: 'printableArea'
      },
      landscape: true,
      pagesPerSheet: 1,
      collate: false,
      copies: 1,
      header: 'Header of the Page',
      footer: 'Footer of the Page'
    }
    // formbarcode.hide();
    formbarcode.webContents.on('did-finish-load', () => {
      
      formbarcode.webContents.send("send-barcode", data);
      

      formbarcode.webContents.print(options, (success, failureReason) => {
        if (!success) console.log(failureReason);

        // console.log('Print Initiated');
      });


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

  const editwindow = new BrowserWindow({
    autoHideMenuBar: true,
    parent: mainWindow,
    height: 700,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });


  editwindow.loadFile("src/modal/modal_edit.html");
  // editwindow.setIcon('assets/icons/win/icon.ico');
  editwindow.on("close", (evt) => {
    evt.preventDefault(); // This will cancel the close
    editwindow.hide();
  });

  ipc.on("edit", (event, data) => {
    accessToken = data;
    editwindow.show();
    editwindow.webContents.send("send-token", accessToken);
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
  });

  Select_GR();

  mainWindow.loadFile("src/index.html");
  // mainWindow.setIcon("assets/icons/win/icon.ico");
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
