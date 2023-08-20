<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    include('../../dbcon.php');
    include('../../session.php'); 

    // Customer
    $result = mysqli_query($con, "SELECT * FROM Customer" ) or die('Request Data Error');
    $custrows = array();
    while($r = mysqli_fetch_assoc($result)) {
        $custrows[] = $r;
    }
    $custresponse = json_encode($custrows);

    // AC Price
    $result2 = mysqli_query($con, "SELECT * FROM ACPrice ORDER BY Sequence, Model ASC" ) or die('Request Data Error');

    $acrows = array();
    while($r = mysqli_fetch_assoc($result2)) {
        $acrows[] = $r;
    }
    $acresponse = json_encode($acrows);

    //Global Parameters
    $result3 = mysqli_query($con, "SELECT * FROM GlobalParam") or die('Request Data Error');
    $gprows = array();
    while($r = mysqli_fetch_assoc($result3)) {
        $gprows[] = $r;
    }
    $gpresponse = json_encode($gprows);

    //Extra charges
    $result4 = mysqli_query($con, "SELECT * FROM ExtraCharge") or die('Request Data Error');
    $ecrows = array();
    while($r = mysqli_fetch_assoc($result4)) {
        $ecrows[] = $r;
    }
    $ecresponse = json_encode($ecrows);


    $outp = '{ "Customer" : ' .$custresponse .', "ACPrice" : ' .$acresponse . ', "GlobalParam" : ' . $gpresponse . ', "ExtraCharges" : ' . $ecresponse . "}";

    echo($outp);

?>
