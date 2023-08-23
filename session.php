<?php
//Start session
session_start();
//Check whether the session variable SESS_MEMBER_ID is present or not
if (!isset($_SESSION['User_ID']) || (trim($_SESSION['User_ID']) == '')) {
    header("location: /");
    exit();
}
$session_id=$_SESSION['User_ID'];

?>