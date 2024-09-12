const { ipcRenderer } = require("electron");
const ipc = require("electron").ipcRenderer;

ipcRenderer.on("got-access-token", (event, accessToken) => {
	//   data = accessToken.split(",");
	let grcode = accessToken;
	// console.log(accessToken)
	$.post("https://tidmunzbuffet.com/api_app/gr/getsup_gr.php", { grcode: grcode }, function (grhead) {
		// console.log(grhead);
		let result = JSON.parse(grhead)
		$('#grcode').val(grcode)
		$('#supcode').val(result[0].supcode)
		$('#grdate').val(result[0].grdate)
		$('#supname').val(result[0].supname)

	});

	$.post("https://tidmunzbuffet.com/api_app/gr/getsup_grdetail.php", { grcode: grcode }, function (grdetail) {
		// console.log(grdetail);
		let result = JSON.parse(grdetail)
		$('#TM_Table_Main tbody').empty();
		$('#TM_Table_Quantity tbody').empty();
		
		for (let i in result) {
			let count = parseInt(i, 10) + 1
			tb = '';
			tb += '<tr id="' + (i + 1) + '"><td style="text-align: center">' + count + '.' + '</td><td>' + result[i].stcode + '</td><td>' + result[i].stname + '</td><td style="text-align: center">' + result[i].qty + '</td><td style="text-align: right">' + result[i].totalprice + '</td><td><button class="btn btn-primary" onclick="Show_Item(\'' + result[i].grcode + '\',\'' + result[i].stcode + '\',\'' + result[i].price + '\');"><i class="fas fa-sign-in-alt"></i> เลือก</button></td>';
			tb += '</tr>';
			$(tb).appendTo("#TM_Table_Main");

		}
	}).fail(function (error) {

		$('#txtresult').text('อินเตอร์เน็ตมีปัญหา เชื่อมต่อไม่ได้')
	});



});

function PrintBarcode(stcode, grcode, no,price,stname) {
	// alert(no)	
	// alert($('#tx_unitweigt').val())
	var inputweight = document.getElementById("tx_unitweigt");
	if (inputweight.value > 0) {
		$.post(
			"https://tidmunzbuffet.com/api_app/barcode/add_barcode.php",
			{
				stcode: stcode,
				stname: stname,
				grcode: grcode,
				unit_weight: $('#tx_unitweigt').val(),
				no: no,
				cost:price,
			},
			function (r2) {
				// console.log(r2);
				let response = JSON.parse(r2);
				// console.log(response);
				//   alert(response.barcode_id)
				// ipc.send('message:Edit', data);

				ipc.send('message:printtags', response);

				Show_Item(response.grcode, response.stcode);

			}
		).fail(function (error) {

			$('#txtresult').text('อินเตอร์เน็ตมีปัญหา เชื่อมต่อไม่ได้')
		});
	} else {

		document.getElementById('txtresult').innerHTML = 'กรุณาชั่งสินค้าก่อน ยิง Barcode'
		document.getElementById('txtresult').style.color = "red";

	}
	// inputempcode.value = null;
	// inputempcode.click();
	event.preventDefault();
}

function Show_Item(grcode, stcode,price) {

	$.post("https://tidmunzbuffet.com/api_app/barcode/getsup_barcode.php", { grcode: grcode, stcode: stcode }, function (grdetail) {
		// console.log(grdetail);
		let result = JSON.parse(grdetail)
		
		$('#TM_Table_Quantity tbody').empty();
		for (let i in result) {
			let barcode_status
			let button_printf
			if(result[i].barcode_status === "ยังไม่ออก barcode"){
				barcode_status = '<td style="text-align: center;color : red;">'  + result[i].barcode_status + '</td>'
				button_printf = '<td><button class="btn btn-success" onclick="PrintBarcode(\'' + result[i].stcode + '\',\'' + result[i].grcode + '\',\'' + result[i].no + '\',\'' + price + '\',\'' + result[i].stname + '\');"><i class="fa fa-print"></i> Print</button></td>'
				}
				else
				{
				barcode_status  = '<td style="text-align: center;color : secondary;">'  + result[i].barcode_status + '</td>'
				button_printf = '<td><button class="btn btn-secondary" onclick="PrintBarcode(\'' + result[i].stcode + '\',\'' + result[i].grcode + '\',\'' + result[i].no + '\',\'' + price + '\',\'' + result[i].stname + '\');"><i class="fa fa-print"></i> Print</button></td>'

			}
			tb = '';
			tb += '<tr id="' + (i + 1) + '"><td  style="text-align: center;">' + result[i].no + '.' + '</td><td>' + result[i].stcode + '</td><td>' + result[i].stname + '</td><td  style="text-align: right;" >' + result[i].unit_weight + '</td>'+barcode_status+ button_printf;
			tb += '</tr>';
			
			
				
			$(tb).appendTo("#TM_Table_Quantity");
			
		}
		
	}).fail(function (error) {

		$('#txtresult').text('อินเตอร์เน็ตมีปัญหา เชื่อมต่อไม่ได้')
	});

}
