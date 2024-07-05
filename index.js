const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d'); //contexto de renderizado 2d
const $sprite = document.querySelector('#sprite');
const $bricks = document.querySelector('#bricks');

canvas.width = 448;
canvas.height = 400;

// variables del juego
let cont = 0;

// VARIABLES DE LA PELOTA
const radioPelota = 4;
let posicionXPelota = canvas.width / 2; //posicion de la pelota eje x
let posicionYPelota = canvas.height - 30; //posicion de la pelota eje y
let ejeHPelota = -2;  // velocidad pelota eje horizontal dx
let ejeVPelota = -2;// velocidad pelota eje vertical dy

// VARIABLES DE LA BARRA
const altoBarra = 10; //alto de la barra
const anchoBarra = 50; //ancho de la barra

let poscAnchoBarra = (canvas.width - anchoBarra) / 2 //posicion de la barra en eje x del centro del juego (estado inicial) 
const poscAltoBarra = canvas.height - altoBarra - 10 //posicion de la barra en eje y

let pulsarDerecha = false;
let pulsarIzquierda = false;

const sensibilidadBarra = 8;

//VARIABLES DE LOS LADRILLOS
const filasLadrillos = 6; //brickRowCount
const columnasLadrillos = 13; //brickColumnCount
const anchoLadrillo = 32; //brickWidth
const altoLadrillo = 16; //brickHeight
const separacionLadrillos = 0; //brickPadding
const inicioLadrillos = 80; //brickOffSetTop
const espacioIzqLadrillos = 16; // brickOffsetLeft
const ladrillos = [];

const statusLadrillos = {
  active: 1,
  destroyed: 0,
}

//c de columnas y r de filas
for (let c = 0; c < columnasLadrillos; c++) {
  ladrillos[c] = []; //inicia con un array vacio
  for (let r = 0; r < filasLadrillos; r++) {
    // calculo de la posicion del ladrillo en la pantalla
    const posicionLadrillosX = c * (anchoLadrillo + separacionLadrillos) + espacioIzqLadrillos
    const posicionLadrillosY = r * (altoLadrillo + separacionLadrillos) + inicioLadrillos
    //asignar un color aleatorio a cada ladrillo
    const random = Math.floor(Math.random() * 8)
    // guardamos la información de cada ladrillo
    ladrillos[c][r] = { x: posicionLadrillosX, y: posicionLadrillosY, status: statusLadrillos.active, color: random }
  }
}

//dibujar la pelota
function pelota() {
  contexto.beginPath(); //iniciar el trazado
  contexto.arc(posicionXPelota, posicionYPelota, radioPelota, 0, Math.PI * 2);
  contexto.fillStyle = '#FFFFFF';
  contexto.fill();
  contexto.closePath(); // terminar el trazado
}


function barra() {
  contexto.drawImage(
    $sprite, // imagen
    29, // clipX: coordenadas donde empieza a recortar la imagen
    174, // clipY: coordenadas donde empieza a recortar la imagen
    anchoBarra, // tamaño del recorte
    altoBarra, // tamaño del recorte
    poscAnchoBarra, // posición x de la imagen
    poscAltoBarra, // posición y de la imagen
    anchoBarra, //ancho de la imagen
    altoBarra, //alto de la imagen
  )
}

function dibujarLadrillos() {
  for (let c = 0; c < columnasLadrillos; c++) {
    for (let r = 0; r < filasLadrillos; r++) {
      const ladrilloActual = ladrillos[c][r];
      if (ladrilloActual.status === statusLadrillos.destroyed) continue;
      // contexto.fillStyle = 'yellow';
      // contexto.rect(
      //   ladrilloActual.x,
      //   ladrilloActual.y,
      //   anchoLadrillo,
      //   altoLadrillo,
      // )
      // contexto.strokeStyle = '#000'
      // contexto.stroke();
      // contexto.fill();

      const clipX = ladrilloActual.color * 32
      contexto.drawImage(
        $bricks,
        clipX,
        0,
        anchoLadrillo,
        altoLadrillo,
        ladrilloActual.x,
        ladrilloActual.y,
        anchoLadrillo,
        altoLadrillo,
      )
    }
  }
}

