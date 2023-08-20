<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include('../../dbcon.php');
include('../../session.php');

$list = json_decode(file_get_contents('php://input'));
$sql = "";
foreach($list as $item) {
    $sqlselect = "SELECT * FROM `StockIn` WHERE `ID`='$item->ID'";
    $sqlinsert = "INSERT INTO `StockIn`(`Date`,
    `InvoiceNo`, `DONo`, `Model`, `Unit`, `Amount`) 
    VALUES ('$item->Date','$item->InvoiceNo', '$item->DONo', '$item->Model', $item->Unit, $item->Amount)";

    $sqlupdate = " UPDATE `StockIn`
        SET `Date` = '$item->Date',`InvoiceNo` = '$item->InvoiceNo',
        `DONo` = '$item->DONo',`Model` = '$item->Model',`Unit` = '$item->Unit',
        `Amount` = '$item->Amount' WHERE `ID`='$item->ID'";

    $sqldelete = " DELETE FROM `StockIn` WHERE `ID`='$item->ID'";
    $sqlbalancePlus = "UPDATE `ACPrice` 
        SET BalanceActual = BalanceActual + $item->Unit,
        BalanceFloor = BalanceFloor + $item->Unit
        WHERE `Model`='$item->Model'";
    $sqlbalanceMinus = "UPDATE `ACPrice` 
        SET BalanceActual = BalanceActual - $item->Unit,
        BalanceFloor = BalanceFloor - $item->Unit
        WHERE `Model`='$item->Model'";


    $sql=$sqlinsert;
    if($item->deleted || !empty($item->ID)) {
        $sql = $sqlselect;
        if($result = mysqli_query($con, $sql)) {
            $current_stockin = mysqli_fetch_assoc($result);
            $unit = $current_stockin["Unit"];
            $model = $current_stockin["Model"];
            
            // Delete
            if($item->deleted) {
                minusBalance($model, $unit, $con);
                $sql = $sqldelete;
            }
            // Update
            else if(!empty($item->ID)) {
                if($model != $item->Model 
                || $unit != $item->Unit) {
                    minusBalance($model, $unit, $con);
                    addBalance($item->Model, $item->Unit, $con);
                }
                $sql = $sqlupdate;
            }
        }
    }
    else{
        addBalance($item->Model, $item->Unit, $con);
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

function minusBalance($model, $unit, $con) {
    $sql = "UPDATE `ACPrice` 
        SET BalanceActual = BalanceActual - $unit,
        BalanceFloor = BalanceFloor - $unit
        WHERE `Model`='$model'";
    mysqli_query($con, $sql);
}

function addBalance($model, $unit, $con) {
    $sql = "UPDATE `ACPrice` 
        SET BalanceActual = BalanceActual + $unit,
        BalanceFloor = BalanceFloor + $unit
        WHERE `Model`='$model'";
    mysqli_query($con, $sql);
}
?>
