
//���ڵ�¼�������߼����⴦��
$("#login").children(".arrow1").click(function(){
    $(this).parent().next().toggleClass("login_main1");
    $(this).parent().siblings(".modal").toggle();
    $(this).parent().siblings(".regist_main").css("display","none");
    $(this).parents("body").toggleClass("fixed");
});
$("div.modal").click(function(){
    $(this).siblings(".login_main1").removeClass("login_main1");
    $(this).parent("body").removeClass("fixed");
    $(this).toggle();
})
$("div.modal").click(function(){
    $(this).siblings(".regist_main").css("display","none");
})
$("#btn a").click(function(e){
    e.preventDefault();
    $(this).children(":first").toggleClass("slide");
    $(this).toggleClass("slide-color");
})
$("div.zhuce").children(':last').click(function(e){
    e.preventDefault();
    $(this).parents().siblings('.regist_main').css('display','block');
})
//banner�ֲ�
$("#banner li").mouseover(function(){
    $(this).addClass("slide_banner");
})
$("#banner li").mouseout(function(){
    $(this).removeClass("slide_banner");
})
//�ı����ý���ʱ
$("input").focus(function(){
    $(this).css({
        "box-shadow": "rgba(0, 0, 0, 0.117647) 0px 3px 8px 0px, rgba(0, 0, 0, 0.14902) 0px                          6px 16px 0px"
    });
})
//�ı���ʧȥ����ʱ
$("input").blur(function(){
    $(this).css({
        "box-shadow":"none"
    });
})
//��¼����ajax����
$("#btn2").click(function(){
    var n = $("#uname");
    console.log(n);
    var p = $("#upwd");
    $.ajax({
        type:"POST",
        url:"data/login.php",
        data:{user_name:n.val(),user_pwd:p.val()},
        success:function(data){
            if(data.code<0){
                alert(data.msg);
            }else{
                alert(data.msg);
            }
        },
        error:function(data){

        }
    });
});
