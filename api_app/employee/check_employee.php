<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Headers: *");
// header("Access-Control-Allow-Methods: *");

include '../conn.php';
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    
    $sql = "SELECT count(empcode) as count FROM employee where empcode = '".$_POST['empcode']."' and active_status = 'Y' ";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $res = $stmt->fetch(PDO::FETCH_ASSOC);
    extract($res, EXTR_OVERWRITE, "_");
    if($count)
    {
    $sql = "SELECT empcode,firstname,COALESCE(lastname, '') as lastname,DATE_FORMAT(CURRENT_TIMESTAMP(), '%d-%m-%Y %H:%i:%S') as display_date,CURRENT_TIMESTAMP() as create_date,1 as status FROM employee where empcode = '".$_POST['empcode']."' ";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    http_response_code(200);
    echo json_encode(array('status' => '1', 'data' => $data));
    }
    else {
        http_response_code(200);        
        echo json_encode(array('status' => '2', 'message' => 'ไม่พบรหัสพนักงานนี้กรุณาแจ้ง HR'));
    }
} else {
    http_response_code(400);
    echo json_encode(array('status' => '0', 'message' => 'request method fail.'));
}
