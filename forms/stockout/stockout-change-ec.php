<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include('../../dbcon.php');
include('../../session.php');

mysqli_autocommit($con,FALSE);

$input = json_decode(file_get_contents('php://input'));
$stockoutId = $input->StockOutID;
$list = $input->StockOutExtraCharges;
$sqldelete = "DELETE FROM `StockOutExtraCharge` WHERE `StockOutID`='$stockoutId'";
mysqli_query($con, $sqldelete);

foreach($list as $item) {
    $sqlinsert = "INSERT INTO `StockOutExtraCharge`(`StockOutID`, `Description`, `UnitPrice`, `Unit`, `UOM`) 
                VALUES ('$item->StockOutID','$item->Description', $item->UnitPrice, $item->Unit, '$item->UOM')";  
    mysqli_query($con, $sqlinsert);
}


if (mysqli_commit($con)) {
    echo json_encode(array("statusCode" => 200));
}
else {
    echo json_encode(array("statusCode" => 201));
}

?>
