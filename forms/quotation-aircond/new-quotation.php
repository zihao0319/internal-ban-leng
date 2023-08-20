<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include('../../dbcon.php');
include('../../session.php');

$input = json_decode(file_get_contents('php://input'));

$sql = "INSERT INTO `QuotationHistoryAC`(`QuotationNo`, `Date`, `JobDepartment`, 
    `ACUnit`, `RequisitionNo`, `DeliveryNo`, `ServiceNo`, `PONo`, `InvoiceNo`, `PODate`, `InvoiceDate`, `ServiceNoDate`,
    `ServiceNoPrice`, `POPrice`, `InvoicePrice`, `CustomerName`,`CustomerAddress`, `Phone`, `Fax`, `RegNo`, 
    `AttnPerson`, `AttnPhone`, `Email`, `Remark` ,`HasRefund`, `RefundDescription`, `RefundUnit`, 
    `RefundUOM`, `RefundPrice`,`QuotationTotal`,`PaymentMode`,`JobStatus`,`HasFixedTotal`,`FixedTotal`,`PeriodOfWarranty`) 
	VALUES ('$input->quotationNo','$input->date','$input->jobDepartment', '$input->acUnit', '$input->reqNo','$input->deliveryNo','$input->serviceNo',
    '$input->poNo','$input->invoiceNo','$input->poDate','$input->invoiceDate','$input->serviceDate','$input->servicePrice','$input->poPrice','$input->invoicePrice',
    '$input->customerName','$input->customerAddress','$input->phone','$input->fax','$input->regNo','$input->attnPerson','$input->attnPhone','$input->email','$input->remark',
    '$input->hasRefund','$input->refundDescription','$input->refundQty','$input->refundUOM','$input->refundPrice','$input->quotationTotal',
    '$input->paymentMode','$input->jobStatus','$input->hasFixedTotal','$input->fixedTotal','$input->periodOfWarranty');";

$sql2 = "UPDATE `GlobalParam` SET `LastRecordYear`='$input->year',`LastRecordMonth`='$input->month',`LastRecordQID`='$input->qid',`LastRecordDO`='$input->doid';";

$sqlSelect = "SELECT `QuotationNo` FROM `QuotationHistoryAC` WHERE `QuotationNo` = '$input->quotationNo';";
$sqlDelete1 = "DELETE FROM `QuotationHistoryAC` WHERE `QuotationNo` = '$input->quotationNo';";
$sqlDelete2 = "DELETE FROM `QuotationHistoryItemAC` WHERE `QuotationNo` = '$input->quotationNo';";
$sqlDelete3 = "DELETE FROM `QuotationHistorySOWAC` WHERE `QuotationNo` = '$input->quotationNo';";

//echo $sql;
$result = mysqli_query($con, $sqlSelect ); 
$isUpdate = false;

if(!$result) {
    echo (json_encode(array("statusCode" => 201, "errorDescription"=>mysqli_error($con) )));
}

mysqli_autocommit($con,FALSE);
// Quotation Exists, delete existing rows
if( mysqli_num_rows($result) > 0 ) {
    $isUpdate = true;
    mysqli_query($con, $sqlDelete1);
    mysqli_query($con, $sqlDelete2); 
    mysqli_query($con, $sqlDelete3);
}

// Insert rows
mysqli_query($con, $sql);

// Update global parameters
if(!$isUpdate) {
    mysqli_query($con, $sql2);
}

// Add AC Items
$aclist = $input->Items;
foreach($aclist as $item) {
    $sqlac = "INSERT INTO `QuotationHistoryItemAC`(`QuotationNo`, `Job`, `Description`, `UnitPrice`, `Unit`, `UOM`, `RowIndex`, `Category`) 
            VALUES ('$item->quotationNo','$item->job','$item->description','$item->unitPrice','$item->unit' ,'$item->uom','$item->index','$item->category')";
    mysqli_query($con, $sqlac);
}

// Add SOW Items
$sowlist = $input->SOW;
foreach($sowlist as $item) {
    $sqlsow = "INSERT INTO `QuotationHistorySOWAC`(`QuotationNo`, `Job`, `Text`, `RowIndex`) 
    VALUES ('$item->quotationNo','$item->job','$item->text','$item->index')";
    mysqli_query($con, $sqlsow);
}

if(mysqli_commit($con)) {
    echo json_encode(array("statusCode" => 200));
}
else {
    echo (json_encode(array("statusCode" => 201, "errorDescription"=>mysqli_error($con) )));
}

?>