<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
date_default_timezone_set('Asia/Bangkok');

include '../conn.php';
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // var_dump($_POST);     

    $strSQL = "SELECT a.barcode_id,a.stcode,i.stname,a.grcode,a.unit_weight,i.price  FROM `items_barcode` as a inner join items as i on (a.stcode=i.stcode) where a.barcode_id = '" . $_POST['barcode_id'] . "'  ";
    $stmt = $conn->prepare($strSQL);
    $stmt->execute();
    $res = $stmt->fetch(PDO::FETCH_ASSOC);
    extract($res, EXTR_OVERWRITE, "_");

    $detail[0]['barcode_id'] = $barcode_id;
    $detail[0]['order_no'] = $_POST['order_no'];   

    // $conn->commit();
    if ($stmt->execute()) {
        http_response_code(200);
        $response = ['status' => 1, 'message' => 'เตรียมข้อมูลสำเร็จ', 'detail' => $detail, 'stcode' => $stcode, 'stname' => $stname,'price' => $price, 'grcode' => $grcode, 'unit_weight' => number_format($unit_weight, 2)];
        
    } else {
        $response = ['status' => 0, 'message' => 'Error! ติดต่อโปรแกรมเมอร์'];
    }
} else {
    http_response_code(400);
    echo json_encode(array('status' => 2, 'message' => 'ข้อมูลซ้ำ'));
}

echo json_encode($response);
