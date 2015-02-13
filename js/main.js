// JavaScript Document

//获取开始界面
var startDiv=document.getElementById("startdiv");
//获取开始按钮
var startButton=document.getElementById("startButton");
//获取游戏主界面
var mainDiv=document.getElementById("maindiv");
//获取分数显示模块
var scoreDiv=document.getElementById("scorediv");
//获取显示分数的组件
var scoreLable=document.getElementById("scores");
//获取暂停界面
var suspendDiv=document.getElementById("suspenddiv");
//获取游戏结束界面
var endDiv=document.getElementById("enddiv");
//获取游戏结束后显示最后分数的组件
var totalScore=document.getElementById("totalscore");
//获取重新开始按钮
var continueButton=document.getElementById("continueButton");
//获取背景图片
var bg=document.getElementById("bg");

//初始化分数
var scores=0;

//创建跨浏览器的事件处理程序
var EventUtil={
	addHandler:function(element,type,handler){
		if(element.addEventListener){//非IE
			element.addEventListener(type,handler,false);
		} else if(element.attachEvent){//IE
			element.attachEvent("on"+type,handler);
		} else {
			element["on"+type]=handler;//注：dom1级添加事件 只能添加一个事件
		}
	},
	
	removeHandler:function(element,type,handler){
		if(element.removeEventListener){
			element.removeEventListener(type,handler,false);
		} else if(element.detachEvent){
			element.detachEvent("on"+type,handler);
		} else {
			element["on"+type] = null;
		}
	},
	
	getEvent:function(evt){
		return window.event||evt;
	},
	
	getTarget:function(evt){
		return evt.srcElement||evt.target;
	}
};

//产生介于minNum, maxNum之间的随机数
function rand(minNum,maxNum){
	return Math.floor(minNum+Math.random()*(maxNum-minNum));
}

//得到图片宽度和高度，封装在数组里面size[0],size[1]分别代表宽度和高度
function getImageSize(imageSrc){
	var size=[];
	img=new Image();
	img.src=imageSrc;
	size.push(img.width);
	size.push(img.height);
	img=null;
	return size;
}

//创建飞机类
//imageSrc飞机图片, boomImageSrc飞机爆炸图片, boomTimes爆炸持续时间, 
//x飞机x坐标, y飞机y坐标, sizeX飞机横轴尺寸, sizeY飞机纵轴尺寸, 
//speed飞机速度, hp血量, score所值分数
function Plane(imageSrc,boomImageSrc,boomTimes,x,y,sizeX,sizeY,speed,hp,score){
	this.imageNode=null;//动态添加的img节点
	this.isDie=false;//标记该飞机是否已被消灭
	this.count=0;//计算击中到爆炸结束的时间，从而使敌机消失
	this.imageSrc=imageSrc;
	this.boomImageSrc=boomImageSrc;
	this.boomTimes=boomTimes;
	this.x=x;
	this.y=y;
	this.sizeX=sizeX;
	this.sizeY=sizeY;
	this.speed=speed;
	this.hp=hp;
	this.score=score;
	
	if(this.imageSrc){
		this.init();
	}
}

Plane.prototype.init=function(){
	this.imageNode=document.createElement("img");
	this.imageNode.style.left=this.x+"px";
	this.imageNode.style.top=this.y+"px";
	this.imageNode.src=this.imageSrc;
	mainDiv.appendChild(this.imageNode);
}

//创建子弹类
function Bullet(x,y,sizeX,sizeY,imageSrc){
	this.imageNode=null;
	this.x=x;
	this.y=y;
	this.sizeX=sizeX;
	this.sizeY=sizeY;
	this.imageSrc=imageSrc;
	
	if(this.imageSrc){
		this.init();
	}
}

Bullet.prototype.move=function(){
	this.imageNode.style.top=this.imageNode.offsetTop-20+"px";
}

Bullet.prototype.init = function(){
	this.imageNode=document.createElement("img");
	this.imageNode.style.top=this.y +"px";
	this.imageNode.style.left=this.x+"px";
	this.imageNode.src=this.imageSrc;
	mainDiv.appendChild(this.imageNode);
}

//创建单行子弹类，继承自子弹类
function OddBullet(x,y){
	this.power=1;//攻击威力，每次掉几滴血
	var imageSrc="images/bullet_odd.png";
	var size=getImageSize(imageSrc);
	Bullet.call(this,x,y,size[0],size[1],imageSrc);
	//Bullet.call(this,x,y,6,14,imageSrc);
}

OddBullet.prototype=new Bullet();
OddBullet.prototype.constructor=OddBullet;

