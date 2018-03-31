var bird;
var pipes = [];
var score = 0;
var scoreIncrement = 1;
var hitIncrement = 1;
var newPipeRate = 40;
let scoreFontSize = 50;
let titleFontSize = 15;
var jumpShowRate = 18;
let birdFlyUpImage;
let birdFlyDownImage;
let birdDieImage;
let marioFont;

let bgHex = "#FED933"; // Laurier: "#EDC400";
let hitHex = "#371C79";

function preload() {
  marioFont = loadFont('fonts/SuperMario256.ttf')
  birdFlyUpImage = loadImage('img/fly.png');
  birdFlyDownImage = loadImage('img/flyDown.png');
  birdDieImage = loadImage('img/die.png');
}

function setup() {
  createCanvas(400, 600);
  bird = new Bird();
  pipes.push(new Pipe());
  // birdFlyUpImage.resize(0,100);
  // birdFlyDownImage.resize(0,100);
  // birdDieImage.resize(0,100);
}

function printCopyright() {
  fill("black");
  textFont('Arial', 10);
  text("By BP",0.9*width, 0.98*height);
}


function printScore() {
  fill(255,0,0);
  textFont(marioFont, scoreFontSize);
  text(score,0.5*width, 0.95*height);
}

function printTitle() {
  fill(255,0,0);
  textFont(marioFont, titleFontSize);
  text('Flappy\nGoose',0.05*width, 0.05*height);
}

function draw() {
  background(bgHex);
  printScore();
  printTitle();
  printCopyright();

  for(var i = pipes.length -1; i >= 0; i--) {
    if(frameCount % newPipeRate === 0 && pipes[i].isPassedBy(bird) && !pipes[i].wasHit) {
      score += scoreIncrement;
    } else if(frameCount % newPipeRate === 0 && pipes[i].isPassedBy(bird) && pipes[i].wasHit) {
      score -= hitIncrement;
    }

    pipes[i].show();
    pipes[i].update();

    if(pipes[i].hits(bird)){}

    if(pipes[i].isOffScreen()) {
      pipes.splice(i, 1);
    }
  }

  if(frameCount % newPipeRate === 0) {
    pipes.push(new Pipe());
  }
  bird.show();
  bird.update();
}

function Pipe() {

  var spacing = random(2*bird.height, height/2);
  var spacingCentre = random(spacing, height-spacing);

  this.top = spacingCentre - spacing/2;
  this.bottom = height - (spacingCentre + spacing/2);
  this.x = width;
  this.pipeWidth = 35;
  this.speed = 5;
  this.isHit = false;
  this.wasHit = false;

  this.show = function() {
    fill(0,0,0);
    if(this.isHit) {
      fill(hitHex);
    }
    rect(this.x, 0, this.pipeWidth, this.top);
    rect(this.x, height-this.bottom, this.pipeWidth, this.bottom);
  }

  this.update = function() {
    this.x -= this.speed;
  }

  this.isOffScreen = function() {
    return this.x < - this.pipeWidth;
  }

  this.hits = function(bird) {
    if((bird.x + bird.width/2 > this.x && bird.x < this.x + this.pipeWidth + bird.width/2)
    && (bird.y < this.top + bird.height/2 || bird.y + bird.height/2 > height - this.bottom)) {
      this.wasHit = true;
      bird.image = birdDieImage;
      bird.isDead = true;
      return this.isHit = true;
    }
    bird.isDead = false;
    return this.isHit = false;
  }

  this.isPassedBy = function(bird) {
    return this.x < bird.x + bird.width/2;
  }
}

function keyPressed() {
  if(key == ' ') {
    bird.jump();
  }
}

function touchStarted() {
  bird.jump();
}

function Bird() {
  this.y = height / 2;
  this.x = 64;
  this.width = 47;
  this.height = 21;
  this.image = birdFlyUpImage;

  this.velocity = 0;
  this.gravity = 0.75;
  this.upForce = -15;

  this.isDead = false;
  this.isJumping = false;

  this.update = function () {
    this.velocity += this.gravity;
    this.velocity *= 0.9;
    this.y += this.velocity;

    if(this.y > height-this.height) {
      this.y = height-this.height;
      this.velocity = 0;
    }
    if(this.y < 0) {
      this.y = 0;
      this.velocity = 0;
    }
    if(this.isDead) {
      this.image = birdDieImage;
    } else if(this.isJumping) {
      this.image = birdFlyDownImage;
      this.isJumping = false;
    } else if(!this.isDead && frameCount % jumpShowRate === 0) {
      this.image = birdFlyUpImage;
    }
  }

  this.jump = function() {
    this.isJumping = true;
    this.velocity += this.upForce;
  }

  this.show = function() {
    image(this.image, this.x, this.y);
  }
}
