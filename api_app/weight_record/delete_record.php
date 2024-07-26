<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
date_default_timezone_set('Asia/Bangkok');

include '../conn.php';
if ($_SERVER["REQUEST_METHOD"] == "POST") {

        $sql = "delete from weight_record where id = :id";

        $stmt = $conn->prepare($sql); 
        if (!$stmt->execute([ 'id' => $_POST['id'] ])){
            $error = $conn->errorInfo();
            throw new PDOException("Remove data error => $error");
            $response = ['status' => 0, 'message' => 'อินเตอร์เน็ตมีปัญหา เชื่อมต่อไม่ได้'];
        }            

        http_response_code(200);
        $response = ['status' => 1, 'message' => 'ลบข้อมูลสำเร็จ !'];
} else {
    http_response_code(400);
    echo json_encode(array('status' => 2, 'message' => 'ข้อมูลซ้ำ'));
}

echo json_encode($response);
