<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    include('../../dbcon.php');
    include('../../session.php'); 

    // Service
    $search = mysqli_real_escape_string($con, $_POST['search']);
    
    $sql_service = "SELECT DISTINCT ApptDate FROM Service 
                    WHERE Name LIKE '%$search%'
                    OR PIC LIKE '%$search%'
                    OR ContactNo LIKE '%$search%'
                    OR Address LIKE '%$search%'
                    OR invoice LIKE '%$search%'
                    OR do LIKE '%$search%'";

    $result_service = mysqli_query($con, $sql_service ) or die('Request Data Error');
    $service = array();
    while($r = mysqli_fetch_assoc($result_service)) {
        $service[] = $r;
    }
    $serviceresponse = json_encode($service);

    $outp = '{ "Services" : ' .$serviceresponse."}";

    echo($outp);
