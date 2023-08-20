<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    include('../../dbcon.php');
    include('../../session.php'); 

    // Invoice
    $month = mysqli_real_escape_string($con, $_POST['month']);
    $year = mysqli_real_escape_string($con, $_POST['year']);
    
    $sql_invoice = "SELECT inv.*, SUM(so.TotalAC + so.TotalEC) AS Total FROM StockOutInvoice inv
                    LEFT JOIN ( SELECT iso.ID, iso.InvoiceNo, iso.SalesOrderNo, 
                                (iso.Unit * iso.Price) AS TotalAC, 
                                IFNULL(SUM(isoec.Unit * isoec.UnitPrice),0) AS TotalEC
                                FROM StockOut iso 
                                LEFT JOIN StockOutExtraCharge isoec ON isoec.StockOutID = iso.ID
                                GROUP BY iso.ID ) so 
                        ON ( inv.InvoiceNo = so.InvoiceNo OR inv.InvoiceNo = so.SalesOrderNo )
                    WHERE MONTH(InvoiceDate) = '$month' 
                    AND YEAR(InvoiceDate) = '$year'
                    GROUP BY inv.InvoiceNo 
                    ";
    
    $result_invoice = mysqli_query($con, $sql_invoice ) or die('Request Data Error');
    $invoice = array();
    while($r = mysqli_fetch_assoc($result_invoice)) {
        $invoice[] = $r;
    }
    $invoiceresponse = json_encode($invoice,JSON_INVALID_UTF8_SUBSTITUTE);

    // Detail
    $sql_detail = "SELECT so.*, inv.Type
                    FROM ( SELECT iso.*, 
                            IFNULL(SUM(isoec.Unit * isoec.UnitPrice),0) AS TotalExtraCharge
                            FROM StockOut iso 
                            LEFT JOIN StockOutExtraCharge isoec ON isoec.StockOutID = iso.ID
                            GROUP BY iso.ID ) so
                    LEFT JOIN StockOutInvoice inv ON ( inv.InvoiceNo = so.InvoiceNo OR inv.InvoiceNo = so.SalesOrderNo ) 
                    WHERE MONTH(inv.InvoiceDate) = '$month' 
                    AND YEAR(inv.InvoiceDate) = '$year'";

    $result_detail = mysqli_query($con, $sql_detail ) or die('Request Data Error');
    $detail = array();
    while($r = mysqli_fetch_assoc($result_detail)) {
        $detail[] = $r;
    }
    $detailresponse = json_encode($detail,JSON_INVALID_UTF8_SUBSTITUTE);


    // Extra Charges
    $sql_extraCharges = "SELECT soec.* FROM StockOutExtraCharge soec
                    LEFT JOIN StockOut so ON soec.StockOutID = so.ID
                    LEFT JOIN StockOutInvoice soi ON (
                    CASE WHEN (so.InvoiceNo IS NOT NULL AND so.InvoiceNo <> '') 
                    THEN soi.InvoiceNo = so.InvoiceNo  
                    ELSE soi.InvoiceNo = so.SalesOrderNo END )  
                    WHERE MONTH(so.OrderDate) = '$month' 
                    AND YEAR(so.OrderDate) = '$year'";

    $result_extraCharges = mysqli_query($con, $sql_extraCharges ) or die('Request Data Error');
    $extraCharges = array();
    while($r = mysqli_fetch_assoc($result_extraCharges)) {
        $extraCharges[] = $r;
    }
    $extraChargesresponse = json_encode($extraCharges,JSON_INVALID_UTF8_SUBSTITUTE);

    // Payment
    $sql_payment = "SELECT p.* FROM StockOutInvoicePayment p
                LEFT JOIN StockOutInvoice inv ON inv.InvoiceNo = p.InvoiceNo
                WHERE MONTH(inv.InvoiceDate) = '$month' 
                AND YEAR(inv.InvoiceDate) = '$year'";
    
    $result_payment = mysqli_query($con, $sql_payment ) or die('Request Data Error');
    $payment = array();
    while($r = mysqli_fetch_assoc($result_payment)) {
        $payment[] = $r;
    }
    $paymentresponse = json_encode($payment,JSON_INVALID_UTF8_SUBSTITUTE);


    
    $outp = '{ "Invoices" : ' .$invoiceresponse.', "Details": '.$detailresponse.', "ExtraCharges": '.$extraChargesresponse.', "Payments": '.$paymentresponse."}";

    echo($outp);
