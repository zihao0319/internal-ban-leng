<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    include('../../dbcon.php');
    include('../../session.php'); 

    // Service
    $search = mysqli_real_escape_string($con, $_POST['search']);
    $sql_stockout = "SELECT so.*, soi.Customer, soi.ContactNo, soi.Address, soi.InvoiceDate 
                    FROM StockOut so
                    LEFT JOIN StockOutInvoice soi ON (
                    soi.InvoiceNo = so.InvoiceNo  
                    OR soi.InvoiceNo = so.SalesOrderNo)  
                    WHERE soi.Customer LIKE '%$search%' 
                    OR soi.ContactNo LIKE '%$search%'
                    OR soi.Address LIKE '%$search%'
                    OR soi.InvoiceNo LIKE '%$search%'
                    ORDER BY so.OrderDate, so.ID DESC";

    $sql_stockout_sn = "SELECT so.*, soi.Customer, soi.ContactNo, soi.Address, soi.InvoiceDate 
                    FROM StockOut so
                    LEFT JOIN StockOutInvoice soi ON (
                    soi.InvoiceNo = so.InvoiceNo  
                    OR soi.InvoiceNo = so.SalesOrderNo)  
                    WHERE MATCH(so.SerialNo) AGAINST('$search')
					GROUP BY so.ID
                    ORDER BY so.OrderDate, so.ID DESC";

    $result_stockout = mysqli_query($con, $sql_stockout ) or die('Request Data Error');
    $result_stockout_sn = mysqli_query($con, $sql_stockout_sn ) or die('Request Data Error');
    $stockout = array();
    while($r = mysqli_fetch_assoc($result_stockout)) {
        $stockout[] = $r;
    }
    while($r = mysqli_fetch_assoc($result_stockout_sn)) {
        $stockout[] = $r;
    }
    $stockoutresponse = json_encode($stockout);

    $sql_service = "SELECT * FROM Service
                    WHERE Name LIKE '%$search%'
                    OR PIC LIKE '%$search%'
                    OR ContactNo LIKE '%$search%'
                    OR Address LIKE '%$search%'" ;

    $result_service = mysqli_query($con, $sql_service ) or die('Request Data Error');
    $service = array();
    while($r = mysqli_fetch_assoc($result_service)) {
        $service[] = $r;
    }
    $serviceresponse = json_encode($service);

    $outp = '{ "Orders" : ' .$stockoutresponse.', "Services" : ' .$serviceresponse."}";

    echo($outp);
