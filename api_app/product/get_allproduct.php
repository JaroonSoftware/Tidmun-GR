<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Headers: *");
// header("Access-Control-Allow-Methods: *");

include '../conn.php';
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $sql = "SELECT a.product_id, b.spec_name ,b.spec_type , c.size_min ,c.size_max , a.cost
    FROM product as a
    inner join product_spec as b on (a.product_spec_id=b.spec_id)
    inner join product_size as c on (a.product_size_id=c.productsizeid)  
    where a.active_status  = 'Y' ";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    http_response_code(200);
    echo json_encode($data);
} else {
    http_response_code(400);
    echo json_encode(array('status' => '0', 'message' => 'request method fail.'));
}
