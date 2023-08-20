<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include('../../dbcon.php');
include('../../session.php');

mysqli_autocommit($con,FALSE);

$input = json_decode(file_get_contents('php://input'));
$list = $input->Orders;
$sql = "";
foreach($list as $item) {
    $sqlselect = "SELECT * FROM `StockOut` WHERE `ID`='$item->ID'";
    $sqlinsert = "INSERT INTO `StockOut`(`OrderDate`,
    `InvoiceNo`,`SalesOrderNo`, `Model`, `Unit`, `Price`, `JobType`,`salesperson`, `Note`, `SerialNo`,`ExpectedDeliveryDate`,`ETI`,`ETIref` ) 
    VALUES ('$item->OrderDate','$item->InvoiceNo','$item->SalesOrderNo', '$item->Model', $item->Unit, $item->Price, 
    '$item->JobType', '$item->salesperson','$item->Note','$item->SerialNo','$item->ExpectedDeliveryDate','$item->ETI','$item->ETIref')";

    $sqlupdate = " UPDATE `StockOut`
        SET `OrderDate` = '$item->OrderDate',`InvoiceNo` = '$item->InvoiceNo',`KaltNo` = '$item->KaltNo',
        `SalesOrderNo` = '$item->SalesOrderNo',`Model` = '$item->Model',`Unit` = $item->Unit,`Price` = $item->Price,
        `JobType`= '$item->JobType',`salesperson`= '$item->salesperson',`Note`= '$item->Note',`SerialNo`= '$item->SerialNo',
        `ExpectedDeliveryDate` = '$item->ExpectedDeliveryDate',
        `ETI` = '$item->ETI',`ETIref` = '$item->ETIref'  
        WHERE `ID`='$item->ID'";

    $sqldelete = " DELETE FROM `StockOut` WHERE `ID`='$item->ID'";
    $sqldeleteec = "DELETE FROM `StockOutExtraCharge` WHERE `StockOutID`='$item->ID'";
    

    $sql=$sqlinsert;
    if($item->deleted || !empty($item->ID)) {
        $sql = $sqlselect;
        if($result = mysqli_query($con, $sql)) {
            $current_stockout = mysqli_fetch_assoc($result);
            $unit = $current_stockout["Unit"];
            $model = $current_stockout["Model"];
            $invoice = $current_stockout["InvoiceNo"];

            // Delete
            if($item->deleted) {
                addBalance($model, $unit, $invoice, $con);
                $sql = $sqldelete;
                mysqli_query($con, $sqldeleteec);
            }
            // Update
            else if(!empty($item->ID)) {
                if($model != $item->Model 
                || $unit != $item->Unit
                || $invoice != $item->InvoiceNo) {
                    addBalance($model, $unit, $invoice, $con);
                    minusBalance($item->Model, $item->Unit, $item->InvoiceNo, $con);
                }
                $sql = $sqlupdate;
            }
        }
    }
    else{
        minusBalance($item->Model, $item->Unit, $item->InvoiceNo, $con);
        $sql = $sqlinsert;
    }

    mysqli_query($con, $sql);
}


if (mysqli_commit($con)) {
    echo json_encode(array("statusCode" => 200));
}
else {
    echo json_encode(array("statusCode" => 201));
}

function minusBalance($model, $unit, $invoice, $con) {
    minusBalanceActual($model, $unit, $con);
    if(!empty($invoice)){
        minusBalanceFloor($model, $unit, $con);
    }
}

function addBalance($model, $unit, $invoice, $con) {
    addBalanceActual($model, $unit, $con);
    if(!empty($invoice)){
        addBalanceFloor($model, $unit, $con);
    }
}

function minusBalanceActual($model, $unit, $con) {
    $sql = "UPDATE `ACPrice` 
        SET BalanceActual = BalanceActual - $unit
        WHERE `Model`='$model'";
    mysqli_query($con, $sql);
}

function minusBalanceFloor($model, $unit, $con) {
    $sql = "UPDATE `ACPrice` 
        SET BalanceFloor = BalanceFloor - $unit
        WHERE `Model`='$model'";
    mysqli_query($con, $sql);
}

function addBalanceActual($model, $unit, $con) {
    $sql = "UPDATE `ACPrice` 
        SET BalanceActual = BalanceActual + $unit
        WHERE `Model`='$model'"; 
    mysqli_query($con, $sql);
}

function addBalanceFloor($model, $unit, $con) {
    $sql = "UPDATE `ACPrice` 
        SET BalanceFloor = BalanceFloor + $unit
        WHERE `Model`='$model'";
    mysqli_query($con, $sql);
}
?>
