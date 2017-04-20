<?php
/**
 * Created by PhpStorm.
 * User: bjwsl-001
 * Date: 2017/4/11
 * Time: 18:44
 */
header("content-type:application/json;charset=utf-8");
$uname = $_REQUEST['uname'];
require("init.php");
$sql = "SELECT * FROM vg_user WHERE phone = '$uname'";
$result=mysqli_query($conn,$sql);
$row = mysqli_fetch_assoc($result);
if(empty($row)){
    echo '{"code":1,"msg":"该用户名可以使用"}';
}else{
   echo '{"code":-1,"msg":"该用户名已被注册"}';
}