function colision() {
  for (let c = 0; c < columnasLadrillos; c++) {
    for (let r = 0; r < filasLadrillos; r++) {
      const ladrilloActual = ladrillos[c][r];
      if (ladrilloActual.status === statusLadrillos.destroyed) continue;

      const pelotaMismoEjeHLadrillo = posicionXPelota > ladrilloActual.x && posicionXPelota < ladrilloActual.x + anchoLadrillo;
      const pelotaMismoEjeVLadrillo = posicionYPelota > ladrilloActual.y && posicionYPelota < ladrilloActual.y + altoLadrillo;

      // Colisión pelota con ladrillo
      if (pelotaMismoEjeHLadrillo && pelotaMismoEjeVLadrillo) {
        ejeVPelota = -ejeVPelota;
        ladrilloActual.status = statusLadrillos.destroyed;
      }
    }
  }
}

function movimientoPelota() {
  // movimiento rebote de la pelota en los laterales
  if (
    posicionXPelota + ejeHPelota > canvas.width - radioPelota || //pared derecha
    posicionXPelota + ejeHPelota < radioPelota //pared izquierda
  ) {
    ejeHPelota = -ejeHPelota
  }

  // movimiento rebote superior
  if (posicionYPelota + ejeVPelota < radioPelota) {
    ejeVPelota = -ejeVPelota
  }

  //la pelota toca la barra
  const pelotaMismoEjeHBarra = posicionXPelota > poscAnchoBarra && posicionXPelota < poscAnchoBarra + anchoBarra
  const siPelotaTocaBarra = posicionYPelota + ejeVPelota > poscAltoBarra

  if (pelotaMismoEjeHBarra && siPelotaTocaBarra) { // la pelota toca la barra
    ejeVPelota = -ejeVPelota // cambiar la dirección de la pelota
  } else if (posicionYPelota + ejeVPelota > canvas.height - radioPelota) { // movimiento rebote inferior (suelo)
    console.log('Game Over');
   
    posicionXPelota = canvas.width / 2;
    posicionYPelota = canvas.height - 30;
    ejeHPelota = -2;
    ejeVPelota = -2;
    // document.location.reload() //recarga toda la pagina
  }

  // mover la pelota
  posicionXPelota += ejeHPelota;
  posicionYPelota += ejeVPelota;
}

function reiniciarJuego() {
  // Reiniciar posición y velocidad de la pelota
  posicionXPelota = canvas.width / 2;
  posicionYPelota = canvas.height - 30;
  ejeHPelota = -2;
  ejeVPelota = -2;

  // Reiniciar ladrillos
  inicializarLadrillos();
}

function movimientoBarra() {
  if (pulsarDerecha && poscAnchoBarra < canvas.width - anchoBarra) {
    poscAnchoBarra += sensibilidadBarra
  } else if (pulsarIzquierda && poscAnchoBarra > 0) {
    poscAnchoBarra -= sensibilidadBarra
  }
}

function limpiarCanvas() {
  contexto.clearRect(0, 0, canvas.width, canvas.height);
}

function iniciarEvento() {
  document.addEventListener('keydown', keyClickAbajo); // escuchar cuando el usuario oprime una tecla
  document.addEventListener('keyup', keyClickArriba); // escuchar cuando el usuario suelta una tecla

  function keyClickAbajo(event) {
    const { key } = event
    if (key === 'Right' || key === 'ArrowRight') {
      pulsarDerecha = true;
    } else if (key === 'Left' || key === 'ArrowLeft') {
      pulsarIzquierda = true;
    }
  }

  function keyClickArriba(event) {
    const { key } = event
    if (key === 'Right' || key === 'ArrowRight') {
      pulsarDerecha = false;
    } else if (key === 'Left' || key === 'ArrowLeft') {
      pulsarIzquierda = false;
    }
  }
}

function dibujar() {
  // limpiar el canvas
  limpiarCanvas()

  //elementos a dibujar
  pelota()
  barra()
  dibujarLadrillos()

  //colisiones y movimientos 
  colision()
  movimientoPelota()
  movimientoBarra()

  window.requestAnimationFrame(dibujar)
}

iniciarEvento()
dibujar()