//创建敌机类，继承自飞机类
function EnemyPlane(imageSrc,boomImageSrc,boomTimes,x,y,speed,hp,score) {
	var size=getImageSize(imageSrc);
	Plane.call(this,imageSrc,boomImageSrc,boomTimes,rand(x,y),-200,size[0],size[1],speed,hp,score);
	//Plane.call(this,imageSrc,boomImageSrc,boomTimes,rand(x,y),0,sizeX,sizeY,speed,hp,score);
}

EnemyPlane.prototype=new Plane();
EnemyPlane.prototype.constructor=EnemyPlane;

EnemyPlane.prototype.move=function(){
	if(scores<=50000) {
		this.imageNode.style.top=this.imageNode.offsetTop+this.speed+1+"px";
	}
	 else if(scores>50000&&scores<=100000){
		 this.imageNode.style.top=this.imageNode.offsetTop+this.speed+2+"px";
	 }
	 else if(scores>100000&&scores<=150000){
		 this.imageNode.style.top=this.imageNode.offsetTop+this.speed+3+"px";
	 }
	 else if(scores>150000&&scores<=200000){
		 this.imageNode.style.top=this.imageNode.offsetTop+this.speed+4+"px";
	 }
	 else {
		 this.imageNode.style.top=this.imageNode.offsetTop+this.speed+5+"px";
	 }
}

//创建本方飞机类，继承自飞机类
function MyPlane(x,y){
	var imageSrc="images/plane_my.gif";
	//var size=getImageSize(imageSrc);
	//Plane.call(this,imageSrc,"images/plane_my_boom.gif",1000,x,y,size[0],size[1],0,1,0);
	Plane.call(this,imageSrc,"images/plane_my_boom.gif",1000,x,y,66,80,0,1,0);
	//this.imageNode.setAttribute("id", "myPlane");
}

MyPlane.prototype=new Plane();
MyPlane.prototype.constructor=MyPlane;

//创建本方飞机
var myPlane=new MyPlane(120,400);
myPlane.imageNode.style.display="none";
//创建本机随鼠标移动事件
var fly=function() {
	var evt=EventUtil.getEvent(arguments[0]);
	//var target = EventUtil.getTarget(evt);
	myPlane.imageNode.style.top=evt.clientY-myPlane.sizeY/2+"px";
	myPlane.imageNode.style.left=evt.clientX-480-myPlane.sizeX/2+"px";
}

//创建边界条件，判断本方飞机是否移出边界，如果移出边界就去掉mousemove事件，反之就加上
var limit=function(){
	var evt=EventUtil.getEvent(arguments[0]);
	var posX=evt.clientX;
	var posY=evt.clientY;
	if(posX<480+myPlane.sizeX/2){
		myPlane.imageNode.style.left = 0 + "px";
		//EventUtil.removeHandler(mainDiv,"mousemove",fly);
	} else if(posX>800-myPlane.sizeX/2) {
		myPlane.imageNode.style.left=320-myPlane.sizeX+"px";
		//EventUtil.addHandler(mainDiv,"mousemove",fly);
	}
	if(posY<0+myPlane.sizeY/2){
		myPlane.imageNode.style.top=0+"px";
	} else if(posY>500-myPlane.sizeY/2){
		myPlane.imageNode.style.top=500-myPlane.sizeY+"px";
	}
};

EventUtil.addHandler(mainDiv,"mousemove",fly);
EventUtil.addHandler(document.body,"mousemove",limit);

//数组存储敌机
var enemys=[];
//数组存储子弹对象
var bullets=[];
//初始背景图片位置
var bgPosY=-500;
//标记小飞机产生
var flag=0;
//标记大飞机和中飞机产生
var flag1=0;
//记录上一时刻的飞机位置
var pos={};

