const WIDTH = 1080
const HEIGHT = 720
var showP1Menu = true;
var showP2Menu = false;
var seconds = 0
var minutes = 0
var velocidadInicialX = 9
var velocidadInicialY = 4
var velocidadMaximaX = 29
var contadorPowerUpP1 = 10
var contadorPowerUpP2 = 10
var tamañoIndicadorP1 = 0
var tamañoIndicadorP2 = 0
var setPause = false
const powerUpIndicatorP1 = document.querySelector(".powerUpIndicatorP1")
const powerUpIndicatorP2 = document.querySelector(".powerUpIndicatorP2")

let P1,P2

 P1 = {
  x: 30,
  y: HEIGHT / 2 - 50,
  velocidad: 20,
  Width: 18,
  Height: 100,
  raqueta: null,
  toques: 0,
  powerUp: false,
  puntos: 0,
  hasWon: null,
  controlArriba: 87,
  controlAbajo: 83,
  teclas : {
    arriba: 87,
    abajo: 83,
  },
  rival: P2,
}
 P2 = {
  x: WIDTH - 50,
  y: HEIGHT / 2 - 50,
  velocidad: 20,
  Width: 18,
  Height: 100,
  raqueta: null,
  toques: 0,
  powerUp: false,
  puntos: 0,
  hasWon: null,
  controlArriba: 38,
  controlAbajo: 40,
  teclas : {
    arriba: 38,
    abajo: 40,
  },
  rival: P1,
}
P1.rival = P2
const velocidadesPorMinuto = {
  0: 9,
  1:13,
  2:17,
  3:21,
  4:25,
}
const toquesPorColorPowerUp = {
  "red": 15,
  "blue": 10,
  "green":10,
  "yellow": 15,
}

class Pelota {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.velocidadX = velocidadInicialX;
    this.velocidadY = velocidadInicialY;
  }

  movimiento() {
    this.x = this.x + this.velocidadX;
    this.y = this.y + this.velocidadY;
  }

  forma() {
    fill("#d3d3d3");
    ellipse(this.x, this.y, 20, 20);
  }

  reiniciar() {
    this.x = width / 2;
    this.y = height / 2;
      this.velocidadX = 0
      this.velocidadY = 0
    setTimeout(() => {
      this.velocidadX = velocidadInicialX
      this.velocidadY = velocidadInicialY
      this.velocidadX = this.velocidadX * ((Math.random() < 0.5) ? 1 : -1);
      this.velocidadY = this.velocidadY * ((Math.random() < 0.5) ? 1 : -1);
    }, 1000);
  }
  detener(){
    this.x = width / 2;
    this.y = height / 2;
      this.velocidadX = 0
      this.velocidadY = 0
  }

  colision() {
    if (this.y < 0 || this.y > height) {
      this.velocidadY *= -1;
    }
    if (this.x > width) {
      this.reiniciar()
      P1.puntos++;
      P2.toques = 0
      P2.powerUp = false
    }
    if (this.x < 0) {
      this.reiniciar()
      P2.puntos++;
      P1.toques = 0
      P1.powerUp = false
    }
  }
}

let pelota

function setup() {
  canvas = createCanvas(1080, 720);
  background("#000");
  pelota = new Pelota(width / 2, height / 2);
}


function draw() {
  background("#000");
  for (var i = 0; i <= 720; i += 36) {
    fill("#d3d3d3");
    rect(width / 2 - 9, i + 9, 18, 18);
  }
  textSize(70)
  text(P1.puntos, width / 2 - 100, 80);
  text(P2.puntos, width / 2 + 100, 80);

  if(!P1.hasWon && !P2.hasWon){
    document.querySelector(".contenedorIndicadores").style.opacity = 1
    if (!showP1Menu && !showP2Menu) {
      pelota.colision()
      pelota.movimiento()
      pelota.forma()
      if(frameCount % 60 === 0){
          updateClock()
      }
    }
  
    MovePlayer(P1);
    MovePlayer(P2);
    checkCollisions(P1);
    checkCollisions(P2);
    drawPowerUpsIndicador()
    checkPowerUps(P1)
    checkPowerUps(P2)
    if(frameCount % 60 === 0){
      countDownPowerUp()
    }
  }else{
    document.querySelector(".contenedorIndicadores").style.opacity = 0
    menuWinner()
  }
  if(showP1Menu || showP2Menu){
    document.querySelector(".contenedorIndicadores").style.opacity = 0
  }else{
    document.querySelector(".contenedorIndicadores").style.opacity = 1

  }


  checkWinner()
  


  if (showP1Menu) drawMenuP1();
  if (showP2Menu) drawMenuP2();

  if(setPause){
    textSize(50)
    fill("#0008")
    rect(0,0,width,height)
    fill("d3d3d3")
    triangle(width/2 - 37.5, height/2 + 50, width/2-37.5 ,height/2-50,width/2 + 50, height/2)
  }

}

