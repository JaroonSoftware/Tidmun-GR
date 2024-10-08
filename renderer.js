const { ipcRenderer } = require("electron");
const ipc = require("electron").ipcRenderer;

var Datasource = {};

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
		$('#TM_Table_NO_WEIGHT tbody').empty();

		for (let i in result) {
			let count = parseInt(i, 10) + 1
			tb = '';
			tb += '<tr id="' + (i + 1) + '"><td style="text-align: center">' + count + '.' + '</td><td>' + result[i].stcode + '</td><td>' + result[i].stname + '</td><td style="text-align: center">' + result[i].qty + '</td><td style="text-align: center">' + result[i].totalweight + '</td><td style="text-align: center">' + result[i].unit + '</td><td><button class="btn btn-primary" onclick="Show_Item(\'' + result[i].grcode + '\',\'' + result[i].stcode + '\',\'' + result[i].price + '\',\'' + result[i].weight_stable + '\',\'' + result[i].fixed_weight + '\');"><i class="fas fa-sign-in-alt"></i> เลือก</button></td>';
			tb += '</tr>';
			$(tb).appendTo("#TM_Table_Main");

		}
	}).fail(function (error) {

		$('#txtresult').text('อินเตอร์เน็ตมีปัญหา เชื่อมต่อไม่ได้')
	});



});

function PrintBarcode(stcode, grcode, no, price, stname) {
	// alert(no)	
	// alert($('#tx_unitweigt').val())
	var inputweight = document.getElementById("tx_unitweigt");

	if ($('#weight_stable').val() !== 'Y') {

		if (inputweight.value > 0) {
			$.post(
				"https://tidmunzbuffet.com/api_app/barcode/add_barcode.php",
				{
					stcode: stcode,
					stname: stname,
					grcode: grcode,
					unit_weight: $('#tx_unitweigt').val(),
					no: no,
					cost: price,
				},
				function (r2) {
					// console.log(r2);
					let response = JSON.parse(r2);
					// console.log(response);
					//   alert(response.barcode_id)
					// ipc.send('message:Edit', data);

					ipc.send('message:printtags', response);

					Show_Item(response.grcode, response.stcode, price, $('#weight_stable').val(), $('#fixed_weight').val());
				}
			).fail(function (error) {

				$('#txtresult').text('อินเตอร์เน็ตมีปัญหา เชื่อมต่อไม่ได้')
			});
		} else {

			document.getElementById('txtresult').innerHTML = 'กรุณาชั่งสินค้าก่อน ยิง Barcode'
			document.getElementById('txtresult').style.color = "red";

		}
	}
	else {
		$.post(
			"https://tidmunzbuffet.com/api_app/barcode/add_barcode.php",
			{
				stcode: stcode,
				stname: stname,
				grcode: grcode,
				unit_weight: $('#fixed_weight').val(),
				no: no,
				cost: price,
			},
			function (r2) {
				// console.log(r2);
				let response = JSON.parse(r2);
				// console.log(response);
				//   alert(response.barcode_id)
				// ipc.send('message:Edit', data);

				ipc.send('message:printtags', response);

				Show_Item(response.grcode, response.stcode, price, $('#weight_stable').val(), $('#fixed_weight').val());

			}
		).fail(function (error) {

			$('#txtresult').text('อินเตอร์เน็ตมีปัญหา เชื่อมต่อไม่ได้')
		});
	}

	$.post("https://tidmunzbuffet.com/api_app/gr/getsup_grdetail.php", { grcode: grcode }, function (grdetail) {
		// console.log(grdetail);
		let result = JSON.parse(grdetail)
		$('#TM_Table_Main tbody').empty();

		for (let i in result) {
			let count = parseInt(i, 10) + 1
			tb = '';
			tb += '<tr id="' + (i + 1) + '"><td style="text-align: center">' + count + '.' + '</td><td>' + result[i].stcode + '</td><td>' + result[i].stname + '</td><td style="text-align: center">' + result[i].qty + '</td><td style="text-align: center">' + result[i].totalweight + '</td><td style="text-align: center">' + result[i].unit + '</td><td><button class="btn btn-primary" onclick="Show_Item(\'' + result[i].grcode + '\',\'' + result[i].stcode + '\',\'' + result[i].price + '\',\'' + result[i].weight_stable + '\',\'' + result[i].fixed_weight + '\');"><i class="fas fa-sign-in-alt"></i> เลือก</button></td>';
			tb += '</tr>';
			$(tb).appendTo("#TM_Table_Main");

		}
	}).fail(function (error) {

		$('#txtresult').text('อินเตอร์เน็ตมีปัญหา เชื่อมต่อไม่ได้')
	});
	// inputempcode.value = null;
	// inputempcode.click();
	// event.preventDefault();
}

