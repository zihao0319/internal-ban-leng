<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    include('../../dbcon.php');
    include('../../session.php'); 

    // History
    $result = mysqli_query($con, 
    "SELECT qh.QuotationNo,qh.CustomerName,qh.CustomerAddress,
    qh.Phone, qh.Fax, qh.RegNo, qh.AttnPerson, qh.AttnPhone, qh.Email,
    qh.Date,qh.JobDepartment,qh.ACUnit,qh.RequisitionNo,qh.DeliveryNo,
    qh.ServiceNo,qh.PONo,qh.InvoiceNo,
    qh.PODate,qh.InvoiceDate,qh.ServiceNoDate,
    qh.POPrice,qh.InvoicePrice,qh.ServiceNoPrice,
    qh.POPrice,qh.Remark,qh.HasRefund,qh.RefundDescription,qh.RefundUnit, 
    qh.RefundUOM, qh.RefundPrice,qh.QuotationTotal, qh.PaymentMode, 
    qh.JobStatus, qh.HasFixedTotal, qh.FixedTotal, qh.PeriodOfWarranty 
    FROM QuotationHistoryAC qh 
    ORDER BY QuotationNo DESC" ) or die('Request Data Error');
    $historyRows = array();
    while($r = mysqli_fetch_assoc($result)) {
        $historyRows[] = $r;
    }
    $historyresponse = json_encode($historyRows, JSON_INVALID_UTF8_SUBSTITUTE);

    // Items
    $result2 = mysqli_query($con, 
    "SELECT qhi.QuotationNo, qhi.Job, qhi.Description, qhi.Unit, qhi.UOM, qhi.UnitPrice, qhi.Category
    FROM QuotationHistoryItemAC qhi ORDER BY qhi.RowIndex" ) or die('Request Data Error');

    $itemRows = array();
    while($r = mysqli_fetch_assoc($result2)) {
        $itemRows[] = $r;
    }
    $itemresponse = json_encode($itemRows, JSON_INVALID_UTF8_SUBSTITUTE);

    // SOW
    $result3 = mysqli_query($con, 
    "SELECT qhi.QuotationNo, qhi.Job, qhi.Text
    FROM QuotationHistorySOWAC qhi ORDER BY qhi.RowIndex" ) or die('Request Data Error');

    $sowRows = array();
    while($r = mysqli_fetch_assoc($result3)) {
        $sowRows[] = $r;
    }
    $sowresponse = json_encode($sowRows, JSON_INVALID_UTF8_SUBSTITUTE);

    


    $outp = '{ "History" : ' .$historyresponse .', "Items" : ' .$itemresponse .', "SOW" : ' .$sowresponse . '}';

    echo($outp);

?>
