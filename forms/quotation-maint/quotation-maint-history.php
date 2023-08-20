<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    include('../../dbcon.php');
    include('../../session.php'); 

    // History
    $result = mysqli_query($con, 
    "SELECT qh.QuotationNo,qh.CustomerName,qh.CustomerAddress,
    qh.Phone, qh.Fax, qh.RegNo, qh.AttnPerson, qh.AttnPhone, qh.Email, qh.JobStatus,
    qh.Date,qh.JobDepartment,qh.ACUnit,qh.RequisitionNo,qh.DeliveryNo,
    qh.ServiceNo,qh.PONo,qh.InvoiceNo,
    qh.PODate,qh.InvoiceDate,qh.ServiceNoDate,
    qh.POPrice,qh.InvoicePrice,qh.ServiceNoPrice,
    qh.POPrice,qh.Remark,qh.HasRefund,qh.RefundDescription,qh.RefundUnit, 
    qh.RefundUOM, qh.RefundPrice, qh.PreText, qh.PostText, qh.StartWith, qh.EndWith, 
    qh.IsACInfoOverride, qh.ACInfoOverride,qh.QuotationTotal, qh.ScopeOfWork, qh.PaymentMode
    FROM QuotationHistory qh
    ORDER BY QuotationNo DESC" ) or die('Request Data Error');
    $historyRows = array();
    while($r = mysqli_fetch_assoc($result)) {
        $historyRows[] = $r;
    }
    //$historyresponse = json_encode($historyRows);
    $historyresponse = json_encode($historyRows, JSON_INVALID_UTF8_SUBSTITUTE);

    // Items
    $result2 = mysqli_query($con, 
    "SELECT qhi.QuotationNo, qhi.ActionID, a.Name AS Action, 
    a.Description, qhi.Unit, qhi.UOM, qhi.UnitPrice, qhi.HorsePower, 
    qhi.ACType, qhi.Feature, qhi.GasType, qhi.Brand, qhi.ModelIndoor, 
    qhi.ModelOutdoor 
    FROM QuotationHistoryItem qhi 
    INNER JOIN Action a ON a.ActionID = qhi.ActionID
    ORDER BY ItemIndex" ) or die('Request Data Error');

    $itemRows = array();
    while($r = mysqli_fetch_assoc($result2)) {
        $itemRows[] = $r;
    }
    $itemresponse = json_encode($itemRows, JSON_INVALID_UTF8_SUBSTITUTE);

    


    $outp = '{ "History" : ' .$historyresponse .', "Items" : ' .$itemresponse . '}';

    echo($outp);

?>
