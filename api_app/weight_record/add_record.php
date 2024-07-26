<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Headers: *");
// header("Access-Control-Allow-Methods: *");
date_default_timezone_set('Asia/Bangkok');

include '../conn.php';
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // var_dump($_POST);     

    $sql = "SELECT id,unit_weight,empcode,create_date
    FROM yeeninfr_db.weight_record ORDER BY id DESC LIMIT 1 ";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $res = $stmt->fetch(PDO::FETCH_ASSOC);
    extract($res, EXTR_OVERWRITE, "_");
    $differenceInSeconds =  strtotime($create_date) - strtotime(date("Y-m-d h:i:s"));

    // if (((int)$differenceInSeconds>5)||number_format($_POST['unit_weight'],2)!=number_format($unit_weight,2)) {
    // if (number_format($_POST['unit_weight'], 2) != number_format($unit_weight, 2) ) {
    if (number_format($_POST['unit_weight'], 2) == number_format($unit_weight, 2) && $_POST['empcode'] == $empcode) {
        $response = ['status' => 2, 'message' => 'ข้อมูลซ้ำ'];
    } else {
        $sql = "insert weight_record 
        (`empcode`, `unit_weight`, `product_id`,`shrimp_shell`, `create_date`) 
        values (:empcode,:unit_weight,:product_id,0,:create_date)";

        $stmt = $conn->prepare($sql);
        if (!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}");

        $stmt->bindParam(":empcode", $_POST['empcode'], PDO::PARAM_STR);
        $stmt->bindValue(":unit_weight", number_format($_POST['unit_weight'], 2), PDO::PARAM_STR);
        $stmt->bindValue(":product_id", $_POST['product_id'], PDO::PARAM_STR);
        $stmt->bindValue(":create_date", $_POST['create_date'], PDO::PARAM_STR);

        if ($stmt->execute()) {
            http_response_code(200);
            $response = ['status' => 1, 'message' => 'เพิ่มข้อมูลสำเร็จ', 'id' => $conn->lastInsertId()];
        } else {
            $response = ['status' => 0, 'message' => 'Error! ติดต่อโปรแกรมเมอร์'];
        }        
    }
} else {
    http_response_code(400);
    echo json_encode(array('status' => 2, 'message' => 'ข้อมูลซ้ำ'));
}

echo json_encode($response);
