<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Headers: *");
// header("Access-Control-Allow-Methods: *");
date_default_timezone_set('Asia/Bangkok');

include '../conn.php';
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $sql = "SELECT a.id,a.empcode,b.firstname,COALESCE(b.lastname, '') as lastname,a.shrimp_shell,FORMAT(unit_weight, 2) as unit_weight,DATE_FORMAT(a.create_date, '%d-%m-%Y %H:%i:%S') AS create_date FROM weight_record as a ";
    $sql .= " inner join employee as b on (a.empcode=b.empcode) ";
    $sql .= " where date(a.create_date) = CURDATE() ";
    $sql .= " order by a.create_date desc ";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    http_response_code(200);
    echo json_encode($data);
} else {
    http_response_code(400);
    echo json_encode(array('status' => '0', 'message' => 'request method fail.'));
}
