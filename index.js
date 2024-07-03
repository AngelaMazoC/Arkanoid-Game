const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d'); //contexto de renderizado 2d

canvas.width = 448;
canvas.height = 400;

// variables del juego
let cont = 0;


// variables de la pelota
const radioPelota = 4;
let posicionX = canvas.width / 2; //posicion de la pelota eje x
let posicionY = canvas.height - 30; //posicion de la pelota eje y
let ejeH = -2;  // velocidad pelota eje horizontal dx
let ejeV = -2;// velocidad pelota eje vertical dy


//dibujar la pelota
function pelota() {
  contexto.beginPath();
  contexto.arc(posicionX, posicionY, radioPelota, 0, Math.PI * 2);
  contexto.fillStyle = '#FFFFFF';
  contexto.fill();
  contexto.closePath();
}


function barra() {

}

function ladrillos() {

}

function colision() {

}

function movimientoPelota() {
  // movimiento rebote de la pelota en los laterales
  if (
    posicionX + ejeH > canvas.width - radioPelota || //pared derecha
    posicionX + ejeH < radioPelota //pared izquierda
  ) {
    ejeH = -ejeH
  }

  // movimiento rebote superior
  if (posicionY + ejeV < radioPelota) {
    ejeV = -ejeV
  }

  // movimiento rebote inferior
  if (posicionY + ejeV > canvas.height - radioPelota) {
    console.log('Game Over');
    posicionX = canvas.width / 2;
    posicionY = canvas.height - 30;
    ejeH = -2;
    ejeV = -2;
    // document.location.reload() //recarga toda la pagina
  }

  posicionX += ejeH;
  posicionY += ejeV;
}

function movimientoBarra() {

}

function limpiarCanvas() {
  contexto.clearRect(0, 0, canvas.width, canvas.height);
}

function dibujar() {
  // limpiar el canvas
  limpiarCanvas()

  //elementos a dibujar
  pelota()
  barra()
  ladrillos()

  //colisiones y movimientos 
  colision()
  movimientoPelota()
  movimientoBarra()

  window.requestAnimationFrame(dibujar)
}

dibujar()


