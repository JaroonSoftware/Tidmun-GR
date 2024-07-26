<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include '../conn.php';

$sql = "SELECT a.id,a.shrimp_shell,a.remark,CONCAT(e.empcode,' ',e.firstname,' ',COALESCE(e.lastname, '')) as empcode,FORMAT(a.unit_weight, 2) as unit_weight,CONCAT(c.spec_name,' ',c.spec_type,' ',d.size_min,'/',d.size_max) as product_weight,a.active_status
,DATE(a.create_date) as date,TIME(a.create_date) as time
FROM weight_record as a left join product as b on a.product_id = b.product_id left join product_spec as c 
                on (b.product_spec_id=c.spec_id) left join product_size as d on (b.product_size_id=d.productsizeid) 
                left join employee as e on (a.empcode=e.empcode) "; 
$sql .= " where a.id = '".$_POST['idcode']."'";
// echo $sql;
$stmt = $conn->prepare($sql);
$stmt->execute();
$data = $stmt->fetch(PDO::FETCH_ASSOC);



http_response_code(200);
echo json_encode($data);