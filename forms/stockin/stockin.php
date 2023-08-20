<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    include('../../dbcon.php');
    include('../../session.php'); 

    // Stock In
    $month = mysqli_real_escape_string($con, $_POST['month']);
    $year = mysqli_real_escape_string($con, $_POST['year']);
    
    $sql_stockin = "SELECT * FROM StockIn 
                    WHERE MONTH(Date) = '$month' 
                    AND YEAR(Date) = '$year'";
    
    $result_stockin = mysqli_query($con, $sql_stockin ) or die('Request Data Error');
    $stockin = array();
    while($r = mysqli_fetch_assoc($result_stockin)) {
        $stockin[] = $r;
    }
    $stockinresponse = json_encode($stockin,JSON_INVALID_UTF8_SUBSTITUTE);

    // Models
    $sql_models = "SELECT Model FROM ACPrice";

    $result_models = mysqli_query($con, $sql_models ) or die('Request Data Error');
    $models = array();
    while($r = mysqli_fetch_assoc($result_models)) {
        $models[] = $r["Model"];
    }
    $modelsresponse = json_encode($models,JSON_INVALID_UTF8_SUBSTITUTE);

    // Brand
    $sql_brand = "SELECT m.Brand, SUM(si.Unit) AS Unit, SUM(si.Amount*si.Unit) AS Amount 
                    FROM StockIn si
                    LEFT JOIN ACPrice m ON si.Model = m.Model
                    WHERE MONTH(si.Date) = '$month' 
                    AND YEAR(si.Date) = '$year'
                    GROUP BY m.Brand
                    ORDER BY SUM(si.Unit) DESC";
    
    $result_brand = mysqli_query($con, $sql_brand ) or die('Request Data Error');
    $brands = array();
    while($r = mysqli_fetch_assoc($result_brand)) {
        $brands[] = $r;
    }
    $brandsresponse = json_encode($brands,JSON_INVALID_UTF8_SUBSTITUTE);

    
    $outp = '{ "StockIns" : ' .$stockinresponse .', "Models": '.$modelsresponse.', "Brands": '.$brandsresponse."}";

    echo($outp);
?>