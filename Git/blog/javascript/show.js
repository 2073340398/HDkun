$(function(){
    //选中导航栏的不同标签 显示下面的白条
    $('.nav_ul li').click(function(){
        $(this).addClass('active')
        $(this).siblings().removeClass('active')
    })
    // 点击侧栏菜单标签 显示侧栏菜单和遮罩
    $('.silder_btn').click(function(){
        showSilder();
    })
    // 点击遮罩 隐藏侧栏菜单和遮罩
    $('.mask').click(function(){
        hideSilder();
    })
    // 显示侧栏菜单和遮罩
    function showSilder(){
        $('.silder').css('right',0)
        $('.mask').fadeIn()/*显示遮罩*/
    }
    // 隐藏侧栏菜单和遮罩
    function hideSilder(){
        $('.mask').fadeOut()/*隐藏遮罩*/
        $('.silder').css('right',-300)
    }
    // 隐藏和显示回到顶部按钮
    $(window).scroll(function(){
        if($(window).scrollTop()>100){
            $('.top').css('display','block')
        }
        else{
            $('.top').css('display','none')
        }
    })
    // 回到顶部
    $('.top').click(function(){
        $('body,html').animate()({
            scrollTop:0
        },300)
    })
})