<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include('../../dbcon.php');
include('../../session.php');

$id = mysqli_real_escape_string($con, $_POST['id']);

$sql  = "DELETE FROM `Service` WHERE `ServiceID` = '$id' ";

if (mysqli_query($con, $sql)) {
    echo json_encode(array("statusCode" => 200));
} else {
    echo json_encode(array("statusCode" => 201));
}

?>
