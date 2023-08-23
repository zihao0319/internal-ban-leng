<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include('../../dbcon.php');
include('../../session.php');

$name = mysqli_real_escape_string($con, $_POST['name']);
$address = mysqli_real_escape_string($con, $_POST['address']);
$fax = mysqli_real_escape_string($con, $_POST['fax']);
$phone = mysqli_real_escape_string($con, $_POST['phone']);
$regno = mysqli_real_escape_string($con, $_POST['regno']);
$attnperson = mysqli_real_escape_string($con, $_POST['attnperson']);
$attnphone = mysqli_real_escape_string($con, $_POST['attnphone']);
$email = mysqli_real_escape_string($con, $_POST['email']);
$sql = "INSERT INTO `Customer`( `Name`, `Address`,
     `Phone`, `Fax`, `RegNo`, `AttnPerson`, `AttnPhone`, `Email`) 
	VALUES ('$name','$address', '$fax', '$phone','$regno','$attnperson',
    '$attnphone','$email')";
if (mysqli_query($con, $sql)) {
    echo json_encode(array("statusCode" => 200));
} else {
    echo json_encode(array("statusCode" => 201));
}

?>