function MovePlayer(jugador) {
  fill(!jugador.raqueta ? "#d3d3d3" : jugador.raqueta);
  rect(jugador.x, jugador.y, jugador.Width, jugador.Height);
  fill("#d3d3d3");
  if (keyIsDown(jugador.controlArriba)) {
    jugador.y -= jugador.velocidad;
  } else if (keyIsDown(jugador.controlAbajo)) {
    jugador.y += jugador.velocidad;
  }

}

function checkCollisions(raqueta) {
  P1.y = constrain(P1.y, 0, height - P1.Height);
  P2.y = constrain(P2.y, 0, height - P2.Height);


  if (pelota.x + 10 > raqueta.x && pelota.x - 10 < raqueta.x + raqueta.Width && pelota.y + 10 > raqueta.y && pelota.y - 10 < raqueta.y + raqueta.Height) {
    // Calcular la posición relativa de la pelota en la raqueta
    let relativeXPosition = pelota.x - (raqueta.x);
    let relativeYPosition = pelota.y - raqueta.y;
    // Cambiar la dirección horizontal según la posición relativa en la raqueta en el eje X
    if (relativeXPosition < raqueta.Width / 2) {
      // Mitad derecha horizontal de la raqueta, la pelota va hacia la derecha
      pelota.velocidadX =Math.abs(velocidadesPorMinuto[minutes] ? velocidadesPorMinuto[minutes] : velocidadMaximaX);
    } else {
      // Mitad inferior horizontal de la raqueta, la pelota va hacia la izquierda
      pelota.velocidadX = -Math.abs(velocidadesPorMinuto[minutes] ? velocidadesPorMinuto[minutes] : velocidadMaximaX); 
    }
    // Cambiar la dirección vertical según la posición relativa en la raqueta en el eje Y
    if (relativeYPosition < raqueta.Height / 2) {
      // Mitad superior de la raqueta, la pelota va hacia arriba
      pelota.velocidadY = -Math.abs(pelota.velocidadY + Math.floor(Math.random() * 2 + 1));
    } else {
      // Mitad inferior de la raqueta, la pelota va hacia abajo
      pelota.velocidadY = Math.abs(pelota.velocidadY + Math.floor(Math.random() * 2 + 1));
    }
    // Cambiar la dirección en el eje X
    if(raqueta.toques == toquesPorColorPowerUp[raqueta.raqueta] - 1 && raqueta.raqueta == "blue"){
      pelota.velocidadX *= -3
      raqueta.powerUp = false
    }else{
      pelota.velocidadX *= -1;
    }
    raqueta.toques++
  }
}

function drawMenuP1() {
  fill("#242424");
  rect(0, 0, width, height);

  // Texto del menú
  fill("#fff");
  textSize(50);
  textAlign(CENTER, CENTER);
  text("PONG", width / 2, 100);
  text("Escoge tu raqueta jugador 1", width / 2, 200);

  textSize(20);

  //ROJO
  fill("red");
  rect(216, height / 2 - 50, 18, 100);
  fill("white");
  text("Inversion de controles", 216 + 9, height / 2 + 80)
  //AZUL
  fill("blue");
  rect(432, height / 2 - 50, 18, 100);
  fill("white");
  text("Tiro Rapido", 432 + 9, height / 2 + 80)
  //VERDE
  fill("green");
  rect(648, height / 2 - 50, 18, 100);
  fill("white");
  text("Tamaño aumentado", 648 + 9, height / 2 + 80)
  //AMARILLA
  fill("yellow");
  rect(864, height / 2 - 50, 18, 100);
  fill("white");
  text("Reducción de tamaño", 864 + 9, height / 2 + 80)

  if (P1.raqueta != null) {
    showP1Menu = false;
    showP2Menu = true;
  }

}