function RePrintBarcode(barcode_id, no) {

	$.post("https://tidmunzbuffet.com/api_app/barcode/reprint_barcode.php", { barcode_id: barcode_id, no: no }, function (grdetail) {
		// console.log(grdetail);
		let result = JSON.parse(grdetail)

		ipc.send('message:printtags', result);
	}).fail(function (error) {

		$('#txtresult').text('อินเตอร์เน็ตมีปัญหา เชื่อมต่อไม่ได้')
	});
	// alert($('#tx_unitweigt').val())


}

function Show_Item(grcode, stcode, price, weight_stable, fixed_weight) {

	$('#weight_stable').val(weight_stable);
	$('#fixed_weight').val(fixed_weight);

	Datasource = { grcode: grcode, stcode: stcode, price: price, weight_stable: weight_stable, fixed_weight: fixed_weight }

	$.post("https://tidmunzbuffet.com/api_app/barcode/getsup_barcode.php", { grcode: grcode, stcode: stcode }, function (grdetail) {
		// console.log(grdetail);
		let result = JSON.parse(grdetail)

		if (weight_stable == 'Y') {
			$('#TM_Table_NO_WEIGHT tbody').empty();
			$('#tx_noweight').show();
			$('#tx_unitweigt').hide();
			$('#TM_Table_NO_WEIGHT').show();
			$('#TM_Table_Quantity').hide();
		}
		else {
			$('#TM_Table_Quantity tbody').empty();
			$('#tx_noweight').hide();
			$('#tx_unitweigt').show();
			$('#TM_Table_Quantity').show();
			$('#TM_Table_NO_WEIGHT').hide();
		}

		for (let i in result) {
			let barcode_status
			let button_printf
			if (result[i].barcode_status === "ยังไม่ออก barcode") {
				barcode_status = '<td style="text-align: center;color : red;">' + result[i].barcode_status + '</td>'
				button_printf = '<td><button class="btn btn-success" onclick="PrintBarcode(\'' + result[i].stcode + '\',\'' + result[i].grcode + '\',\'' + result[i].no + '\',\'' + price + '\',\'' + result[i].stname + '\');"><i class="fa fa-print"></i> Print</button></td>'
			}
			else {
				barcode_status = '<td style="text-align: center;color : green;">' + result[i].barcode_status + '</td>'
				button_printf = '<td><button class="btn btn-secondary" onclick="RePrintBarcode(\'' + result[i].barcode_id + '\',\'' + result[i].no + '\');"><i class="fa fa-print"></i> Print</button></td>'

			}
			tb = '';
			if (weight_stable == 'Y') {
				tb += '<tr id="' + (i + 1) + ' "><td ><input type="checkbox" id="' + result[i].no + '" class="check_box"/></td><td style="text-align: center;"><span name="order_no">' + result[i].no + '</span><span style="display:none;" name="barcode_id">' + result[i].barcode_id + '</span></td><td>' + result[i].stcode + '</td><td>' + result[i].stname + '</td><td  style="text-align: right;" >' + result[i].unit_weight + '</td>' + barcode_status + '</tr>';
				$(tb).appendTo("#TM_Table_NO_WEIGHT");
			}
			else {
				tb += '<tr id="' + (i + 1) + '"><td  style="text-align: center;">' + result[i].no + '.' + '</td><td>' + result[i].stcode + '</td><td>' + result[i].stname + '</td><td  style="text-align: right;" >' + result[i].unit_weight + '</td>' + barcode_status + button_printf + '</tr>';
				$(tb).appendTo("#TM_Table_Quantity");
			}


		}


	}).fail(function (error) {

		$('#txtresult').text('อินเตอร์เน็ตมีปัญหา เชื่อมต่อไม่ได้')
	});

}

$(document).on('click', '.checkall', function () {
	if (this.checked) {
		$(".check_box").prop("checked", true);
		$("#btnPrint").show()
	} else {
		$(".check_box").prop("checked", false);
		$("#btnPrint").hide()
	}
});

$(document).on('click', '.check_box', function () {
	$("#btnPrint").show()

});

$('#btnPrint').on("click", function () {
	var checkedValue=[]
	$(".check_box:checkbox:checked").each(function () {
		// checkedValue.push() //push value in array
		let order_no = $(this).closest("tr").find("[name=order_no]").text()
		let barcode_id = $(this).closest("tr").find("[name=barcode_id]").text()
		checkedValue.push({order_no,barcode_id})
	})
	checkedValue.push({Datasource})
	// console.log(checkedValue)
	
	// "https://tidmunzbuffet.com/api_app/barcode/add_muti_barcode.php",
	$.post(
		"http://localhost/Tidmun-GR/api_app/barcode/add_muti_barcode.php",
		{
			master:Datasource,
			detail:checkedValue
		},
		function (r2) {
			
			let response = JSON.parse(r2);

			ipc.send('message:printtags', response);

			Show_Item(response.grcode, response.stcode, price, $('#weight_stable').val(), $('#fixed_weight').val(),response.cost);

		}
	).fail(function (error) {

		$('#txtresult').text('อินเตอร์เน็ตมีปัญหา เชื่อมต่อไม่ได้')
	});

	// console.log(checkedValue)
});