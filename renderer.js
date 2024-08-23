const { ipcRenderer } = require("electron");
const ipc = require("electron").ipcRenderer;

ipcRenderer.on("got-access-token", (event, accessToken) => {
	//   data = accessToken.split(",");
	let grcode = accessToken;

	$.post("https://tidmunzbuffet.com/api_app/gr/getsup_gr.php", { grcode: grcode }, function (grhead) {
		// console.log(grhead);
		let result = JSON.parse(grhead)
		$('#showdata').val(grcode)
		$('#showdata20').val(result[0].supcode)
		$('#datedata').val(result[0].grdate)
		$('#supname').val(result[0].supname)

	});

	$.post("https://tidmunzbuffet.com/api_app/gr/getsup_grdetail.php", { grcode: grcode }, function (grdetail) {
		console.log(grdetail);
		let result = JSON.parse(grdetail)
		$('#TM_Table_Main tbody').empty();
		$('#TM_Table_Quantity tbody').empty();
		for (let i in result) {
			tb = '';
			tb += '<tr id="' + (i + 1) + '"><td>' + result[i].stcode + '</td><td>' + result[i].stname + '</td><td>' + result[i].qty + '</td><td>' + result[i].totalprice + '</td><td><button class="btn btn-secondary" onclick="Show_Item(\'' + result[i].grcode + '\',\'' + result[i].stname + '\',\'' + result[i].totalprice + '\',\'' + result[i].stcode + '\',\'' + result[i].qty + '\');">เลือก</button></td>';
			tb += '</tr>';
			$(tb).appendTo("#TM_Table_Main");
			
		}
	}).fail(function (error) {

		$('#txtresult').text('อินเตอร์เน็ตมีปัญหา เชื่อมต่อไม่ได้')
	});



});

function PrintBarcode(stcode, grcode) {
	// alert(stcode)	
	// alert($('#tx_unitweigt').val())

	var jsonData = { "stcode": stcode, "grcode": grcode, "unit_weight": $('#tx_unitweigt').val() };

	ipc.send('message:printtags', jsonData);

	// ipc.send('message:Edit', data);


	// const electron = require('electron')
	// // Importing BrowserWindow from Main 
	// const BrowserWindow = electron.remote.BrowserWindow;

	// // var current = document.getElementById('current');
	// var options = {
	// 	silent: false,
	// 	printBackground: true,
	// 	color: false,
	// 	margin: {
	// 		marginType: 'printableArea'
	// 	},
	// 	landscape: false,
	// 	pagesPerSheet: 1,
	// 	collate: false,
	// 	copies: 1,
	// 	header: 'Header of the Page',
	// 	footer: 'Footer of the Page'
	// }

	// // alert('test')
	// let win = BrowserWindow.getFocusedWindow();
	// // let win = BrowserWindow.getAllWindows()[0]; 

	// win.webContents.print(options, (success, failureReason) => {
	// 	if (!success) console.log(failureReason);

	// 	console.log('Print Initiated');
	// });
}

function Show_Item(grcode,supname,total_price,stcode,qty){

		$('#TM_Table_Quantity tbody').empty();
		for (let i=0;i<qty;i++) {
			tb = '';
			tb += '<tr id="' + (i + 1) + '"><td>' + grcode + '</td><td>' + supname + '</td><td>' + total_price + '</td><td><button class="btn btn-secondary" onclick="PrintBarcode(\'' + stcode + '\',\'' + grcode + '\');">Print</button></td>';
			tb += '</tr>';
			$(tb).appendTo("#TM_Table_Quantity");
			
		}

}
// ipcRenderer.on("get-token", (event) => {

//   $('#tbmain tbody').empty();
//   $.post(
//     "https://tidmunzbuffet.com/api_app/weight_record/get_record.php",
//     function (r) {
//       let result = JSON.parse(r);

//       for (let i in result) {
//         tb = "";
//         tb +=
//           '<tr id="' +
//           (i + 1) +
//           '"><td>' +
//           result[i].create_date +
//           "</td><td>" +
//           result[i].empcode +
//           "</td><td>" +
//           result[i].firstname +
//           " " +
//           result[i].lastname +
//           "</td><td>" +
//           result[i].unit_weight +
//           "</td><td>" +
//           result[i].shrimp_shell +
//           '</td><td><button class="btn btn-secondary" onclick="EditWindow(' +
//           result[i].id +
//           ');"> Edit</button></td>';
//         tb += "</tr>";
//         $(tb).appendTo("#tbmain");
//       }
//       $("#tx_empcode").focus();
//     }
//   );
// });

// ipcRenderer.on("delete-token", (event) => {

//   $('#tbmain tbody').empty();
//   $.post(
//     "https://tidmunzbuffet.com/api_app/weight_record/get_record.php",
//     function (r) {
//       let result = JSON.parse(r);

//       for (let i in result) {
//         tb = "";
//         tb +=
//           '<tr id="' +
//           (i + 1) +
//           '"><td>' +
//           result[i].create_date +
//           "</td><td>" +
//           result[i].empcode +
//           "</td><td>" +
//           result[i].firstname +
//           " " +
//           result[i].lastname +
//           "</td><td>" +
//           result[i].unit_weight +
//           "</td><td>" +
//           result[i].shrimp_shell +
//           '</td><td><button class="btn btn-secondary" onclick="EditWindow(' +
//           result[i].id +
//           ');"> Edit</button></td>';
//         tb += "</tr>";
//         $(tb).appendTo("#tbmain");
//       }
//       $("#tx_empcode").focus();
//     }
//   );
// });