function drawMenuP2() {
  fill("#242424");
  rect(0, 0, width, height);

  // Texto del menú
  fill("#fff");
  textSize(50);
  textAlign(CENTER, CENTER);
  text("PONG", width / 2, 100);
  text("Escoge tu raqueta jugador 2", width / 2, 200);
  textSize(20);
  //ROJO
  fill("red");
  rect(216, height / 2 - 50, 18, 100);
  fill("white");
  text("Inversion de controles", 216 + 9, height / 2 + 80)
  //AZUL
  fill("blue");
  rect(432, height / 2 - 50, 18, 100);
  fill("white");
  text("Tiro Rapido", 432 + 9, height / 2 + 80)
  //VERDE
  fill("green");
  rect(648, height / 2 - 50, 18, 100);
  fill("white");
  text("Tamaño aumentado", 648 + 9, height / 2 + 80)
  //AMARILLA
  fill("yellow");
  rect(864, height / 2 - 50, 18, 100);
  fill("white");
  text("Reducción de tamaño", 864 + 9, height / 2 + 80)

  if (P2.raqueta != null) {
    text("Presiona enter para jugar", width / 2, 600)
  }

}

function mouseClicked() {
  if (showP1Menu) {
    if (mouseX > 216 && mouseX < 216 + 18 && mouseY > height / 2 - 50 && mouseY < height / 2 - 50 + 100) {
      P1.raqueta = "red"
    }
    if (mouseX > 432 && mouseX < 432 + 18 && mouseY > height / 2 - 50 && mouseY < height / 2 - 50 + 100) {
      P1.raqueta = "blue"
    }
    if (mouseX > 648 && mouseX < 648 + 18 && mouseY > height / 2 - 50 && mouseY < height / 2 - 50 + 100) {
      P1.raqueta = "green"
    }
    if (mouseX > 864 && mouseX < 864 + 18 && mouseY > height / 2 - 50 && mouseY < height / 2 - 50 + 100) {
      P1.raqueta = "yellow"
    }
  }
  if (showP2Menu && !showP1Menu) {
    if (mouseX > 216 && mouseX < 216 + 18 && mouseY > height / 2 - 50 && mouseY < height / 2 - 50 + 100) {
      P2.raqueta = "red"
    }
    if (mouseX > 432 && mouseX < 432 + 18 && mouseY > height / 2 - 50 && mouseY < height / 2 - 50 + 100) {
      P2.raqueta = "blue"
    }
    if (mouseX > 648 && mouseX < 648 + 18 && mouseY > height / 2 - 50 && mouseY < height / 2 - 50 + 100) {
      P2.raqueta = "green"
    }
    if (mouseX > 864 && mouseX < 864 + 18 && mouseY > height / 2 - 50 && mouseY < height / 2 - 50 + 100) {
      P2.raqueta = "yellow"
    }
  }
}

function keyPressed() {
  if ((keyCode == "13" || key == "Enter") && (P2.raqueta != null)) {
    showP2Menu = false
  }
  if(P1.raqueta && P2.raqueta && !showP2Menu && (keyCode == "27" || key == "Escape")){
    setPause = !setPause ? true : false
    if(setPause) noLoop()
    if(!setPause) loop()
  }
if(P1.hasWon || P2.hasWon && (keyCode == "82" || key == "r")){
  location.reload()
}


}

function updateClock() {
  seconds++
  if (seconds > 59) {
    minutes++;
    seconds = 0;
  }

  let clock = minutes + ":" + (seconds < 10 ? "0" + seconds : seconds);
  document.querySelector(".clockContainer").innerText = clock;
}

