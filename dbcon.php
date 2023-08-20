<?php
$con = mysqli_connect("localhost:3306","banlengc_staff","banlengc_staff","banlengc_BanLengDB");

// Check connection
if (mysqli_connect_errno())
  {
    echo '<script language="javascript">';
    echo 'alert("System error: Please contact system administrator")';
    echo '</script>';
  }
?>
