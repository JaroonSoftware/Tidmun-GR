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

      formbarcode.webContents.send("send-barcode", dataRender);


      formbarcode.webContents.print(options, (success, failureReason) => {
        if (!success) console.log(failureReason);

        // console.log('Print Initiated');
      });


    })

    // const { PosPrinter } = require('@plick/electron-pos-printer');
    // // console.log(dataRender)
    // const options = {
    //   preview: true,
    //   margin: '0 0 0 0',
    //   padding:'0 0 0 0',
    //   copies: 1,
    //   silent:true,
    //   width:'95mm',
    //   // printerName: 'HPRT HT300 - ZPL',
    //   // timeOutPerLine: 400,
    //   pageSize: '50mm', // page size
    // };

    // const data = [
    //   {
    //     type: 'table',
    //     style: { border: '0px solid #000',padding: '0px',margin: '0px', fontSize: '24px' ,fontFamily: 'sans-serif',fontWeight: '700'}, // style the table
    //     tableBody: [
    //       [
    //         { type: 'image', path: 'assets/icons/logo_tidmun.jpg',width: '60px', position: 'center' },
    //         // { type: 'text', value: '<img src="assets/icons/logo_tidmun.jpg" width="100" />'},            
    //         { type: 'text', value: dataRender.no+'. '+dataRender.stname+'<br>'+dataRender.unit_weight+' KG' ,position:'right'},
    //       ],
    //     ],
    //     tableHeaderStyle: { backgroundColor: 'red', color: 'white' },
    //     tableBodyStyle: { border: '0px solid #000' },
    //     tableFooterStyle: { backgroundColor: '#000', color: 'white' },
    //     tableHeaderCellStyle: {
    //       // padding: '5px 2px',
    //     },
    //     tableBodyCellStyle: {
    //       padding: '0px',
    //       // padding: '1px 2px',
    //     },
    //     // custom style for the footer cells
    //     tableFooterCellStyle: {
    //       padding: '0px',
    //     },
    //   },
    //   {
    //     type: 'barCode',
    //     value: dataRender.barcode_id,
    //     height: 65, // height of barcode, applicable only to bar and QR codes
    //     width: 3, // width of barcode, applicable only to bar and QR codes
    //     position: 'center',
    //     // displayValue: true, // Display value below barcode
    //     fontSize: 30,
    //   },
    //   {
    //     type: 'text',
    //     value: dataRender.stcode,
    //     style: { fontSize: '24px', textAlign: 'center',fontWeight: '700',padding: '0px',margin: '0px' },
    //   },
    // ]

    // PosPrinter.print(data, options)
    //   .then(console.log)
    //   .catch((error) => {
    //     console.error(error);
    //   });
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
    app.quit();
    mainWindow.close();
    
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
  if (process.platform !== "darwin") app.quit();
});
