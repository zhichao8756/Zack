<?php
/**
 * Created by PhpStorm.
 * User: bjwsl-001
 * Date: 2017/4/10
 * Time: 18:52
 */
header("content-type:application/json;charset=utf-8");
@$n = $_REQUEST['uname'] or die('{"code":-2,"msg":"密码不能为空"}');
@$p=$_REQUEST['upwd']or die ('{"code":-1,"msg":"密码不能为空"}');
require("init.php");
$sql = "INSERT INTO vg_user VALUES(null,'$n','$p')";
$result=mysqli_query($conn,$sql);
$uid=mysqli_insert_id($conn);
$output=[
    'code'=>1,
    'msg'=>'注册成功',
    'uid'=>$uid
];
if($result===true){
    echo json_encode($output);
}else{
    echo'{"code":-3,"msg":"注册失败"}';
}