function checkPowerUps(jugador){
    if(jugador.raqueta == "red" && jugador.toques == toquesPorColorPowerUp[jugador.raqueta] && jugador.toques > 1){
      jugador.powerUp = true
      jugador.rival.controlArriba = jugador.rival.teclas.abajo
      jugador.rival.controlAbajo = jugador.rival.teclas.arriba
    }
    if(jugador.raqueta == "red" && !jugador.powerUp){
      jugador.rival.controlArriba = jugador.rival.teclas.arriba
      jugador.rival.controlAbajo = jugador.rival.teclas.abajo
    }
    if(jugador.raqueta == "blue" && jugador.toques == toquesPorColorPowerUp[jugador.raqueta]   && jugador.toques > 1){
      jugador.powerUp = true
    }
    if(jugador.raqueta == "green" && jugador.toques == toquesPorColorPowerUp[jugador.raqueta] && jugador.toques > 1){
      jugador.powerUp = true
      jugador.Height = 200
    }
    if(jugador.raqueta == "green" && !jugador.powerUp){
      jugador.Height = 100
    }
    if(jugador.raqueta == "yellow" && jugador.toques == toquesPorColorPowerUp[jugador.raqueta] && jugador.toques > 1){
      jugador.powerUp = true
      jugador.rival.Height = 50
    }
    if(jugador.raqueta == "yellow" && !jugador.powerUp){
      jugador.rival.Height = 100
    }
    if(jugador.powerUp){
      jugador.toques = 0
    }

}

function drawPowerUpsIndicador(){
  let tamaño = 10
if(!P1.powerUp ){
  tamañoIndicadorP1 = P1.toques / toquesPorColorPowerUp[P1.raqueta]
  // tamañoIndicadorP1 = P1.toques  * (WIDTH / 2) /  toquesPorColorPowerUp[P1.raqueta]
}
if(!P2.powerUp ){
  tamañoIndicadorP2 = P2.toques  / toquesPorColorPowerUp[P2.raqueta]
  // tamañoIndicadorP2 = P2.toques  * (WIDTH / 2) /  toquesPorColorPowerUp[P2.raqueta]
}


  powerUpIndicatorP1.style.transform =`scaleX(${tamañoIndicadorP1})`
  powerUpIndicatorP1.style.height = tamaño
  powerUpIndicatorP1.style.backgroundColor = P1.raqueta

  powerUpIndicatorP2.style.transform = `scaleX(${tamañoIndicadorP2})`
  powerUpIndicatorP2.style.height = tamaño
  powerUpIndicatorP2.style.backgroundColor = P2.raqueta


  // fill(!P1.raqueta ? "#d3d3d3" : P1.raqueta )
  // rect(0,height - tamaño, tamañoIndicadorP1, tamaño )

  // fill(!P2.raqueta ? "#d3d3d3" : P2.raqueta )
  // rect(width ,height - tamaño, -tamañoIndicadorP2, tamaño)

}

function countDownPowerUp(){
  if(P1.powerUp){
    contadorPowerUpP1--
    tamañoIndicadorP1 = contadorPowerUpP1 / 10
    //     tamañoIndicadorP1 = contadorPowerUpP1 * (WIDTH/2) / 10
  }
  if(P2.powerUp){
    contadorPowerUpP2--
    tamañoIndicadorP2 = contadorPowerUpP2 / 10
        //     tamañoIndicadorP2 = contadorPowerUpP2 * (WIDTH/2) / 10
  }
  if(contadorPowerUpP1 == 0){
    P1.powerUp = false
    contadorPowerUpP1 = 10
  }
  if(contadorPowerUpP2 == 0){
    P2.powerUp = false
    contadorPowerUpP2 = 10
  }
}

function checkWinner(){
  if(P1.puntos >=9 && P2.puntos >= 9){
    if(P1.puntos - P2.puntos == 2){
      P1.hasWon = true
    }
    if(P2.puntos - P1.puntos == 2){
      P2.hasWon = true
    }
  }
  if(P1.puntos == 10 && P2.puntos < 9){
    P1.hasWon = true
  }
  if(P2.puntos == 10 && P1.puntos < 9){
    P2.hasWon = true
  }
  if(P1.hasWon || P2.hasWon){
    pelota.detener()
    
  }

}

function menuWinner(){
  noFill();
  rect(0,0, width, height)
  fill("#fff")
  textSize(50)
  text("GANADOR", P1.hasWon ?  width/4 : (width*0.75) ,height/2)
  textSize(24)
  text('Presiona "R" para volver a jugar', P1.hasWon ?  width/4 : (width*0.75) ,height/2 + 50)
}