var canvas = document.getElementById("game");
var context = canvas.getContext("2d");
addEventListener("keydown", user_keybord);
var game_on = true;




function edd_Matrics(){
	
	this.SIZEOFRECT = 10;
	this.H = 700 /this.SIZEOFRECT;
	this.W = 1200/this.SIZEOFRECT;
	this.matrix = [];
};

edd_Matrics.prototype.full_matr = function(){
	for(var i = 0; i<this.W;i++){
		this.matrix[i] = [];		
	}

	
};
edd_Matrics.prototype.draw_rect = function(color,x,y){
	window.context.fillStyle = get_Color(color)
	       window.context.fillRect(this.SIZEOFRECT*x,this.SIZEOFRECT*y,this.SIZEOFRECT,this.SIZEOFRECT);

};

edd_Matrics.prototype.draw_matr = function(){
	for (var i = this.W -1; i >= 0; i--)
		for (var j = this.H - 1; j >= 0; j--)			
	        this.draw_rect((this.matrix[i][j]),i,j)
		
};

function edd_Player(nam,i_d,way){
	this.name = nam;
	this.color_way = way
	this.color_body = i_d;
	this.direction = randomInteger(0, 3);
	this.location = [randomInteger(0, 119),randomInteger(0, 69)];
	this.body_size = 1;
	this.capacity = 0;
};

edd_Player.prototype.control = function(cord,siz){
if (cord<0)
		cord = siz+cord;
	if (cord>siz-1)
		cord =cord - siz;
	return cord;
};

edd_Player.prototype.move = function(matr){
	for (var i = this.location[0]; i <this.location[0]+ this.body_size; i++) 
		for (var j = this.location[1]; j < this.location[1]+this.body_size; j++)
matr.matrix[this.control(i,matr.W)][this.control(j,matr.H)] = this.color_way;
		
	
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
this.location[0] = this.control(this.location[0],matr.W);
this.location[1] = this.control(this.location[1],matr.H);
};

edd_Player.prototype.draw = function(matr){
for (var i = this.location[0]; i <this.location[0]+ this.body_size; i++) 
		for (var j = this.location[1]; j < this.location[1]+this.body_size; j++)
		matr.draw_rect(this.color_body,this.control(i,matr.W),this.control(j,matr.H))
	
};
edd_Player.prototype.eate = function(matr){
	for (var i = this.location[0]; i <this.location[0]+ this.body_size; i++) 
		for (var j = this.location[1]; j < this.location[1]+this.body_size; j++){
		if(matr.matrix[this.control(i,matr.W)][this.control(j,matr.H)] != this.color_way&&matr.matrix[this.control(i,matr.W)][this.control(j,matr.H)]!=undefined){
			this.capacity++;}
}
	if(this.capacity/this.body_size/this.body_size>=50)
			this.body_size++;
};


function get_Color(numb){
switch(numb%10){
	case 0: return "rgb(255,0,0)";
	case 1: return "rgb(255, 0, 255)";
	case 2: return "rgb(0,0,255)";
	case 3: return "rgb(250, 235, 215)";
	case 4: return "rgb(205, 92, 92)";
	case 5: return "rgb(106, 90, 205)";
	case 6: return "rgb(0,255,0)";
	case 7: return "rgb(128, 0, 0)";
	case 8: return "rgb(0, 250, 154)";
	case 9: return "rgb(255, 255, 0)";
	}
	return "rgb(0, 0, 0)";
};

function randomInteger(min, max) {
  var rand = min + Math.random() * (max - min)
  rand = Math.round(rand);
  return rand;
};

function user_keybord(e){
switch(e.keyCode){
	case 38:
	players[0].direction = 0;
	break;
	case 39:
	players[0].direction = 1;
	break;
	case 40:
	players[0].direction = 2;
	break;
	case 37:
	players[0].direction = 3;
	break;
	case 87:
	players[1].direction = 0;
	break;
	case 68:
	players[1].direction = 1;
	break;
	case 83:
	players[1].direction = 2;
	break;
	case 65:
	players[1].direction = 3;
	break;
    case 32:
    if(!game_on)
		start_game(matr,players);
	break;
}};
function players_hant(players){
	for (var i = 0; i < players.length; i++)
			for (var j = 0; j < players.length; j++) {
		if (players[i].location[0]<=players[j].location[0]
			&&players[i].location[0]+players[i].body_size-players[j].body_size>=players[j].location[0]
			&&players[i].location[1]<=players[j].location[1]
			&&players[i].location[1]+players[i].body_size-players[j].body_size>=players[j].location[1]
			&&players[i].body_size>players[j].body_size){
			players.splice(j,1) ;
		

		}
		
	}
	if (players.length == 1){					
			game_on = false;

		}
};
function print(text,H){

		context.fillStyle  = "rgb(225,225,225)";
    context.font = 'bold 100px sans-serif';
    context.fillText(text, (1200 - text.length*50)/2, H);
};
function print_capacity(){
context.fillStyle  = "rgb(225,225,225)";
    context.font = 'bold 18px sans-serif';
    var start = Math.min(players.length,5)
    for (var i = 0; i < start; i++) {
    	context.fillText(players[i].name+": "+players[i].capacity, 0, 20 +i*20);
    }
    
};
function start_game(){
matr = new edd_Matrics();
matr.full_matr();
players = [
new edd_Player(name1,randomInteger(0, 4),randomInteger(5, 9)),
new edd_Player(name2,randomInteger(5, 9),randomInteger(0, 4))
];
console.log(players[0].color_body+" "+ players[0].color_way);
console.log(players[1].color_body+" "+ players[1].color_way);
game_on = true;
};

function update(){

	
		
for (var i = 0; i < players.length; i++) {
	players[i].move(matr);
	players[i].eate(matr);
};
		

		setTimeout(update, 50);
	

	};

function render(){
	matr.draw_matr();
	for (var i = 0; i < players.length; i++) {
	players[i].draw(matr);
	print_capacity();
}};
	

	


function game(){
if(game_on == true){
render();
players_hant(players);}
else{
print(players[0].name +" win",350);
print("Press SPACE to restart",650);

}
requestAnimationFrame(game) ;
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




var name1 = prompt("Enter your name","Player1");
var name2 = prompt("Enter your name","Player2");
var matr = new edd_Matrics();
var players= [];
start_game();

game();
update();


