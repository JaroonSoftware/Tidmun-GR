<?php
// error_reporting(E_ALL);
ini_set('display_errors', 1);
date_default_timezone_set('Asia/Bangkok');
error_reporting(E_ERROR | E_PARSE);

include '../conn.php';
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $rest_json = file_get_contents("php://input");
    // $_POST = json_decode($rest_json, true); 
    extract($_POST, EXTR_OVERWRITE, "_");

    // var_dump($detail);     
    // $detail;

    // echo $master['stcode'];

    // $resultprint=$detail;

    // echo $detail;

    foreach ($detail as $ind => $val) {
        // echo($val['barcode_id']);     
        // $response += $val['order_no'];
        // $resultprint[$ind]
        if ($val['barcode_id'] === 'null') {

            // $detail[$ind]['barcode_id'] = '1';
            $sql = "INSERT INTO items_barcode
                (stcode,unit_weight, grcode, barcode_status, socode, dncode, created_date)
                VALUES(:stcode,:unit_weight, :grcode, 'อยู่ในสต๊อก', NULL, NULL, current_timestamp())";

            $stmt = $conn->prepare($sql);
            if (!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}");

            $stmt->bindParam(":stcode", $master['stcode'], PDO::PARAM_STR);
            $stmt->bindValue(":unit_weight", number_format($master['fixed_weight'], 2), PDO::PARAM_STR);
            $stmt->bindValue(":grcode", $master['grcode'], PDO::PARAM_STR);

            if (!$stmt->execute()) {
                $error = $conn->errorInfo();
                throw new PDOException("Insert data error => $error");
                die;
            }
            $barcode_id = $conn->lastInsertId();
            // echo $barcode_id;
            $sql = "
                update grbarcode 
                set
                unit_weight = :unit_weight,
                barcode_status = 'ออก barcode แล้ว',
                barcode_id = :barcode_id,
                barcode_date = CURRENT_TIMESTAMP()
                where grcode = :grcode and stcode = :stcode and order_no = :order_no";

            $stmt = $conn->prepare($sql);
            if (!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}");

            $stmt->bindValue(":unit_weight", number_format($master['fixed_weight'], 2), PDO::PARAM_STR);
            $stmt->bindValue(":barcode_id", $barcode_id, PDO::PARAM_STR);
            $stmt->bindParam(":order_no", $val['order_no'], PDO::PARAM_STR);
            $stmt->bindParam(":stcode", $master['stcode'], PDO::PARAM_STR);
            $stmt->bindValue(":grcode", $master['grcode'], PDO::PARAM_STR);

            if (!$stmt->execute()) {
                $error = $conn->errorInfo();
                throw new PDOException("Insert data error => $error");
                die;
            }

            $detail[$ind]['barcode_id'] = $barcode_id;
        }
    }

    // foreach ($detail as $ind => $val) {
    //     if ($val['barcode_id'] !== 'null') 
    //     echo $val['barcode_id'];
    // }

    // echo $_POST['detail'];
    // var_dump($detail);     

    $strSQL = "SELECT count(id) as count FROM `grbarcode` where barcode_status!='ออก barcode แล้ว' and grcode = '" . $master['grcode'] . "' and stcode = '" . $master['stcode'] . "' ";
    $stmt = $conn->prepare($strSQL);
    $stmt->execute();
    $res = $stmt->fetch(PDO::FETCH_ASSOC);
    extract($res, EXTR_OVERWRITE, "_");
    if ($count == 0) {

        $sql = "
                        update grmaster 
                        set
                        doc_status = 'ชั่งสินค้าครบแล้ว',
                        updated_date = CURRENT_TIMESTAMP()
                        where grcode = :grcode ";

        $stmt = $conn->prepare($sql);
        if (!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}");

        $stmt->bindValue(":grcode", $master['grcode'], PDO::PARAM_STR);

        if (!$stmt->execute()) {
            $error = $conn->errorInfo();
            throw new PDOException("Insert data error => $error");
            die;
        }
    }
    // var_dump()
    // echo $detail['barcode_id'];
    // $conn->commit();
    if ($stmt->execute()) {
        http_response_code(200);
        $response = ['status' => 1, 'message' => 'เพิ่มข้อมูลสำเร็จ', 'detail' => $detail, 'stcode' => $master['stcode'], 'stname' => $master['stname'],'price' => $master['price'], 'grcode' => $master['grcode'], 'unit_weight' => number_format($master['fixed_weight'], 2)];
    } else {
        $response = ['status' => 0, 'message' => 'Error! ติดต่อโปรแกรมเมอร์'];
    }
} else {
    http_response_code(400);
    echo json_encode(array('status' => 2, 'message' => 'ข้อมูลซ้ำ'));
}

echo json_encode($response);
