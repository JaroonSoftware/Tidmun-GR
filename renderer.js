const { ipcRenderer } = require("electron");

ipcRenderer.on("got-access-token", (event, accessToken) => {
  // data = accessToken.split(",");
  let grcode = accessToken;
 
  $.post("https://tidmunzbuffet.com/api_app/gr/getsup_gr.php", { grcode: grcode }, function (r) {
    // console.log(r)
    // console.log("888")
    let data = JSON.parse(r)

    for (let c in data) {
      $('#showdata').append("<option value=" + data[c].grcode + " >" + data[c].grdate + "</option>")
    }
  });
 
});

ipcRenderer.on("get-token", (event) => {

    $('#tbmain tbody').empty();
  $.post(
    "https://tidmunzbuffet.com/api_app/weight_record/get_record.php",
    function (r) {
      let result = JSON.parse(r);

      for (let i in result) {
        tb = "";
        tb +=
          '<tr id="' +
          (i + 1) +
          '"><td>' +
          result[i].create_date +
          "</td><td>" +
          result[i].empcode +
          "</td><td>" +
          result[i].firstname +
          " " +
          result[i].lastname +
          "</td><td>" +
          result[i].unit_weight +
          "</td><td>" +
          result[i].shrimp_shell +
          '</td><td><button class="btn btn-secondary" onclick="EditWindow(' +
          result[i].id +
          ');"> Edit</button></td>';
        tb += "</tr>";
        $(tb).appendTo("#tbmain");
      }
      $("#tx_empcode").focus();
    }
  );
});

ipcRenderer.on("delete-token", (event) => {

  $('#tbmain tbody').empty();
$.post(
  "https://tidmunzbuffet.com/api_app/weight_record/get_record.php",
  function (r) {
    let result = JSON.parse(r);

    for (let i in result) {
      tb = "";
      tb +=
        '<tr id="' +
        (i + 1) +
        '"><td>' +
        result[i].create_date +
        "</td><td>" +
        result[i].empcode +
        "</td><td>" +
        result[i].firstname +
        " " +
        result[i].lastname +
        "</td><td>" +
        result[i].unit_weight +
        "</td><td>" +
        result[i].shrimp_shell +
        '</td><td><button class="btn btn-secondary" onclick="EditWindow(' +
        result[i].id +
        ');"> Edit</button></td>';
      tb += "</tr>";
      $(tb).appendTo("#tbmain");
    }
    $("#tx_empcode").focus();
  }
);
});

