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
  for (posX; posX < sizeX; posX++) {
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

export { bresenhamLine, drawFilledRect, bresenhamCircle };