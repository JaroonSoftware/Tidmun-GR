<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
date_default_timezone_set('Asia/Bangkok');

include '../conn.php';
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $sql = "
        update weight_record
        set
        shrimp_shell = :shrimp_shell,
        remark = :remark,
        update_date = CURRENT_TIMESTAMP()
        where id = :id";
        // echo $sql;

    $stmt = $conn->prepare($sql);
    if (!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}");

    $stmt->bindParam(":id", $_POST['id'], PDO::PARAM_STR);
    $stmt->bindValue(":shrimp_shell", $_POST['shrimp_shell'], PDO::PARAM_STR);
    $stmt->bindValue(":remark", $_POST['remark'], PDO::PARAM_STR);

    if ($stmt->execute()) {
        http_response_code(200);
        $response = ['status' => 1, 'message' => 'บันทึกข้อมูลสำเร็จ !'];
    } else {
        $response = ['status' => 0, 'message' => 'อินเตอร์เน็ตมีปัญหา เชื่อมต่อไม่ได้'];
    }
} else {
    http_response_code(400);
    echo json_encode(array('status' => 2, 'message' => 'ข้อมูลซ้ำ'));
}

echo json_encode($response);
