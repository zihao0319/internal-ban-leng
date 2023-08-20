<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    include('../../dbcon.php');
    include('../../session.php'); 

    // Stock In
    $month = mysqli_real_escape_string($con, $_POST['month']);
    $year = mysqli_real_escape_string($con, $_POST['year']);
    
    $sql_stockin = "SELECT ac.Model, ac.Brand, ac.Sequence, ac.IsObsolete, ac.IsSellerPick,
        IFNULL(SUM(si.Unit),0) TotalIn,
        IFNULL(ac.BalanceActual,0) BalanceActual,
        IFNULL(ac.BalanceFloor,0) BalanceFloor
        FROM ACPrice ac
        LEFT JOIN StockIn si ON si.Model = ac.Model AND YEAR(si.Date) >= $year AND MONTH(si.Date) >= $month
        GROUP BY ac.Model
        ORDER BY ac.Sequence, ac.Model ASC";
    
    $sql_stockin_current = "SELECT ac.Model, 
        IFNULL(SUM(si_s.Unit),0) MonthIn
        FROM ACPrice ac
        LEFT JOIN StockIn si_s ON si_s.Model = ac.Model AND YEAR(si_s.Date) = $year AND MONTH(si_s.Date) = $month
        GROUP BY ac.Model
        ORDER BY ac.Sequence, ac.Model ASC";

    $sql_stockout = "SELECT ac.Model, 
        IFNULL(SUM(so.Unit),0) TotalOut
        FROM ACPrice ac
        LEFT JOIN StockOut so ON so.Model = ac.Model AND YEAR(so.OrderDate) >= $year AND MONTH(so.OrderDate) >= $month
        GROUP BY ac.Model
        ORDER BY ac.Sequence, ac.Model ASC";
    
    $sql_stockout_current = "SELECT ac.Model, 
        IFNULL(SUM(so.Unit),0) MonthOut
        FROM ACPrice ac
        LEFT JOIN StockOut so ON so.Model = ac.Model AND YEAR(so.OrderDate) = $year AND MONTH(so.OrderDate) = $month
        GROUP BY ac.Model
        ORDER BY ac.Sequence, ac.Model ASC";

    $sql_stockout_inv = "SELECT ac.Model, 
        IFNULL(SUM(CASE WHEN soi.InvoiceNo IS NOT NULL THEN so.Unit ELSE 0 END),0) TotalOutInv
        FROM ACPrice ac
        LEFT JOIN StockOut so ON so.Model = ac.Model 
        LEFT JOIN StockOutInvoice soi ON so.InvoiceNo = soi.InvoiceNo AND YEAR(soi.InvoiceDate) >= $year AND MONTH(soi.InvoiceDate) >= $month 
        GROUP BY ac.Model
        ORDER BY ac.Sequence, ac.Model ASC";

    $sql_stockout_inv_current = "SELECT ac.Model, 
        IFNULL(SUM(CASE WHEN soi.InvoiceNo IS NOT NULL THEN so.Unit ELSE 0 END),0) MonthOutInv
        FROM ACPrice ac
        LEFT JOIN StockOut so ON so.Model = ac.Model 
        LEFT JOIN StockOutInvoice soi ON so.InvoiceNo = soi.InvoiceNo AND YEAR(soi.InvoiceDate) = $year AND MONTH(soi.InvoiceDate) = $month 
        GROUP BY ac.Model
        ORDER BY ac.Sequence, ac.Model ASC";
    
    $result_stockin = mysqli_query($con, $sql_stockin ) or die('Request Data Error');
    $result_stockin_current = mysqli_query($con, $sql_stockin_current ) or die('Request Data Error');
    $result_stockout = mysqli_query($con, $sql_stockout ) or die('Request Data Error');
    $result_stockout_current = mysqli_query($con, $sql_stockout_current ) or die('Request Data Error');
    $result_stockout_inv = mysqli_query($con, $sql_stockout_inv ) or die('Request Data Error');
    $result_stockout_inv_current = mysqli_query($con, $sql_stockout_inv_current ) or die('Request Data Error');
    $stocks = array();
    while($r = mysqli_fetch_assoc($result_stockin)) {
        $r_c = mysqli_fetch_assoc($result_stockin_current);
        $r2 = mysqli_fetch_assoc($result_stockout);
        $r2_c = mysqli_fetch_assoc($result_stockout_current);
        $r3 = mysqli_fetch_assoc($result_stockout_inv);
        $r3_c = mysqli_fetch_assoc($result_stockout_inv_current);
        $model = $r["Model"];
        $brand = $r["Brand"];
        $sequence = $r["Sequence"];
        $obsolete = $r['IsObsolete'];
        $sellerPick = $r['IsSellerPick'];
        $initialStock = $r["BalanceActual"] - $r["TotalIn"] + $r2["TotalOut"];
        $initialStockFloor = $r["BalanceFloor"] - $r["TotalIn"] + $r3["TotalOutInv"];
        $stocks[] = array("Model" => $model, "Brand" => $brand,  "Sequence" => (int) $sequence,
            "IsObsolete" => (bool) $obsolete,
            "IsSellerPick" => (bool) $sellerPick,
            "StockIn" => (int)$r_c["MonthIn"],
            "StockOut" => (int)$r2_c["MonthOut"],
            "StockOutFloor" => (int)$r3_c["MonthOutInv"],
            "Balance" => $initialStock + $r_c["MonthIn"] - $r2_c["MonthOut"],
            "BalanceFloor" => $initialStockFloor + $r_c["MonthIn"] - $r3_c["MonthOutInv"], );
    }
    $stockresponse = json_encode($stocks);

    
    $outp = '{ "Stocks" : ' .$stockresponse ."}";

    echo($outp);
?>