<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include('../../dbcon.php');
include('../../session.php');

$quotationNo = mysqli_real_escape_string($con, $_POST['quotationNo']);

$sqlSelect = "SELECT `QuotationNo` FROM `QuotationHistoryAC` WHERE `QuotationNo` = '$quotationNo';";


//echo $sql;
$result = mysqli_query($con, $sqlSelect ); 

if(!$result) {
    echo (json_encode(array("statusCode" => 201, "errorDescription"=>mysqli_error($con) )));
}
// Quotation Exists
else {
    echo (json_encode(array("statusCode" => 200, "result" => mysqli_num_rows($result) )));
}


?>