var canvas = document.getElementById("game");
var context = canvas.getContext("2d");
addEventListener("keydown", user_keybord);
var game_on = true;

function Matrics(){
	
	this.SIZEOFRECT = 20;
	this.H = canvas.height /this.SIZEOFRECT;
	this.W = canvas.width/this.SIZEOFRECT;
	this.matrix = [];
};

Matrics.prototype.full_matr = function(){
	for(let i = 0; i<this.W;i++){
		this.matrix[i] = [];
		for (let j = 0; j < this.H; j++) {
			if(i == 0||i ==this.W-1||j == 0||j ==this.H-1)		
					this.matrix[i][j] = [255,255,255];
			else
					this.matrix[i][j] =[0,0,0]// [255/(this.W-1)*i,-255/(this.W-1)*i+255/(this.H-1)*j,255/(this.H-1)*j]
		}		
	};
};
Matrics.prototype.draw_rect = function(color,x,y){
	window.context.fillStyle = get_Color(color)
	       window.context.fillRect(this.SIZEOFRECT*x,this.SIZEOFRECT*y,this.SIZEOFRECT,this.SIZEOFRECT);

};

Matrics.prototype.draw_matr = function(){
	for (let i = this.W -1; i >= 0; i--)
		for (let j = this.H - 1; j >= 0; j--)			
	        this.draw_rect((this.matrix[i][j]),i,j)
		
};

Matrics.prototype.adaptColor = function(x,y,color){
	let res = [];
	for (let i = 0; i < 3; i++)
		res[i] = (this.matrix[x][y][i]+color[i])/2;
	return res;
	
};


function Player(mat,nam,body,direct,loc,contr){
	this.name = nam;
	this.matr = mat;
	this.color_id = [body[0]/3,body[1]/3,body[2]/3];;
	this.color_way =body;
	this.color_body=body;
	this.direction = direct
	this.location = loc
	this.capacity = 0;
	this.way = [];
	this.max_x = loc[0]+1;
	this.max_y = loc[1]+1;
	this.min_x = loc[0]-1;
	this.min_y = loc[1]-1;
	this.controls = contr;
};


Player.prototype.spown = function(){
	for (let i = this.location[0]-1; i <=this.location[0]+1; i++)
		for (let j = this.location[1]-1; j <=this.location[1]+1; j++) {
			this.matr.matrix[i][j] = this.color_id;
	}
	this.power();
};


Player.prototype.test = function(){	
	 if (this.matr.matrix[this.location[0]][this.location[1]]!=this.color_id)
		this.way.push([this.location[0],this.location[1]]);
	
	
	else if(this.matr.matrix[this.location[0]][this.location[1]]==this.color_id)
		this.get_teretory(matr);
		

	

	if (this.location[0]<=0||this.location[0]>=matr.W-1||this.location[1]<=0||this.location[1]>=matr.H-1)
		this.die();
};

Player.prototype.die = function(){
	for (let i = 0; i <this.matr.W; i++) 
		for (let j = 0; j < this.matr.H; j++) 
			if(this.matr.matrix[i][j]==this.color_id)
				this.matr.matrix[i][j] =[0,0,0] ;	
			let loc,n = 0;
	do{
		 loc = [randomInteger(5, this.matr.W-5),randomInteger(5, this.matr.H-5)]
		 n++;
	}while(!this.matr.matrix[loc[0]][loc[1]].every(function(x){return x==0}||n<10000))
	
this.capacity = 0;
this.location = loc;
this.max_x = this.location[0]+1;
this.max_y = this.location[1]+1;
this.min_x = this.location[0]-1;
this.min_y = this.location[1]-1;
this.direction = randomInteger(0,3);
this.way = [];

this.spown();
};
Player.prototype.move = function(){

	
	this.test();
	this.getBorder();
	
	
	switch(this.direction){
		case 0:		
		this.location[1] -=1;
		break;
		case 1:
        this.location[0] +=1;
        break;
		case 2:
		this.location[1] +=1;
		break;
		case 3:
		this.location[0] -=1;
        break;
	}

};

Player.prototype.draw = function(){
		this.matr.draw_rect(this.color_body,this.location[0],this.location[1])
		for (let i = 0; i < this.way.length; i++) 
			this.matr.draw_rect(this.matr.adaptColor(this.way[i][0],this.way[i][1],this.color_way) ,this.way[i][0],this.way[i][1])
		
	
};

