<?php
    session_start();
    
    echo '<html>';
    echo '';
    echo '<head>';
    echo '<title>Ban Leng Air Conditioning</title>';
    echo '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">';
    echo '<meta charset="UTF-8">';
    echo '<link rel="stylesheet" type="text/css" href="styles/login.css">';
    echo '</head>';
    echo '';
    echo '<body>';
    echo '<div class="form-wrapper">';
    echo '<div class="apptitle">';
    echo '<img src="img/letterhead.png" />';
    echo '</div>';
    
    include('dbcon.php');
    
    //Check whether the session variable SESS_MEMBER_ID is present or not
    $session_id=$_SESSION['User_ID'];

    if ( isset($session_id) && trim($session_id) != '' &&  $result = mysqli_query($con, "select * from Users where User_ID=$session_id") ) {
      $row = mysqli_fetch_array($result);
      echo "<center> <h3>Welcome:" . $row['Name'] . "</h3></center>";
      echo "<div class='reminder'>";
      echo "<p><a href='https://internal.ban-leng.com/price-inquiry'>Price Inquiry</a></p>";
       echo "<p><a href='https://internal.ban-leng.com/price-inquiry2'>Price Inquiry(Package)</a></p>";
      echo "<p><a href='https://internal.ban-leng.com/quotation-maint'>Quotation - Repair & Maintenance</a></p>";
      echo "<p><a href='https://internal.ban-leng.com/quotation-aircond'>Quotation - Aircond</a></p>";
      echo "<p><a href='https://internal.ban-leng.com/service-book'>Service Book</a></p>";
      echo "<p><a href='https://internal.ban-leng.com/inventory'>Inventory</a></p>";
      echo "<p><a href='https://internal.ban-leng.com/stockin'>Stock In</a></p>";
      echo "<p><a href='https://internal.ban-leng.com/stockout'>Stock Out</a></p>";
      echo "<p><a href='https://internal.ban-leng.com/warranty'>Warranty</a></p>";
      echo "<p><a href='logout.php'>Log out</a></p></div>";
    } else {
      echo "<form action='login.php' method='post'>";
      echo "<div class='form-item'>";
      echo "  <input type='text' name='username' required='required' placeholder='Username' autofocus required></input>";
      echo "</div>";
      echo "<div class='form-item'>";
      echo "  <input type='password' name='password' required='required' placeholder='Password' required></input>";
      echo "</div>";
      echo "<div class='button-panel'>";
      echo "  <input type='submit' class='button' title='Log In' name='login' value='Login'></input>";
      echo "</div>";
      echo "</form>";
    }

    echo '</div>';
    echo '';
    echo '</body>';
    echo '';
    echo '</html>';
?>
