

$(document).mousemove(function (event) {
	$("#tx_empcode").focus();
});

function Select_GR() {

	const ipc = require("electron").ipcRenderer;
	ipc.send('message:loginShow');

}
function Show_Modal_Examine() {

	const ipc = require("electron").ipcRenderer;
	ipc.send('message:loginShow2');

}

var count = 0;
// $(document).ready(function () {
	// $.post("https://tidmunzbuffet.com/api_app/gr/getsup_grdetail.php", function (r) {
    // console.log(r)
    // console.log("888")
    // let data = JSON.parse(r)
    // for (let c in data) {
    //   $('#showdata').append("<option value=" + data[c].grcode + " >" + data[c].grcode + "</option>")
	//   $('#showdata20').append("<option value=" + data[c].grcode + " >" + data[c].supcode + "</option>")
	//   $('#datedata').append("<option value=" + data[c].grcode + " >" + data[c].grdate + "</option>")
	//   $('#supname').val( data[c].prename +' '+ data[c].supname )
	  
    // }
//   });  
// });

const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')
const port = new SerialPort({ path: 'COM1', baudRate: 9600 }, function (err) {
	if (err) {
		document.getElementById('txtresult').innerHTML = 'เชื่อมต่อเครื่องชั่งน้ำหนักไม่สำเร็จ'
		document.getElementById('txtresult').style.color = "red";
		return console.log('Error: ', err.message)
	}
})

const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }))
parser.on('data', addText)

function addText(event) {
	// console.log(event)
	document.getElementById("tx_unitweigt").value = parseFloat(event.substring(1, 8)).toFixed(2);
}