<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include '../conn.php';

// echo $_POST['barcode_id'];
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $sql = "SELECT a.order_no, a.stcode,i.stname , a.grcode,a.unit_weight, a.barcode_status ,a.barcode_id
    FROM tidmunzb_db.grbarcode a 
    left outer join items i on (a.stcode=i.stcode)
    where a.grcode = '" . $_POST['grcode'] . "' and a.stcode = '" . $_POST['stcode'] . "' ";
    // echo $sql;
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    http_response_code(200);
    echo json_encode($data);
} else {
    http_response_code(400);
    echo json_encode(array('status' => '0', 'message' => 'request method fail.'));
}
