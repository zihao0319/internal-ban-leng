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

    // Action
    $result2 = mysqli_query($con, "SELECT * FROM Action" ) or die('Request Data Error');

    $actrows = array();
    while($r = mysqli_fetch_assoc($result2)) {
        $actrows[] = $r;
    }
    $actresponse = json_encode($actrows);

    //Global Parameters
    $result3 = mysqli_query($con, "SELECT * FROM GlobalParam") or die('Request Data Error');
    $gprows = array();
    while($r = mysqli_fetch_assoc($result3)) {
        $gprows[] = $r;
    }
    $gpresponse = json_encode($gprows);


    $outp = '{ "Customer" : ' .$custresponse .', "Action" : ' .$actresponse . ', "GlobalParam" : ' . $gpresponse . "}";

    echo($outp);

?>
