<?php
session_start();
include('dbcon.php');
if (isset($_POST['login']))
{
    $username = mysqli_real_escape_string($con, $_POST['username']);
    $password = mysqli_real_escape_string($con, $_POST['password']);
    
    $query 		= mysqli_query($con, "SELECT * FROM Users WHERE Username='$username'");
    $row		= mysqli_fetch_array($query);
    $num_row 	= mysqli_num_rows($query);
    
    if ($num_row > 0 && $row['Password'] == $password) 
        {			
            $_SESSION['User_ID']=$row['User_ID'];
            header("location: /");
        }
    else
        {
            echo '<script language="javascript">';
            echo 'alert("Wrong username and password");';
            echo "window.location = ('/');";
            echo '</script>';
            
        }
}
?>