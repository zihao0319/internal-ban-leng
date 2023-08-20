<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include('../../dbcon.php');
include('../../session.php');

$input = json_decode(file_get_contents('php://input'));

$sql = "INSERT INTO `QuotationHistory`(`QuotationNo`, `Date`, `JobDepartment`, 
    `ACUnit`, `RequisitionNo`, `DeliveryNo`, `ServiceNo`, `PONo`, `InvoiceNo`, `PODate`, `InvoiceDate`, `ServiceNoDate`,
    `ServiceNoPrice`, `POPrice`, `InvoicePrice`, `CustomerName`,`CustomerAddress`, `Phone`, `Fax`, `RegNo`, 
    `AttnPerson`, `AttnPhone`, `Email`, `Remark` ,`HasRefund`, `RefundDescription`, `RefundUnit`, 
    `RefundUOM`, `RefundPrice`, `PreText`, `PostText`, `StartWith`, `EndWith`, `IsACInfoOverride`, `ACInfoOverride`,`QuotationTotal`
    ,`ScopeOfWork`,`PaymentMode`,`JobStatus`) 
	VALUES ('$input->quotationNo','$input->date','$input->jobDepartment', '$input->acUnit', '$input->reqNo','$input->deliveryNo','$input->serviceNo',
    '$input->poNo','$input->invoiceNo','$input->poDate','$input->invoiceDate','$input->serviceDate','$input->servicePrice','$input->poPrice','$input->invoicePrice',
    '$input->customerName','$input->customerAddress','$input->phone','$input->fax','$input->regNo','$input->attnPerson','$input->attnPhone','$input->email','$input->remark',
    '$input->hasRefund','$input->refundDescription','$input->refundQty','$input->refundUOM','$input->refundPrice','$input->preText','$input->postText','$input->startWith','$input->endWith',
    '$input->isACInfoOverride','$input->overrideACInfo','$input->quotationTotal','$input->scopeOfWork', '$input->paymentMode','$input->jobStatus');";

$sql2 = "UPDATE `GlobalParam` SET `LastRecordYear`='$input->year',`LastRecordMonth`='$input->month',`LastRecordQID`='$input->qid',`LastRecordDO`='$input->doid';";

$sqlSelect = "SELECT `QuotationNo` FROM `QuotationHistory` WHERE `QuotationNo` = '$input->quotationNo';";
$sqlDelete1 = "DELETE FROM `QuotationHistory` WHERE `QuotationNo` = '$input->quotationNo';";
$sqlDelete2 = "DELETE FROM `QuotationHistoryItem` WHERE `QuotationNo` = '$input->quotationNo';";

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
}

// Insert rows
mysqli_query($con, $sql);

// Update global parameters
if(!$isUpdate) {
    mysqli_query($con, $sql2);
}

// Add Items
$itemlist = $input->Items;
foreach($itemlist as $item) {
    $sqlitem = "INSERT INTO `QuotationHistoryItem`(`QuotationNo`, `HorsePower`, `ACType`, `Feature`, 
            `GasType`, `Brand`, `ModelIndoor`, `ModelOutdoor`, `ActionID`, `UnitPrice`, `Unit`, `UOM`) 
            VALUES ('$item->quotationNo','$item->horsepower','$item->actype', '$item->feature', '$item->gastype','$item->brand','$item->modelIndoor',
            '$item->modelOutdoor','$item->actionID','$item->unitPrice','$item->unit' ,'$item->uom')";
    mysqli_query($con, $sqlitem);
}

if(mysqli_commit($con)) {
    echo json_encode(array("statusCode" => 200));
}
else {
    echo (json_encode(array("statusCode" => 201, "errorDescription"=>mysqli_error($con) )));
}

?>