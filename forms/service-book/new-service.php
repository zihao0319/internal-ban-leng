<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include('../../dbcon.php');
include('../../session.php');

$id = mysqli_real_escape_string($con, $_POST['id']);
$name = mysqli_real_escape_string($con, $_POST['name']);
$pic = mysqli_real_escape_string($con, $_POST['pic']);
$contactno = mysqli_real_escape_string($con, $_POST['contactno']);
$address = mysqli_real_escape_string($con, $_POST['address']);
$department = mysqli_real_escape_string($con, $_POST['department']);
$team = mysqli_real_escape_string($con, $_POST['team']);
$salesperson = mysqli_real_escape_string($con, $_POST['salesperson']);
$apptdate = mysqli_real_escape_string($con, $_POST['apptdate']);
$apptfrom = mysqli_real_escape_string($con, $_POST['apptfrom']);
$apptto = mysqli_real_escape_string($con, $_POST['apptto']);
$remark = mysqli_real_escape_string($con, $_POST['remark']);
$type = mysqli_real_escape_string($con, $_POST['type']);
$action = mysqli_real_escape_string($con, $_POST['action']);
$status = mysqli_real_escape_string($con, $_POST['status']);
$cashamount = mysqli_real_escape_string($con, $_POST['cashamount']);
$cashtype = mysqli_real_escape_string($con, $_POST['cashtype']);
$do = mysqli_real_escape_string($con, $_POST['do']);
$invoice = mysqli_real_escape_string($con, $_POST['invoice']);
$invoiceamount = mysqli_real_escape_string($con, $_POST['invoiceamount']);
$sqlinsert = "INSERT INTO `Service`(`Name`, `PIC`,
     `ContactNo`, `Address`, `Department`, `Team`, `salesperson`, `ApptDate`, `ApptFrom`, 
     `ApptTo`, `Remark`, `Type`, `Action`, `Status`, `CashAmount`, `CashType`,`DO`,`Invoice`,`Invoiceamount`) 
	VALUES ('$name','$pic', '$contactno', '$address',
    '$department','$team','$salesperson','$apptdate','$apptfrom','$apptto',
    '$remark','$type','$action','$status','$cashamount','$cashtype','$do','$invoice','$invoiceamount')";

$sqlupdate = "UPDATE `Service` 
SET `Name`='$name',`PIC`='$pic',`ContactNo`='$contactno',
`Address`='$address',`Department`='$department',`Team`='$team',`salesperson`='$salesperson',
`ApptDate`='$apptdate',`ApptFrom`='$apptfrom',`ApptTo`='$apptto',
`Remark`='$remark',`Type`='$type',`Action`='$action',
`Status`='$status',`CashAmount`='$cashamount',`CashType`='$cashtype',`DO`='$do',`Invoice`='$invoice',`Invoiceamount`='$invoiceamount'
WHERE `ServiceID`='$id' ";

$sql = $sqlinsert;
if(!empty($id)) {
    $sql = $sqlupdate;
}
if (mysqli_query($con, $sql)) {
    echo json_encode(array("statusCode" => 200));
} else {
    echo json_encode(array("statusCode" => 201));
}

?>
