<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include('../../dbcon.php');
include('../../session.php');

mysqli_autocommit($con,FALSE);

$input = json_decode(file_get_contents('php://input'));
$list = $input->Invoices;
$sql = "";
foreach($list as $item) {
    $sqlinsert = "INSERT INTO `StockOutInvoice`(`InvoiceNo`,
    `InvoiceDate`, `Type`,`Customer`, `ContactNo`, `Address` ) 
    VALUES ('$item->InvoiceNo','$item->InvoiceDate','$item->Type',  
    '$item->Customer', '$item->ContactNo', '$item->Address')";

    $sqlupdate = " UPDATE `StockOutInvoice`
        SET `InvoiceNo` = '$item->InvoiceNo',`InvoiceDate` = '$item->InvoiceDate',`Type` = '$item->Type',
        `Customer` = '$item->Customer',`ContactNo` = '$item->ContactNo',`Address` = '$item->Address'
        WHERE `ID`='$item->ID'";

    $sqldelete = " DELETE FROM `StockOutInvoice` WHERE `ID`='$item->ID'";
    

    $sql=$sqlinsert;
    // Delete
    if($item->deleted) 
        $sql = $sqldelete;
    else if(!empty($item->ID))
        $sql = $sqlupdate;
    else
        $sql = $sqlinsert;

    mysqli_query($con, $sql);

}

$list = $input->Payments;
$sql = "";

foreach($list as $item) {
    $sqlinsert = "INSERT INTO `StockOutInvoicePayment`(`PaymentDate`,`Amount`,`Type`, `CheckDate`,`InvoiceNo`) 
    VALUES ('$item->PaymentDate',$item->Amount, '$item->Type','$item->CheckDate','$item->InvoiceNo')";

    $sqlupdate = " UPDATE `StockOutInvoicePayment`
        SET `PaymentDate` = '$item->PaymentDate',`Amount` = $item->Amount,`Type` = '$item->Type',`CheckDate` = '$item->CheckDate'`InvoiceNo` = '$item->InvoiceNo'
        WHERE `ID`='$item->ID'";

    $sqldelete = " DELETE FROM `StockOutInvoicePayment` WHERE `ID`='$item->ID'";
    

    $sql=$sqlinsert;
    // Delete
    if($item->deleted) 
        $sql = $sqldelete;
    else if(!empty($item->ID))
        $sql = $sqlupdate;
    else
        $sql = $sqlinsert;

    mysqli_query($con, $sql);
}


if (mysqli_commit($con))
    echo json_encode(array("statusCode" => 200));
else
    echo json_encode(array("statusCode" => 201));

?>
