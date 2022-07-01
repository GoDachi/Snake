// Variables
let inputDir = {r : 0 , c : 0};
const foodSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const moveSound = new Audio('music/move.mp3');
const musicSound = new Audio('music/music.mp3');
let lastShowTime = 0;
let score = 0;
let maxScore = 0;
const showFrequency = 19;
const board = document.getElementById("board");
let snakeBody = [
  {r:5,c:5}
];
let food = {r:10 , c:10};

// Functions

function fpsController(time){
  window.requestAnimationFrame(fpsController);
  if((time - lastShowTime) / 1000 < 1 / showFrequency){
    return ;
  }
  lastShowTime = time;
  show_game();
}

//Show current state of snake and food
function snakeFoodPrinter(){
  //Snake State
  snakeBody.forEach((value , index) => {
    let s_body = document.createElement('div');
    s_body.style.gridRowStart = value.r;
    s_body.style.gridColumnStart = value.c;
    s_body.classList.add((index == 0 ? 'head' : 'snake-body'));
    board.appendChild(s_body);
  });
  //Food State
  let f = document.createElement('div');
  f.style.gridRowStart = food.r;
  f.style.gridColumnStart = food.c;
  f.classList.add('food');
  board.appendChild(f);
}

//Moves the Snake
function snakeMover(){
  for(let i = snakeBody.length - 2;i >= 0;--i){
    //Creating a shallow copy of snakeBody[i]
    snakeBody[i + 1] = {...snakeBody[i]};
  }
  snakeBody[0].r += inputDir.r;
  snakeBody[0].c += inputDir.c;
}

//Generates random number x : lower <= x <= upper
function rangeRandom(lower , upper){
  let ans = lower + Math.floor(Math.random() * (upper - lower + 1));
  return ans;
}

//When Snake eats food
function onEating(){
  foodSound.play();
  //Generate a new Position for food
  food.r = rangeRandom(2 , 16);
  food.c = rangeRandom(2 , 16);
  //Increase Score
  score++;
  maxScore = JSON.parse(localStorage.getItem('mS') == null ? '0' : localStorage.getItem('mS'));
  maxScore = Math.max(score , maxScore);
  localStorage.setItem('mS' , JSON.stringify(maxScore));
  //Increase the length of the Snake
  snakeBody.unshift({r:snakeBody[0].r + inputDir.r , c:snakeBody[0].c + inputDir.c});
}

//Snake collides with itself(Game Over)
function gameOver(){
  let over = false;
  //Checks if Snake collides with itself or not
  for(let i = 1;i < snakeBody.length;++i){
    if(snakeBody[0].r == snakeBody[i].r && snakeBody[0].c == snakeBody[i].c){
      over = true;
      break ;
    }
    //Note - CSS grids have 1 based indexing
    //If snake collides with walls => Game Over
  }
  if(snakeBody[0].r == 1 || snakeBody[0].r == 18){
    over = true;
  }
  if(snakeBody[0].c == 1 || snakeBody[0].c == 18){
    over = true;
  }
  //if it doesn't just return
  if(over == false){
    return ;
  }
  //else game is over
  gameOverSound.play();
  alert(`Game Over
    Your Score : ${score}
    Press "Ok" to play again
    `);
    inputDir = {r:0 , c: 0};
    snakeBody = [{r:5 , c:5}];
    food = {r:10 , c:10};
    score = 0;
}

function showScore(){
  document.getElementById('score').innerHTML = `Score: ${score}`;
  const show_mS = JSON.parse(localStorage.getItem('mS') == null ? '0' : localStorage.getItem('mS'));
  document.getElementById('max-score').innerHTML = `Maximum Score: ${show_mS}`;
}

//Logic
//Runs after showFrequency and repaints the site
function show_game(){
  //Snake collides with itself(Game Over)
  gameOver();
  //When Snake eats food
  if(snakeBody[0].r === food.r && snakeBody[0].c === food.c){
    onEating();
  }
  //Move the Snake
  snakeMover();
  //Clear data of the previous State
  board.innerHTML = "";
  //Show current state of snake and food
  snakeFoodPrinter();
  //Show Score
  showScore();
}

//Controlling fps
window.requestAnimationFrame(fpsController);

window.addEventListener('keydown' , e => {
  moveSound.play();
  switch(e.key){
    case 'ArrowUp':
      if(inputDir.r == 1 && inputDir.c == 0){break ;}
      inputDir = {r:-1 , c:0};
      break;

    case 'ArrowDown':
      if(inputDir.r == -1 && inputDir.c == 0){break ;}
      inputDir = {r:1 , c:0};
      break;

    case 'ArrowLeft':
      if(inputDir.r == 0 && inputDir.c == 1){break ;}
      inputDir = {r:0 , c:-1};
      break;

    case 'ArrowRight':
      if(inputDir.r == 0 && inputDir.c == -1){break ;}
      inputDir = {r:0 , c:1};
      break;
  }
});
