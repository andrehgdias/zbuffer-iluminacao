// import zBuffer from "./zbuffer.js";
// import {
//   bresenhamLine,
//   drawFilledRect,
//   bresenhamCircle,
//   drawSphere
// } from "./drawingTools.js";

// ================================================================================
function lambertAlgorithm(coordPoint, coordCenter, ia, ka, il, kd) {
  const prodEscalar = (a, b) => {
      // console.log("a,b", a,b);
      let result = a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
      // console.log("result escalar: ", result);
      return result;
  }

let normalSuperficie = [coordPoint.x-coordCenter.xc, coordPoint.y-coordCenter.yc, coordPoint.z]; 
let normalIntensidade = [950-coordPoint.x,100-coordPoint.y,-100-coordPoint.z];

let normaSup = Math.sqrt(Math.pow(coordPoint.x, 2) + Math.pow(coordPoint.y, 2) + Math.pow(coordPoint.z, 2));
let normaInt = Math.sqrt(Math.pow(coordCenter.xc, 2) + Math.pow(coordCenter.yc, 2));
//   console.log("normaSup", normaSup);
//   console.log("normaInt",normaInt);


let cosAngle = prodEscalar(normalIntensidade, normalSuperficie) / (normaInt*normaSup);
//   console.log("cosAngle", cosAngle);
let intensity = ia * ka + il * kd * cosAngle;

//   console.log("Intensity: ", intensity);
return intensity;
}
// ================================================================================
function bresenhamLine(buffer, context, x0, y0, x1, y1, z, innerColor) {
  var dx = Math.abs(x1 - x0);
  var dy = Math.abs(y1 - y0);
  var sx = x0 < x1 ? 1 : -1;
  var sy = y0 < y1 ? 1 : -1;
  var err = dx - dy;
  context.fillStyle = innerColor;

  while (true) {
    buffer.addPixel(context, x0, y0, z, innerColor);
    if (x0 === x1 && y0 === y1) break;
    var e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }
  }
}

function drawFilledRect(
  buffer,
  context,
  sizeX,
  sizeY,
  posX,
  posY,
  z,
  innerColor
) {
  let height = posY + sizeY;
  let width = posX + sizeX;
  for (posX; posX < width; posX++) {
    bresenhamLine(buffer, context, posX, posY, posX, height, z, innerColor);
  }
}

function bresenhamCircle(buffer, context, xc, yc, r, z, innerColor) {
  const drawCircle = (buffer, context, xc, yc, x, y, z, innerColor) => {
    buffer.addPixel(context, xc + x, yc + y, z, innerColor);
    buffer.addPixel(context, xc - x, yc + y, z, innerColor);
    buffer.addPixel(context, xc + x, yc - y, z, innerColor);
    buffer.addPixel(context, xc - x, yc - y, z, innerColor);

    buffer.addPixel(context, xc + y, yc + x, z, innerColor);
    buffer.addPixel(context, xc - y, yc + x, z, innerColor);
    buffer.addPixel(context, xc + y, yc - x, z, innerColor);
    buffer.addPixel(context, xc - y, yc - x, z, innerColor);
  };

  let x = 0,
    y = r;
  let d = 3 - 2 * r;
  drawCircle(buffer, context, xc, yc, x, y, z, innerColor);
  while (y >= x) {
    // for each pixel we will draw all eight pixels
    x++;
    // check for decision parameter and correspondingly update d, x, y
    if (d > 0) {
      y--;
      d = d + 4 * (x - y) + 10;
    } else d = d + 4 * x + 6;
    drawCircle(buffer, context, xc, yc, x, y, z, innerColor);
  }
}

function drawSphere(buffer, context, xc, yc, r, innerColor) {
  const genSphereCoords = (xc, yc, r) => {
    let coords = [];
    let inc = 0.01; // 0.01

    for (let i = -Math.PI / 2; i <= Math.PI / 2; i += inc) {
      let z = r * Math.sin(i);
      for (let j = -Math.PI; j <= Math.PI; j += inc) {
        let x = r * Math.cos(i) * Math.cos(j) + xc;
        let y = r * Math.cos(i) * Math.sin(j) + yc;
        coords.push({ x: parseInt(x), y: parseInt(y), z: parseInt(z) });
      }
    }

    return coords;
  };

  const calcColor = (rgbObj, coordSup, coordCenter) => {
    //Parametros = (coordSup, coordCenter, ia, ka, il, kd)
    let intensity = lambertAlgorithm(coordSup, coordCenter, 0.6, 0.8, 1, 0.3);
    // console.log(intensity);
    // if (intensity < 1) {
      let obj = { r: 0, g: 0, b: 0 };
      obj.r = rgbObj.r * intensity;
      obj.g = rgbObj.g * intensity;
      obj.b = rgbObj.b * intensity;
      return obj;
    // } else return rgbObj;
  };

  let sphereCoords = genSphereCoords(xc, yc, r);

  // let color = calcColor(innerColor, sphereCoords[0], { xc, yc });
  // console.log("Color: ", color)
  for (let i = 0; i < sphereCoords.length; i++) {
    let coords = sphereCoords[i];
    let color = calcColor(innerColor, coords, {xc, yc});
    // console.warn("Color: ", color);
    buffer.addPixel(context, coords.x, coords.y, coords.z, color);
  }
}
// ================================================================================
if (!Number.MAX_SAFE_INTEGER) {
  Number.MAX_SAFE_INTEGER = 9007199254740991; // Math.pow(2, 53) - 1;
}

class zBuffer {
  constructor(width, height, context, background) {
    this.x = parseInt(width);
    this.y = parseInt(height);
    this.data = new Array(this.x);
    this.init(context, background);
  }

  init(context, background, initializing = true) {
    initializing ? console.warn("Initializing zBuffer") : false;
    for (let i = 0; i < this.data.length; i++) {
      let arrayX = new Array(this.y);

      for (let j = 0; j < arrayX.length; j++) {
        let obj = { z: Number.MAX_SAFE_INTEGER, color: background };
        arrayX[j] = obj;
      }

      this.data[i] = arrayX;
    }
    initializing ? console.info("zBuffer initialized: ", this.data) : false;
    this.flush(context);
  }

  clear() {
    this.init(false);
  }

  describe(showData = false) {
    console.warn("Describing defined zBuffer");
    console.log("X size: ", this.x);
    console.log("Y size: ", this.y);
    showData ? console.log("Stored values on buffer: ", this.data) : false;
  }

  addPixel(context, x, y, z, color) {
    if (z < this.data[x][y].z) {
      this.data[x][y] = {
        z,
        color
      };
      context.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
      context.fillRect(x, y, 1, 1);
    }
  }

  flush(context) {
    for (let x = 0; x < this.data.length; x++) {
      for (let y = 0; y < this.data[x].length; y++) {
        context.fillStyle = this.data[x][y].color;
        context.fillRect(x, y, 1, 1);
      }
    }
  }
}
// ================================================================================
// Configuration of canvas
let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth * 0.7;
canvas.height = window.innerHeight * 0.6;
let context = canvas.getContext("2d");

// Starting a buffer, last param is background color
let buffer = new zBuffer(canvas.width, canvas.height, context, "#ccc");
buffer.describe(true);

// bresenhamCircle(buffer, context, 50, 80, 50, 15, "#fff");
let magenta = { r: 202, g: 31, b: 123 };
drawFilledRect(buffer, context, 100, 100, 100, 100, 100, "blue");
// bresenhamLine(buffer, context, 80, 10, 80, 200, 30, "red");

drawSphere(buffer, context, 100, 100, 50, magenta);
