<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    include('../../dbcon.php');
    include('../../session.php'); 

    $result = mysqli_query($con, "SELECT * FROM ACPrice2 ORDER BY Sequence, Model ASC" ) or die('Request Data Error');

    $outp = "[";
    while($rs = mysqli_fetch_array($result)) {
        if ($outp != "[") {$outp .= ",";}
        $outp .= '{"Model":"'  . $rs["Model"] . '",';
        $outp .= '"Unit":'   . $rs["Unit"]        . ',';
        $outp .= '"Category":"'   . $rs["Category"]        . '",';
        $outp .= '"Product":"'. $rs["Product"]     . '",';
        $outp .= '"Brand":"'. $rs["Brand"]     . '",';
        $outp .= '"BTU":'. $rs["BTU"]     . ',';
        $outp .= '"PriceAC":'. $rs["PriceAC"]     . ',';
        $outp .= '"Price":'. $rs["Price"]     . ',';
        $outp .= '"Install":'   . $rs["Install"]        . ',';
        $outp .= '"PriceConceal":'   . $rs["PriceConceal"]        . ',';
        $outp .= '"Sequence":'   . $rs["Sequence"]        . ',';
        $outp .= '"IsObsolete":'   . $rs["IsObsolete"]        . ',';
        $outp .= '"IsSellerPick":'   . $rs["IsSellerPick"]        . '}';
    }
    $outp .="]";

    echo($outp);
 ?>

