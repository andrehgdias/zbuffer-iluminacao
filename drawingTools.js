import { lambertAlgorithm } from "./ilumination.js";

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

export { bresenhamLine, drawFilledRect, bresenhamCircle, drawSphere };
