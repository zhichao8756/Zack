<?php
/**
 * Created by PhpStorm.
 * User: bjwsl-001
 * Date: 2017/4/12
 * Time: 19:29
 */
header("content-type:application/json;charset=utf-8");
$uname = $_REQUEST['user_name'] or die('{"code":-2,"msg":"用户名不能为空"}');
$upwd = $_REQUEST['user_pwd'] or die("{'code':-3,'msg':'用户密码不能为空'}");

require("init.php");

$sql = "SELECT * FROM vg_user WHERE phone = '$uname' AND password = '$upwd'";
$result = mysqli_query($conn,$sql);
$row = mysqli_fetch_assoc($result);
if($row===null){
    echo '{"code":-1,"msg":"用户名或密码错误"}';
}else{
    $row=["code"=>1,"msg"=>"登录成功","uname"=>$row['phone'],"uid"=>$row["uid"]];
    echo json_encode($row);
}