// Definir o tipo de canvas, jogo 2D - Snake Run 2
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

// Definindo a visualização do score, exibir play
const score = document.querySelector(".score--value");
const finalScore = document.querySelector(".final-score > span");
const menu = document.querySelector(".menu-screen");
const buttonPlay = document.querySelector(".btn-play");

// Definindo o tamanho da Snake
const size = 30;

// Criando a Snake por array, sendo preenchido e movimentado na tela
const initialPosition = { x: 270, y: 240 };
let snake = [initialPosition];

// Criar a pontuação das apples em dez em dez pontos
const incrementScore = () => {
  score.innerText = +score.innerText + 10;
};

// Criar uma posição aleatória da Apple
const randomNumber = (min, max) => {
  return Math.round(Math.random() * (max - min) + min);
};

// Definir uma posição da Apple dentro do canvas
const randomPosition = () => {
  const number = randomNumber(0, canvas.width - size);
  return Math.round(number / 30) * 30;
};

const randomColor = () => {
  const red = randomNumber(0, 255);
  const green = randomNumber(0, 255);
  const blue = randomNumber(0, 255);
  return `rgb(${red}, ${green}, ${blue})`;
};

// Criando a const para a Apple, sempre laranja
const food = {
  x: randomPosition(),
  y: randomPosition(),
  color: randomColor(),
};

let direction, loopId;
let gameOverFlag = false; // Flag para indicar que o jogo acabou

// Definir a posição inicial da Apple
const drawFood = () => {
  const { x, y, color } = food;
  ctx.shadowColor = color;
  ctx.shadowBlur = 20;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, size, size);
  ctx.shadowBlur = 0;
};

// A const desenha a Snake
const drawSnake = () => {
  ctx.fillStyle = "#66CDAA";
  snake.forEach((position, index) => {
    if (index == snake.length - 1) {
      ctx.fillStyle = "#FFA500"; // Cor da cabeça da cobra
    }
    ctx.fillRect(position.x, position.y, size, size);
  });
};

// Mover a cobra dentro da grade
const moveSnake = () => {
  if (!direction || gameOverFlag) return; // Não permite mover após a morte
  const head = snake[snake.length - 1];

  if (direction == "right") {
    snake.push({ x: head.x + size, y: head.y });
  }
  if (direction == "left") {
    snake.push({ x: head.x - size, y: head.y });
  }
  if (direction == "down") {
    snake.push({ x: head.x, y: head.y + size });
  }
  if (direction == "up") {
    snake.push({ x: head.x, y: head.y - size });
  }

  snake.shift();
};

// Criar uma exibição de Grid para o jogador visualizar a tela do jogo
const drawGrid = () => {
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#DCDCDC";
  for (let i = 30; i < canvas.width; i += 30) {
    ctx.beginPath();
    ctx.lineTo(i, 0);
    ctx.lineTo(i, 600);
    ctx.stroke();

    ctx.beginPath();
    ctx.lineTo(0, i);
    ctx.lineTo(600, i);
    ctx.stroke();
  }
};

// Criar uma verificação se a cabeça da Snake tocou a Apple
const checkEat = () => {
  const head = snake[snake.length - 1];

  if (head.x == food.x && head.y == food.y) {
    incrementScore();
    snake.push(head);

    let x = randomPosition();
    let y = randomPosition();

    while (snake.find((position) => position.x == x && position.y == y)) {
      x = randomPosition();
      y = randomPosition();
    }

    food.x = x;
    food.y = y;
    food.color = randomColor();
  }
};

// Criar uma condição para checar o limite da parede e caso a Snake toque em si mesma
const checkCollision = () => {
  const head = snake[snake.length - 1];
  const canvasLimit = canvas.width - size;
  const neckIndex = snake.length - 2;

  const wallCollision =
    head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit;

  const selfCollision = snake.find((position, index) => {
    return index < neckIndex && position.x == head.x && position.y == head.y;
  });

  if (wallCollision || selfCollision) {
    gameOver();
  }
};

// Função para game over
const gameOver = () => {
  direction = undefined;
  gameOverFlag = true; // Definir que o jogo acabou
  menu.style.display = "flex";
  finalScore.innerText = score.innerText;
  canvas.style.filter = "blur(2px)"; // Adiciona o efeito de desfoque
};

// Função principal que chama os outros métodos
const gameLoop = () => {
  if (gameOverFlag) return; // Se o jogo acabou, não faz nada
  ctx.clearRect(0, 0, 600, 600); // Limpa o canvas
  drawGrid(); // Desenha a grid
  drawFood(); // Desenha a comida
  moveSnake(); // Move a cobra
  drawSnake(); // Desenha a cobra
  checkEat(); // Verifica se a cobra comeu a comida
  checkCollision(); // Verifica se houve colisão
  loopId = setTimeout(() => {
    gameLoop(); // Continua o loop do jogo
  }, 300);
};

// Criando a direção da Snake usando o teclado
document.addEventListener("keydown", ({ key }) => {
  if (key == "ArrowRight" && direction != "left" && !gameOverFlag) {
    direction = "right";
  }

  if (key == "ArrowLeft" && direction != "right" && !gameOverFlag) {
    direction = "left";
  }

  if (key == "ArrowDown" && direction != "up" && !gameOverFlag) {
    direction = "down";
  }

  if (key == "ArrowUp" && direction != "down" && !gameOverFlag) {
    direction = "up";
  }
});

// Reiniciar o jogo
buttonPlay.addEventListener("click", () => {
  gameOverFlag = false; // Reseta o estado do jogo
  snake = [initialPosition]; // Reseta a posição da cobra
  score.innerText = "00"; // Reseta a pontuação
  menu.style.display = "none"; // Esconde a tela de Game Over
  canvas.style.filter = "none"; // Remove o desfoque
  gameLoop(); // Reinicia o jogo
});

// Inicia o loop do jogo
gameLoop();
