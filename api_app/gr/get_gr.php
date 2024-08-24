<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
date_default_timezone_set('Asia/Bangkok');

include '../conn.php';
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    

    extract($_POST, EXTR_OVERWRITE, "_"); 
    
    $grcode = !empty($grcode) ? "and a.grcode like '%$grcode%'" : "";
    $supcode = !empty($supcode) ? "and c.supcode like '%$supcode%'" : "";
    $supname = !empty($supname) ? "and c.supname like '%$supname%'" : "";
    
    $grdate = "";
    $sql = " 
        select 
        a.*,
        c.*,
        concat(u.firstname, ' ', u.lastname) created_name
        from grmaster a        
        left join supplier c on (a.supcode = c.supcode)
        left join `user` u on (a.created_by = u.user_code)
        where a.active_status = 'Y' and doc_status = 'รอชั่งสินค้า'
        $grcode
        $supcode
        $supname
        $grdate
        order by a.created_date desc ;";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    http_response_code(200);
    echo json_encode($data);
    // echo json_encode(array('status' => '1', 'data' => $data, 'sql' => str_replace(' ', '', $sql)));
} else {
    http_response_code(400);
    echo json_encode(array('status' => '0', 'message' => 'request method fail.'));
}
