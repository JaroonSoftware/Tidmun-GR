<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include '../conn.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
$sql = "SELECT * FROM `grmaster` as a INNER JOIN grdetail as b on a.grcode= b.grcode left join items as i on b.stcode = i.stcode LEFT JOIN supplier as s on a.supcode = s.supcode ";
$sql .= " where a.grcode = '" . $_POST['grcode'] . "' ";
// echo $sql;
$stmt = $conn->prepare($sql);
$stmt->execute();
$data = $stmt->fetch(PDO::FETCH_ASSOC);


http_response_code(200);
echo json_encode($data);
} else {
    http_response_code(400);
    echo json_encode(array('status' => '0', 'message' => 'request method fail.'));
}