//开始
function start(){
	//背景移动
	bg.style.top=bgPosY+"px";
	bgPosY+=0.5;
	if(bgPosY>=0){
		bgPosY=-500;
	}
	
	//产生飞机
	flag++;
	if(flag==20){
		flag1++;
		if(flag1%6==0){//产生中飞机
			//imageSrc,boomImageSrc,boomTimes,x,y,speed,hp,score
			enemys.push(new EnemyPlane("images/plane_middle.png","images/plane_middle_boom.gif",200,25,274,rand(1,3),5,5000));
		}
		if(flag1==23){//产生大飞机
			enemys.push(new EnemyPlane("images/plane_big.png","images/plane_big_boom.gif",400,57,210,1,10,10000));
			flag1=0;
		} else{//产生小飞机
			enemys.push(new EnemyPlane("images/plane_small.png","images/plane_small_boom.gif",100,19,286,rand(1,4),1,1000));
		}
		flag=0;
	}
	
	var enemyLen=enemys.length;
	for(var i=0;i<enemyLen;i++){
		//敌机移动
		if(enemys[i].isDie!=true){
			enemys[i].move();
		}
		
		//移除敌机		
		if(enemys[i].imageNode.offsetTop>=500){
			mainDiv.removeChild(enemys[i].imageNode);
			enemys.splice(i,1);
			enemyLen--;
		}
		if(enemys[i].isDie==true){
			enemys[i].count+=20;
			if(enemys[i].count==enemys[i].boomTimes){
				mainDiv.removeChild(enemys[i].imageNode);
				enemys.splice(i,1);
				enemyLen--;
			}
		}
		
	}
	
	//创建子弹
	if(flag%5==0){
		bullets.push(new OddBullet(parseInt(myPlane.imageNode.style.left)+30,parseInt(myPlane.imageNode.style.top)));
	}
	
	var bulletsLen=bullets.length;
	for(var j=0;j<bulletsLen;j++){
		//移动子弹
		bullets[j].move();
		
		//删除子弹
		if(bullets[j].imageNode.offsetTop<=0){
			mainDiv.removeChild(bullets[j].imageNode);
			bullets.splice(j,1);
			bulletsLen--;
		}
	}
	
	//碰撞检测
	for(var m=0;m<bulletsLen;m++){
		for(var n=0;n<enemyLen;n++){
			//检测子弹打到飞机
			var bullet=bullets[m].imageNode;
			var enemy=enemys[n].imageNode;
			var self=myPlane.imageNode;
			if(bullet.offsetLeft>=enemy.offsetLeft-bullets[m].sizeX&&bullet.offsetLeft<=enemy.offsetLeft+bullets[m].sizeX+enemys[n].sizeX){
				if(bullet.offsetTop>=enemy.offsetTop-bullets[m].sizeY&&bullet.offsetTop<=enemy.offsetTop+bullets[m].sizeY+enemys[n].sizeY){
					//检测血量
					enemys[n].hp=enemys[n].hp-bullets[m].power;
					if(enemys[n].hp==0){
						scores=scores+enemys[n].score;
						scoreLable.innerHTML=scores;
						enemy.src=enemys[n].boomImageSrc;
						enemys[n].isDie=true;
					}
					mainDiv.removeChild(bullet);
					bullets.splice(m,1);
					bulletsLen--;
					break;
				}
			}
			
			//检测敌机碰撞我机
			if(enemy.offsetLeft>=self.offsetLeft-enemys[n].sizeX+20&&enemy.offsetLeft<=self.offsetLeft+myPlane.sizeX-20){
				if(enemy.offsetTop>=self.offsetTop-enemys[n].sizeY+10&&enemy.offsetTop<=self.offsetTop+myPlane.sizeY-20){
					self.src=myPlane.boomImageSrc;
					endDiv.style.display="block";
					totalScore.innerHTML=scores;
					EventUtil.removeHandler(mainDiv,"mousemove",fly);
					EventUtil.removeHandler(document.body,"mousemove",limit);
					timerFlag=false;
				}
			}
			
		}
	}
	
}

//开始游戏
var timerFlag=true;//标记计时器是否开启
function startGame(){
	startDiv.style.display="none";
	mainDiv.style.display="block";
	scoreDiv.style.display="block";
	myPlane.imageNode.style.display="block";
	setTimeout(function(){
		start();
		if(timerFlag){
			setTimeout(arguments.callee,20);
		}
	},20);
}

//结束游戏
function endGame(){
	EventUtil.removeHandler(startButton,"click",startGame);
	location.reload(true);
}

//暂停游戏
var suspendFlag=false;
function suspendGame(){
	if(!suspendFlag){
		suspendDiv.style.display="block";
		EventUtil.removeHandler(mainDiv,"mousemove",fly);
		EventUtil.removeHandler(document.body,"mousemove",limit);
		timerFlag=false;
		suspendFlag=true;
	} else{
		suspendDiv.style.display="none";
		EventUtil.addHandler(mainDiv,"mousemove",fly);
		EventUtil.addHandler(document.body,"mousemove",limit);
		timerFlag=true;
		suspendFlag=false;
		startGame();
	}
}

function restartGame(){
	scores=0;
	scoreLable.innerHTML=scores;
	var enemyLen=enemys.length;
	for(var i=0;i<enemyLen;i++){		
		mainDiv.removeChild(enemys[i].imageNode);
	}
	enemys=[];
	suspendGame()
}

EventUtil.addHandler(startButton,"click",startGame);
EventUtil.addHandler(continueButton,"click",endGame);
EventUtil.addHandler(myPlane.imageNode,"click",suspendGame);
EventUtil.addHandler(suspendDiv.getElementsByTagName("button")[0],"click",suspendGame);
EventUtil.addHandler(suspendDiv.getElementsByTagName("button")[1],"click",restartGame);
EventUtil.addHandler(suspendDiv.getElementsByTagName("button")[2],"click",endGame);