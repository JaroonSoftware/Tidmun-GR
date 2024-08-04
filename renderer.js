const { ipcRenderer } = require("electron");

ipcRenderer.on("got-access-token", (event, accessToken) => {
  // data = accessToken.split(",");
  let grcode = accessToken;

  $('#showdata').val(grcode)
  
  $.post("https://tidmunzbuffet.com/api_app/gr/getsup_gr.php", { grcode: grcode }, function (r) {

    let result = JSON.parse(r)
    // alert(result.stcode)
    $('#tbmain tbody').empty();

    for (let i in result) {
      tb = '';
      tb += '<tr id="' + (i + 1) + '"><td>' + result[i].stcode + '</td><td>' + result[i].stname + '</td><td>' + result[i].qty + '</td><td>' + result[i].price + '</td><td>' + result[i].totalprice + '</td><td><button class="btn btn-secondary" onclick="PrintBarcode(' + result[i].grcode + ');"> Print</button></td>';
      tb += '</tr>';
      $(tb).appendTo("#tbmain");
    }

  }).fail(function (error) {

    $('#txtresult').text('อินเตอร์เน็ตมีปัญหา เชื่อมต่อไม่ได้')
  });



});

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

