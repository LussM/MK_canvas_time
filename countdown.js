var WINDOW_WIDTH=800;
var WINDOW_HEIGHT=500;
var R=3;
var MARGIN_TOP=60;
var MARGIN_LEFT=150;
var endTime=new Date();
endTime.setTime(endTime.getTime()+3600*1000);
var curShowTimeSeconds=0;
var balls=[];
var colors=["lightblue","pink","palegreen","coral","plum","hotpink","gold","deepskyblue","white","olivedrab"];

window.onload=function (event) {
    var oCanvas=document.getElementById("drawing");
    oCanvas.width=WINDOW_WIDTH;
    oCanvas.height=WINDOW_HEIGHT;
    if(oCanvas.getContext){
        var context=oCanvas.getContext("2d");
        curShowTimeSeconds=getCurrentShowSeconds();
        // render(context);
        setInterval(function () {
            render(context);//画
            update();//更新时间，更新球
        },100);
    }

};
function render(context) {
    // var date=new Date();
    // var hour=toDouble(date.getHours());
    // var minute=toDouble(date.getMinutes());
    // var second=toDouble(date.getSeconds());
    context.clearRect(0,0,1300,700);

    var hour=parseInt(curShowTimeSeconds/3600);
    var minute=parseInt((curShowTimeSeconds-hour*3600)/60);
    var second=curShowTimeSeconds-hour*3600-minute*60;
    hour=toDouble(hour);
    minute=toDouble(minute);
    second=toDouble(second);
    context.beginPath();//画倒计时的时间
    renderDigit(MARGIN_LEFT,MARGIN_TOP,parseInt(hour[0]),context);
    renderDigit(MARGIN_LEFT+15*(R+1),MARGIN_TOP,parseInt(hour[1]),context);
    renderDigit(MARGIN_LEFT+30*(R+1),MARGIN_TOP,10,context);
    renderDigit(MARGIN_LEFT+39*(R+1),MARGIN_TOP,parseInt(minute[0]),context);
    renderDigit(MARGIN_LEFT+54*(R+1),MARGIN_TOP,parseInt(minute[1]),context);
    renderDigit(MARGIN_LEFT+69*(R+1),MARGIN_TOP,10,context);
    renderDigit(MARGIN_LEFT+78*(R+1),MARGIN_TOP,parseInt(second[0]),context);
    renderDigit(MARGIN_LEFT+93*(R+1),MARGIN_TOP,parseInt(second[1]),context);
    context.closePath();

    for(var i=0;i<balls.length;i++){//球的位置信息和颜色都在balls对象里，在这里拿到这些信息就可以画彩色的球
        context.fillStyle=balls[i].color;//随机产生的颜色
        context.beginPath();
        context.arc(balls[i].x,balls[i].y,R,0,2*Math.PI,false);//画球
        context.closePath();
        context.fill();//添色
    }
}
function renderDigit(x,y,num,context) {//画倒计时时间的函数
    context.fillStyle="white";
    for(var i=0;i<digit[num].length;i++){//10
        for(var j=0;j<digit[num][i].length;j++){//7
            if(digit[num][i][j]===1){
                context.beginPath();
                context.arc(x+j*2*(R+1)+(R+1),y+i*2*(R+1)+(R+1),R,0,2*Math.PI,false);
                context.closePath();
                context.fill();
            }
        }
    }
}
function toDouble(num) {//将时间的一位数字变成两位数字，本例子也可以不用
    if(num<10){
        return "0"+num;
    }else{
        return num+"";
    }
}
function getCurrentShowSeconds() {//获取毫秒数，获取当前时间距离倒计时指定时间的毫秒差值
    var curTime=new Date();
    var ret=endTime.getTime()-curTime.getTime();
    ret=Math.round(ret/1000);
    return ret>=0? ret:0;
}
function update() {//
    var nextShowTimeSeconds=getCurrentShowSeconds();
    var nextHour=parseInt(nextShowTimeSeconds/3600);
    var nextMinute=parseInt((nextShowTimeSeconds-nextHour*3600)/60);
    var nextSecond=nextShowTimeSeconds-nextHour*3600-nextMinute*60;

    var curHour=parseInt(curShowTimeSeconds/3600);
    var curMinute=parseInt((curShowTimeSeconds-curHour*3600)/60);
    var curSecond=curShowTimeSeconds-curHour*3600-curMinute*60;
    if(nextSecond!==curSecond){
        if(parseInt(curHour/10) !== parseInt(nextHour/10)){
            addBalls(MARGIN_LEFT,MARGIN_TOP,parseInt(curHour/10));//如果不相等，就根据相应的事件位置，添加一组球，balls数组里就有数据了
        }
        if(parseInt(curHour%10) !== parseInt(nextHour%10)){
            addBalls(MARGIN_LEFT+15*(R+1),MARGIN_TOP,parseInt(curHour%10));
        }
        if(parseInt(curMinute/10) !== parseInt(nextMinute/10)){
            addBalls(MARGIN_LEFT+39*(R+1),MARGIN_TOP,parseInt(curMinute/10));
        }
        if(parseInt(curHour%10) !== parseInt(nextHour%10)){
            addBalls(MARGIN_LEFT+54*(R+1),MARGIN_TOP,parseInt(curHour%10));
        }
        if(parseInt(curSecond/10) !== parseInt(nextSecond/10)){
            addBalls(MARGIN_LEFT+78*(R+1),MARGIN_TOP,parseInt(curSecond/10));
        }
        if(parseInt(curSecond%10) !== parseInt(nextSecond%10)){
            addBalls(MARGIN_LEFT+93*(R+1),MARGIN_TOP,parseInt(curSecond%10));
        }
        curShowTimeSeconds=nextShowTimeSeconds;
    }
    updateBalls();
}
function updateBalls() {//为每个球加入落体的动画
    for(var i=0;i<balls.length;i++){
        balls[i].x+=balls[i].vx;
        balls[i].y+=balls[i].vy;
        balls[i].vy+=balls[i].g;
        if(balls[i].y>=WINDOW_HEIGHT-R){
            balls[i].y=WINDOW_HEIGHT-R;
            balls[i].vy=-balls[i].vy*balls[i].mu;
            // console.log(balls[i].vy);
            if (Math.abs(balls[i].vy)<8){
                balls[i].vy=0;
            }
        }
        // console.log(balls.length);
        // for(var i=0;i<balls.length;i++){
        //     if(balls[i].x<0){
        //         balls.pop();
        //     }
        // }
    }
    var cnt=0;//性能优化
    for(var i=0;i<balls.length;i++){
        if(balls[i].x+R>0 && balls[i].x-R<WINDOW_WIDTH){
            balls[cnt++]=balls[i];
        }
    }
    while(balls.length>cnt){
        balls.pop();
    }
    console.log(balls.length);
}
function addBalls(x,y,num) {//在每一个数字点阵上产生彩色的球
    for(var i=0;i<digit[num].length;i++){
        for(var j=0;j<digit[num][i].length;j++){
            if (digit[num][i][j]===1){
                var aBall={
                    x:x+j*2*(R+1)+(R+1),
                    y:y+i*2*(R+1)+(R+1),
                    g:2.5+Math.random(),
                    vx:-Math.pow(1,Math.ceil(Math.random()*1000))*4,//-4
                    vy:-5,
                    color:colors[Math.floor(Math.random()*colors.length)],//随机一个colors数组的角标
                    mu:0.5
                };
                balls.push(aBall);//一个数字点阵的所有球
            }
        }
    }
}
