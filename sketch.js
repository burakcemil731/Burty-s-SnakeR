let gitterGroe = 16; // jeder block ist 8x8 pixel
let sn;
let andereRichtung = false;
let neueRichtung;
let gameOver = true;
let bildRate;
let score =-10;
let hiscore;

function preload(){
  fasterone = loadFont('fasterone.ttf');
  snd_gameover = loadSound('gameover.wav');
  snd_eat = loadSound('eat.wav');
  img_apple = loadImage('apple.png');
  img_head_r =loadImage('head_right.png');
  img_head_l =loadImage('head_left.png');
  img_head_u =loadImage('head_up.png');
  img_head_d = loadImage('head_down.png');
  img_seg = loadImage('segment.png');
}

function setup() {
  createCanvas(512, 600);

  noStroke();
  textFont(fasterone);
  hiscore = localStorage.getItem('hiscore');
  if(hiscore==undefined){
    hiscore=0;
  }
}

function newGame(){
  bildRate = 6;
  score =-10;
  sn = new Snake();
  ap = new Apple();
  bo = new Border();
}

function draw() {
  background(220);
if(!gameOver) {
    sn.show();
    ap.show();
    bo.show();
    if(sn.head.pos[0]==ap.pos[0] && sn.head.pos[1]==ap.pos[1]){
      snd_eat.play();
      sn.eat(2);

      ap.repspawn();
    }
    if (frameCount % bildRate == 0) {
      sn.move();
      collisionDetection();
      if(andereRichtung){
        sn.head.direction = [...neueRichtung];
        andereRichtung = false;
      }
    }
    textSize(width / 8);
    text('Score: ' + score, 130, 550);
    text('High: ' + hiscore, 350, 550);
  }else gover();
}

function collisionDetection(){
    
  this.bo.recs.forEach(rec => {
    if(rec.pos[0]==sn.head.pos[0] && rec.pos[1]==sn.head.pos[1]){
      gameOver=true;
      snd_gameover.play();
  }
  });
  sn.segments.forEach(se =>{
    if(se.index !=0 && se.pos[0]==sn.head.pos[0] && se.pos[1]==sn.head.pos[1]){
      gameOver=true;
      snd_gameover.play();
    }
  });
}

function gover(){
  fill(100);
  textSize(width / 4);
  textAlign(CENTER, CENTER);
  if(score >= 0){
    text('Game Over', width/2, height/2);
    textSize(width / 8);
    textAlign(CENTER, CENTER);
    text('Score: ' + score , width/2 , height/2 + 120);
    text('Highscore: ' + hiscore , width/2 , height/2 + 180);
  }else{
    text('Burty SnakeR', width/2, height/2);
  }
  
}

class BorderRec{
  constructor(pos){
    this.pos = pos;
  }
  show(){
    fill(80);
    rect(this.pos[0] * gitterGroe, this.pos[1] * gitterGroe, gitterGroe, gitterGroe);
  }
}

class Border{
  constructor(){
    this.recs = [];
    const vertikaleReihen = width/gitterGroe;
    const horizontalReihen = width/gitterGroe;

    //top 
    for(let i =0; i < horizontalReihen; i++){
      this.recs.push(new BorderRec([i,0]));
    }

    //bot
    for(let i = 0; i < horizontalReihen; i++){
      this.recs.push(new BorderRec([i,vertikaleReihen-1]));
    }

    //re
    for(let i =1; i < vertikaleReihen-1; i++){
      this.recs.push(new BorderRec([horizontalReihen-1,i]));
    }

    //li
    for(let i =1; i < vertikaleReihen-1; i++){
      this.recs.push(new BorderRec([0,i]));
    }
  }
  show(){
    this.recs.forEach(rec => rec.show());
  }
}

function keyPressed() {
  if(gameOver){
    gameOver=false;
    newGame();
  }
  if (keyCode === LEFT_ARROW && !andereRichtung && sn.head.direction[0]!=1) {
    neueRichtung = [-1, 0];
    andereRichtung=true;
  }
  else if (keyCode === RIGHT_ARROW && !andereRichtung && sn.head.direction[0]!=-1) {
    neueRichtung = [1, 0];
    andereRichtung=true;
  }
  else if (keyCode === DOWN_ARROW && !andereRichtung && sn.head.direction[1]!=-1) {
    neueRichtung = [0, 1];
    andereRichtung=true;
  }
  else if (keyCode === UP_ARROW && !andereRichtung && sn.head.direction[1]!=1) {
    neueRichtung = [0, -1];
    andereRichtung=true;
  }

}

class Seg {
  constructor(pos, direction, index) {
    this.pos=[...pos];
    this.direction= [...direction];
    this.index = index;
  }
  show() {

      
      image(img_seg, this.pos[0] * gitterGroe, this.pos[1] * gitterGroe);
    
  }

  update(){
    this.pos = [...sn.segments[this.index-1].pos];
    this.direction = [sn.segments[this.index-1].direction];
  }
}

class Head {
  constructor(pos){
    this.pos= [...pos];
    this.direction = [1, 0];
    this.index=0;
  }
  show(){
    //right
    if(this.direction[0]==1){
      image(img_head_r,this.pos[0] * gitterGroe, this.pos[1] * gitterGroe);
    //left
    }else if(this.direction[0]==-1){
      image(img_head_l, this.pos[0] * gitterGroe, this.pos[1] * gitterGroe);
    //down
    }else if(this.direction[1]==1){
      image(img_head_d, this.pos[0] * gitterGroe, this.pos[1] * gitterGroe);
    //up
    }else if(this.direction[1]==-1){
      image(img_head_u, this.pos[0] * gitterGroe, this.pos[1] * gitterGroe);
    }
  }

  update(){
    this.pos[0] += this.direction[0];
    this.pos[1] += this.direction[1];
  }
}

class Snake {
  constructor() {
    this.segments = [];
    const horizontalZentrum = Math.floor(width/gitterGroe/2);
    const vertikalZentrum = Math.floor(width/gitterGroe/2);
    this.head = new Head([horizontalZentrum,vertikalZentrum]);
    this.segments.push(this.head);
    this.length = 1;
    this.eat(10);   
  }
  eat(count){
    for (let i = 0; i < count; i = i + 1) {
      let insertPos = [];
      insertPos[0] = this.segments[this.segments.length-1].pos[0] - this.segments[this.segments.length-1].direction[0];
      insertPos[1] = this.segments[this.segments.length-1].pos[1] - this.segments[this.segments.length-1].direction[1];
      this.segments.push(new Seg(insertPos, this.segments[this.segments.length-1].direction,this.length));
      this.length++;
    }
    score+=10;
    if(score>hiscore){
      hiscore=score;
      localStorage.setItem('hiscore', score);
    }
    if(score%50 == 0) {

      bildRate--;
    }
    
  }
  show() {
    this.segments.forEach(seg => seg.show());
  }
  move() {
    
    for(let i = this.segments.length-1; i>=0 ;i--){
      this.segments[i].update();
    }
  }
}



class Apple {
  constructor() {
    this.pos=[16,16];
    this.repspawn();
  }

  repspawn(){
    this.pos[0] = Math.floor(Math.random() *30)+1;
    this.pos[1] = Math.floor(Math.random() *30)+1;
    sn.segments.forEach(se =>{
      if(se.pos[0] == this.pos[0] && se.pos[1]==this.pos[1])
      this.repspawn();
    })
  }

  show(){

    image(img_apple, this.pos[0]*gitterGroe, this.pos[1]*gitterGroe);
  }
}