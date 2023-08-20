<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include('../../dbcon.php');
include('../../session.php');

$date = mysqli_real_escape_string($con, $_POST['date']);
$notes = mysqli_real_escape_string($con, $_POST['notes']);

$sql = "REPLACE INTO `ServiceDayNote`(`Date`, `Notes`) VALUES ('$date','$notes')";

if (mysqli_query($con, $sql)) {
    echo json_encode(array("statusCode" => 200));
} else {
    echo json_encode(array("statusCode" => 201));
}
