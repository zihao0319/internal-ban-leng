<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include('../../dbcon.php');
include('../../session.php');

$month = mysqli_real_escape_string($con, $_POST['month']);
$year = mysqli_real_escape_string($con, $_POST['year']);
$showpending = mysqli_real_escape_string($con, $_POST['showpending']);

$sql_stockout = "SELECT so.*, IFNULL(SUM(soec.Unit * soec.UnitPrice),0) AS TotalExtraCharge, soi.Customer, soi.ContactNo, soi.Address FROM StockOut so
                    LEFT JOIN StockOutExtraCharge soec ON soec.StockOutID = so.ID
                    LEFT JOIN StockOutInvoice soi ON (
                    CASE WHEN (so.InvoiceNo IS NOT NULL AND so.InvoiceNo <> '') 
                    THEN soi.InvoiceNo = so.InvoiceNo  
                    ELSE soi.InvoiceNo = so.SalesOrderNo END )  
                    WHERE MONTH(so.OrderDate) = '$month' 
                    AND YEAR(so.OrderDate) = '$year'
                    GROUP BY so.ID
                    ORDER BY so.OrderDate, so.ID ASC";
$sql_stockoutEC = "SELECT soec.* FROM StockOutExtraCharge soec
                    LEFT JOIN StockOut so ON soec.StockOutID = so.ID
                    LEFT JOIN StockOutInvoice soi ON (
                    CASE WHEN (so.InvoiceNo IS NOT NULL AND so.InvoiceNo <> '') 
                    THEN soi.InvoiceNo = so.InvoiceNo  
                    ELSE soi.InvoiceNo = so.SalesOrderNo END )  
                    WHERE MONTH(so.OrderDate) = '$month' 
                    AND YEAR(so.OrderDate) = '$year'
                    ORDER BY so.OrderDate, so.ID ASC";
if ($showpending == 1) {
    $sql_stockout = "SELECT so.*, IFNULL(SUM(soec.Unit * soec.UnitPrice),0) AS TotalExtraCharge, soi.Customer, soi.ContactNo, soi.Address FROM StockOut so
                    LEFT JOIN StockOutExtraCharge soec ON soec.StockOutID = so.ID
                    LEFT JOIN StockOutInvoice soi ON soi.InvoiceNo = so.SalesOrderNo
                    WHERE so.InvoiceNo IS NULL OR so.InvoiceNo = ''
                    GROUP BY so.ID
                    ORDER BY so.OrderDate, so.ID ASC";
    $sql_stockoutEC = "SELECT soec.* FROM StockOutExtraCharge soec
                    LEFT JOIN StockOut so ON soec.StockOutID = so.ID
                    LEFT JOIN StockOutInvoice soi ON soi.InvoiceNo = so.SalesOrderNo
                    WHERE so.InvoiceNo IS NULL OR so.InvoiceNo = ''
                    ORDER BY so.OrderDate, so.ID ASC";
}

// Stock Out
$result_stockout = mysqli_query($con, $sql_stockout) or die('Request Data Error');
$stockout = array();
while ($r = mysqli_fetch_assoc($result_stockout)) {
    $stockout[] = $r;
}
$stockoutresponse = json_encode($stockout,JSON_INVALID_UTF8_SUBSTITUTE);

// Stock Out Extra Charges
$result_stockoutEC = mysqli_query($con, $sql_stockoutEC) or die('Request Data Error');
$stockoutEC = array();
while ($r = mysqli_fetch_assoc($result_stockoutEC)) {
    $stockoutEC[] = $r;
}
$stockoutECresponse = json_encode($stockoutEC,JSON_INVALID_UTF8_SUBSTITUTE);

// Totals
$sql_stockout_total = "SELECT SUM(so.Unit) As TotalUnit, SUM(so.TotalAC + so.TotalEC) As TotalPrice 
                    FROM ( SELECT iso.ID, iso.OrderDate, iso.Unit, 
                                (iso.Unit * iso.Price) AS TotalAC, 
                                IFNULL(SUM(isoec.Unit * isoec.UnitPrice),0) AS TotalEC
                                FROM StockOut iso 
                                LEFT JOIN StockOutExtraCharge isoec ON isoec.StockOutID = iso.ID
                                GROUP BY iso.ID ) so 
                    WHERE MONTH(so.OrderDate) = '$month' 
                    AND YEAR(so.OrderDate) = '$year'";

$result_stockout_total = mysqli_query($con, $sql_stockout_total) or die('Request Data Error');
$stockout_total = array();
while ($r = mysqli_fetch_assoc($result_stockout_total)) {
    $stockout_total[] = $r;
}
$stockouttotalresponse = json_encode($stockout_total,JSON_INVALID_UTF8_SUBSTITUTE);

// Pendings
$sql_stockout_pending = "SELECT SUM(so.Unit) As PendingUnit, SUM(so.TotalAC + so.TotalEC) As PendingPrice
                    FROM ( SELECT iso.ID, iso.OrderDate, iso.InvoiceNo, iso.Unit, 
                                (iso.Unit * iso.Price) AS TotalAC, 
                                IFNULL(SUM(isoec.Unit * isoec.UnitPrice),0) AS TotalEC
                                FROM StockOut iso 
                                LEFT JOIN StockOutExtraCharge isoec ON isoec.StockOutID = iso.ID
                                GROUP BY iso.ID ) so 
                    WHERE MONTH(so.OrderDate) = '$month' 
                    AND YEAR(so.OrderDate) = '$year'
                    AND (so.InvoiceNo IS NULL OR so.InvoiceNo = '')";

$result_stockout_pending = mysqli_query($con, $sql_stockout_pending) or die('Request Data Error');
$stockout_pending = array();
while ($r = mysqli_fetch_assoc($result_stockout_pending)) {
    $stockout_pending[] = $r;
}
$stockoutpendingresponse = json_encode($stockout_pending,JSON_INVALID_UTF8_SUBSTITUTE);

// Models
$sql_models = "SELECT Model, Product, Category, BTU, Brand FROM ACPrice";

$result_models = mysqli_query($con, $sql_models) or die('Request Data Error');
$models = array();
while ($r = mysqli_fetch_assoc($result_models)) {
    $models[] = $r;
}
$modelsresponse = json_encode($models,JSON_INVALID_UTF8_SUBSTITUTE);

//Extra charges
$result_ec = mysqli_query($con, "SELECT * FROM ExtraCharge") or die('Request Data Error');
$ecrows = array();
while ($r = mysqli_fetch_assoc($result_ec)) {
    $ecrows[] = $r;
}
$ecresponse = json_encode($ecrows,JSON_INVALID_UTF8_SUBSTITUTE);


$outp = '{ "StockOuts" : ' . $stockoutresponse . ', "StockOutExtraCharges": ' . $stockoutECresponse . ', "Models": ' . $modelsresponse . ', "Totals" : ' . $stockouttotalresponse . ', "Pendings" : ' . $stockoutpendingresponse . ', "ExtraCharges" : ' . $ecresponse . "}";

echo ($outp);
