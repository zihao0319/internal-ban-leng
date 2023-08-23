<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    include('../../dbcon.php');
    include('../../session.php'); 

    // Service Team
    $result_teams = mysqli_query($con, "SELECT * FROM ServiceTeam" ) or die('Request Data Error');
    $teams = array();
    while($r = mysqli_fetch_assoc($result_teams)) {
        $teams[] = $r;
    }
    $teamsresponse = json_encode($teams,JSON_INVALID_UTF8_SUBSTITUTE);

   
    // Service
    $from = mysqli_real_escape_string($con, $_POST['from']);
    $to = mysqli_real_escape_string($con, $_POST['to']);
    $team = mysqli_real_escape_string($con, $_POST['team']);
    
    $sql_service = "SELECT * FROM Service 
                    WHERE ApptDate >= '$from' 
                    AND ApptDate <= '$to'";
    if($team != "All" && !empty($team)) {
        $sql_service .= " AND Team = '$team'";
    }
    $result_service = mysqli_query($con, $sql_service ) or die('Request Data Error');
    $service = array();
    while($r = mysqli_fetch_assoc($result_service)) {
        $service[] = $r;
    }
    $serviceresponse = json_encode($service,JSON_INVALID_UTF8_SUBSTITUTE);

    // Day Note
    $sql_serviceDayNote = "SELECT * FROM ServiceDayNote 
                    WHERE Date >= '$from' 
                    AND Date <= '$to'";
    $result_serviceDayNote = mysqli_query($con, $sql_serviceDayNote ) or die('Request Data Error');
    $serviceDayNote = array();
    while($r = mysqli_fetch_assoc($result_serviceDayNote)) {
        $serviceDayNote[] = $r;
    }
    $serviceDayNoteresponse = json_encode($serviceDayNote,JSON_INVALID_UTF8_SUBSTITUTE);

    // Service Actions
    $result_action = mysqli_query($con, "SELECT * FROM ServiceAction" ) or die('Request Data Error');
    $action = array();
    while($r = mysqli_fetch_assoc($result_action)) {
        $action[] = $r;
    }
    $actionresponse = json_encode($action,JSON_INVALID_UTF8_SUBSTITUTE);

    // Customer
    $result = mysqli_query($con, "SELECT * FROM Customer" ) or die('Request Data Error');
    $custrows = array();
    while($r = mysqli_fetch_assoc($result)) {
        $custrows[] = $r;
    }
    $custresponse = json_encode($custrows);

    // Login user
    $result_loginuser = mysqli_query($con, "select * from Users where User_ID=$session_id");
    $row_loginuser = mysqli_fetch_array($result_loginuser);

    $outp = '{ "Teams" : ' .$teamsresponse .', "Actions" : '.$actionresponse.', "ServiceDayNotes" : '.$serviceDayNoteresponse.', "Services" : '.$serviceresponse.', "Customer" : '.$custresponse. ', "LoginUser" : "'.$row_loginuser['Name'].'"}';

    echo($outp);