Player.prototype.inWay = function(x,y){
for (let i = 0; i < this.way.length; i++) 
	if(this.way[i][0]==x&&this.way[i][1]==y)
		return true;
	return false;

};
Player.prototype.deep = function(x,y,bool){
		if(this.matr.matrix[x][y]!=this.color_id && !this.inWay(x,y)&&bool[x-this.min_x+1][y-this.min_y+1]!=true){			
			bool[x-this.min_x+1][y-this.min_y+1] = true;
			for (let i = x-1; i <= x+1; i++)
				for (let j = y-1; j <= y+1; j++)
					if(i<=this.max_x+1 && i>=this.min_x-1 && j<=this.max_y+1 && j>=this.min_y-1)
						this.deep(i,j,bool);		
								
		};	
};
Player.prototype.get_teretory = function(){
			
if(this.way.length!=0){
let bool = [];
	for (let i = 0 ; i <=this.max_x-this.min_x+2; i++) {
	bool[i]=[];
	};

this.deep(this.min_x-1,this.min_y-1,bool);
console.log(bool);

for (let i = 0; i <bool.length; i++) {
	for (let j = 0; j <bool[i].length ; j++) {
		if(bool[i][j]!=true)
			this.matr.matrix[i+this.min_x-1][j+this.min_y-1] = this.color_id;
	}
}
this.power();
this.way=[];
	};
};
Player.prototype.power = function(){
	this.capacity = 0;
for (let i = 0; i < this.matr.W; i++) {
	for (let j = 0; j < this.matr.H; j++) {
		if(this.matr.matrix[i][j]==this.color_id)
			this.capacity++;
	}
}
};
Player.prototype.relations = function(x,y,bool){
	if((this.matr.matrix[x][y]==this.color_id||this.inWay(x,y) )&& bool[x][y]!= true){
		bool[x][y] = true;		
		if(this.matr.matrix[x][y]==this.color_id)
			this.capacity++;		
		this.max_x = Math.max(this.max_x,x);
		this.max_y = Math.max(this.max_y,y);
		this.min_x = Math.min(this.min_x,x);
		this.min_y = Math.min(this.min_y,y);
		for (let i = x-1; i <=x+1; i++) 
			for (let j = y-1; j <= y+1; j++) 
				if (i>=0 && i<=this.matr.W-1 && j>=0 && j<=this.matr.H-1)
					this.relations(i,j,bool)
			
	}

};
Player.prototype.getBorder = function(){
	this.max_x =-Infinity;
	this.max_y =-Infinity;
	this.min_x =Infinity;
	this.min_x =Infinity;
	this.capacity = 0;
	
	let bool =[];
	for (let i = 0; i < this.matr.W; i++) {
		bool[i] = [];
	};
	
		this.relations(this.location[0],this.location[1],bool);

	for (let i = 0; i < this.matr.W; i++)
		for (let j = 0; j < this.matr.H; j++)
			if(this.matr.matrix[i][j]==this.color_id&&bool[i][j]!=true)
				this.matr.matrix[i][j] = [0,0,0]
	
};

function get_Color(color){
return 'rgb('+color[0]+','+color[1]+','+color[2]+')'
};


function randomInteger(min, max) {
  let rand = min + Math.random() * (max - min)
  rand = Math.round(rand);
  return rand;
};

function user_keybord(e){
if(game_on)
	for (let i = 0; i < players.length; i++) {
		for (let j = 0; j < players[i].controls.length; j++) {
			if(players[i].controls[j] == e.keyCode && Math.abs(players[i].direction - j)!=2)
				players[i].direction = j;
		}
	}
else
	if(e.keyCode == 32)
		start_game();
};

function print(text,H ,size,color){

		context.fillStyle  = get_Color(color);
    context.font = 'bold '+size+'px sans-serif';
    context.fillText(text, (canvas.width - text.length*size/2)/2, H+size);
};

function print_capacity(){
	context.fillStyle  = "rgb(225,225,225)";
    context.font = 'bold 18px sans-serif';
    function porivn(a,b){
    	return -a.capacity + b.capacity;
    }
    let start = Math.min(players.length,5)
    let top = players.sort(porivn);
    for (let i = 0; i < start; i++) {
    	context.fillText(top[i].name+": "+top[i].capacity, matr.SIZEOFRECT, matr.SIZEOFRECT+18 +i*18);
    }
    
};

function start_game(){
matr = new Matrics();
matr.full_matr();
players = [
 new Player(window.matr,prompt("Enter your name","Player1"),[225,0,0],randomInteger(0, 3),[randomInteger(5, this.matr.W-5),randomInteger(5,  this.matr.H-5)],[38,39,40,37])
,new Player(window.matr,prompt("Enter your name","Player2"),[204,0,204],randomInteger(0, 3),[randomInteger(5,  this.matr.W-5),randomInteger(5,  this.matr.H-5)],[87,68,83,65])
];
for (let i = 0; i < players.length; i++) 
	players[i].spown(matr);
 clock = TIME;
tik();
game_on = true;
game();
};

function update(){
if(game_on)
	
		for (let i = 0; i < players.length; i++)
			players[i].move(matr);
		for (let i = 0; i < players.length; i++)
			for (let j = 0; j < players.length; j++) {
				if(players[i].inWay(players[j].location[0],players[j].location[1]))
					players[i].die();
			}
};

function render(){ 
	matr.draw_matr();
	for (let i = 0; i < players.length; i++) 
		players[i].draw(matr);	
	print_capacity();
	print(clock+"",matr.SIZEOFRECT,50,[255*(1-clock/TIME),255*(clock/TIME),0]);
};
	
function game(){
	if(game_on == true){
		render();

		if(Math.floor(performance.now() - timer )>PERIOD){
			update();
			timer = performance.now()
		}

	requestAnimationFrame(game);
	}

	else{
		huWin();
	};

};

var requestAnimationFrame = (function(){
	return window.requestAnimationFrame||
	window.webkitRequestAnimationFrame||
	window.mozRequestAnimationFrame||
	window.oRequestAnimationFrame||
	window.msRequestAnimationFrame||
	function(callback){
		window.setTimeout(callback,1000/20);
	};
})();

function equals(arr1,arr2){
for (let i = 0; i < arr2.length; i++)
	if(arr1[i]!=arr2[i])
		return false;
return true;

};
function tik(){
	clock--;
	if(clock>=0)
	setTimeout(tik,1000);
	else
	 game_on = false;
};
function huWin(){
	
    print(players[0].name+" WIN!!!", 250,100,players[0].color_body)
     print("Press SPACE to restart", 400,100,[255,255,255])


} 

const PERIOD = 80;
const TIME = 101;
let clock = TIME;
let timer = 0;
var matr = new Matrics();
let players= [];
start_game();




