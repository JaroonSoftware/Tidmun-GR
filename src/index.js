const electron = require('electron') 
// Importing BrowserWindow from Main 
const BrowserWindow = electron.remote.BrowserWindow; 

var current = document.getElementById('current'); 
var options = { 
	silent: false, 
	printBackground: true, 
	color: false, 
	margin: { 
		marginType: 'printableArea'
	}, 
	landscape: false, 
	pagesPerSheet: 1, 
	collate: false, 
	copies: 1, 
	header: 'Header of the Page', 
	footer: 'Footer of the Page'
} 

current.addEventListener('click', (event) => { 
	alert('test')
	let win = BrowserWindow.getFocusedWindow(); 
	// let win = BrowserWindow.getAllWindows()[0]; 

	win.webContents.print(options, (success, failureReason) => { 
		if (!success) console.log(failureReason); 

		console.log('Print Initiated'); 
	}); 
}); 



// $(document).mousemove(function (event) {
//   $("#tx_empcode").focus();
// });

function createBrowserWindow() {

  const ipc = require("electron").ipcRenderer;
  ipc.send('message:loginShow');

}

function EditWindow(data) {

  const ipc = require("electron").ipcRenderer;
  // ipc.send('message:Edit', data);
  ipc.send('edit', data )

  // ipc.send('notes', $('#selproduct').val() )
}

var connection;
var count = 0;

$(document).mousemove(function (event) {
  $("#tx_empcode").focus();
});

function createBrowserWindow() {

  const ipc = require("electron").ipcRenderer;
  ipc.send('message:loginShow');

}

function EditWindow(data) {

  const ipc = require("electron").ipcRenderer;
  // ipc.send('message:Edit', data);
  ipc.send('edit', data)

  // ipc.send('notes', $('#selproduct').val() )
}

var connection;
var count = 0;
$(document).ready(function () {


  $.post("https://tidmunzbuffet.com/api_app/weight_record/get_record.php", function (r) {

	let result = JSON.parse(r)

	for (let i in result) {
	  tb = '';
	  tb += '<tr id="' + (i + 1) + '"><td>' + result[i].grcode + '</td><td>' + result[i].firstname + '</td><td style="text-align: right;">'
		+ result[i].unit_weight + '</td><td style="text-align: right;">' + result[i].empcode + '</td><td style="text-align: right;">'
		+ result[i].empcode + '</td><td style="text-align: center;">' + result[i].firstname + '</td>'; tb += '</tr>';
	  $(tb).appendTo("#tbmain");
	}

  }).fail(function (error) {

	$('#txtresult').text('อินเตอร์เน็ตมีปัญหา เชื่อมต่อไม่ได้')
	document.getElementById('txtresult').style.color = "red";
  });

  $.post("https://tidmunzbuffet.com/api_app/gr/get_gr.php", function (r) {

	let data = JSON.parse(r)

	for (let c in data) {
	  $('#selproduct').append("<option value=" + data[c].grcode + " >" + data[c].grcode + ' ' + data[c].grcode + ' ' + "</option>")
	}

  }).fail(function (error) {

	$('#txtresult').text('อินเตอร์เน็ตมีปัญหา เชื่อมต่อไม่ได้')
  });


});
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

var inputempcode = document.getElementById("tx_empcode");
var inputweight = document.getElementById("tx_unitweigt");
var str;
var sql;

inputempcode.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {

	if (inputweight.value > 0) {

	  $.post("https://tidmunzbuffet.com/api_app/employee/check_employee.php", { empcode: inputempcode.value }, function (r) {
		let response = JSON.parse(r)
		// console.log(response.status)
		if (response.status === '1') {
		  let data = response;
		  // console.log(data['data'][0]['empcode'])
		  $.post("https://tidmunzbuffet.com/api_app/weight_record/add_record.php", { empcode: data['data'][0]['empcode'], unit_weight: inputweight.value, product_id: $("#selproduct").val(), create_date: data['data'][0]['create_date'] }, function (response2) {

			let r2 = JSON.parse(response2)

			if (r2.status === 1) {
			  count++;
			  str = '';
			  str += '<tr id="' + count + '"><td>' + data['data'][0]['display_date'] + '</td><td>' + data['data'][0]['empcode'] + '</td><td>' + data['data'][0]['firstname'] + ' ' + data['data'][0]['lastname'] + '</td><td>' + inputweight.value + '</td><td>0</td><td><button class="btn btn-secondary" onclick="EditWindow(' + r2.id + ');"> Edit</button></td>';
			  str += '</tr>';

			  $("#tbmain").prepend(str);
			  const elmnt = document.querySelector("table tr:last-child");
			  elmnt.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
			  document.getElementById('txtresult').innerHTML = 'บันทึกข้อมูลรหัส ' + data['data'][0]['empcode'] + ' สำเร็จ '
			  document.getElementById('txtresult').style.color = "#4DBE05";
			}
			else {
			  document.getElementById('txtresult').innerHTML = r2.message
			  document.getElementById('txtresult').style.color = "red";
			}
		  }).fail(function (error) {

			$('#txtresult').text('อินเตอร์เน็ตมีปัญหา เชื่อมต่อไม่ได้')
		  });
		}
		else if (response.status === '2') {
		  document.getElementById('txtresult').innerHTML = response.message
		  document.getElementById('txtresult').style.color = "red";
		}
		else {
		  document.getElementById('txtresult').innerHTML = 'อินเตอร์เน็ตมีปัญหา กรุณากรอกอีกครั้ง'
		  document.getElementById('txtresult').style.color = "red";
		}



	  });


	} else {

	  document.getElementById('txtresult').innerHTML = 'กรุณาชั่งสินค้าก่อน ยิง Barcode'
	  document.getElementById('txtresult').style.color = "red";

	}
	inputempcode.value = null;
	inputempcode.click();
	event.preventDefault();
  }
});


// You can also require other files to run in this process
require('./renderer.js')