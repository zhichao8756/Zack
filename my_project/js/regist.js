/**
 * Created by bjwsl-001 on 2017/3/23.
 */
+function(){
    var txtName=document.getElementsByName("uname")[0];
    var txtPwd=document.getElementsByName("upwd")[0];
    var txtpassAgain=document.getElementsByName("passAgain")[0];
    var rName=false;
    var rPwd=false;
    console.log( txtpassAgain);
    txtName.onfocus=getFocus1;
    txtPwd.onfocus=getFocus2;
    txtName.onblur=loseFocus1;
    txtPwd.onblur=loseFocus2;
    txtpassAgain.onblur=loseFocus3;
    function getFocus1(){
        $(this).parent()
            .siblings(".txt_blur1")
            .removeClass("txt_lose");
            rName=false;

    }
    function getFocus2(){
        $(this).parent()
            .siblings(".txt_blur2")
            .removeClass("txt_lose");
    }
    function loseFocus1(){
        $(this).parent()
            .siblings(".txt_blur1")
            .addClass("txt_lose");
        var test = vali(this,/^1[34578]\d{9}$/,/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/);
        if(test){
            var url="data/check_name.php";
            $.ajax({
                type:"post",
                url:url,
                data:{uname:txtName.value},
                success:function (data) {
                    console.log(data);
                    $("div.check_name").html(data.msg);
                    if(data.code==1){
                        console.log(222);
                        rName=true;
                    }
                },
                error:function(){
                    console.log(2121);
                }
            });
        }
    }
    function loseFocus2(){
        $(this).parent()
            .siblings(".txt_blur2")
            .addClass("txt_lose");
            rPwd=vali(this,/[A-Za-z0-9]{8,10}/,/[A-Za-z0-9]{8,10}/);
    }
    function vali(txt,reg1,reg2){
        if(reg1.test(txt.value)||reg2.test(txt.value)){
            $(txt).next("b")
                  .addClass("vali_success");
            $(txt).next("b")
                  .removeClass("txt_lose")
                  .removeClass("vali_fail");
            return true;
        }else{
            $(txt).parent()
                .siblings(".txt_blur1")
                .removeClass("txt_lose")
                .addClass("vali_fail");
            $(txt).next("b").removeClass("vali_success");
            return false;
        }
    }
    function loseFocus3(){
       if(this.value!=txtPwd.value){
           $(this).siblings(".same").css("display","block");
           $(this).siblings(".vali").removeClass("vali_success");
           return true;
       }else{
           $(this).siblings(".same").css("display","none");
           $(this).siblings(".vali").addClass("vali_success");
           return false;
       }
    }
    $("a.login").click(function(e){
        e.preventDefault();
        $(this).parent().toggle();
    });
    //ajax请求
    $("#btn3").click(function(){
        console.log(rName,rPwd);
        if(rName&&rPwd){
            var url="data/register.php";
            var data=$("#form1").serialize();
            $.ajax({
                type:"post",
                url:url,
                data:data,
                success:function(obj){
                    if(obj.code<0){
                        alert("注册失败,错误原因"+obj.msg);
                    }else{
                        alert("注册成功,自动跳转登录界面");
                        $("div.regist_main").css("display","none");

                    }
                },
                error:function(){

                }
            });
        }else if(txtName.value==""){
            txtName.focus();
        }
        else if(txtPwd.value==""){
           txtPwd.focus();
        }
    });
    $("input[name='uname']").blur(function(){

    });
}();
