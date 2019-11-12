import zBuffer from "./zbuffer.js";
import { bresenhamLine, drawFilledRect, bresenhamCircle } from "./drawingTools.js";

// Configuration of canvas
let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth * 0.95;
canvas.height = window.innerHeight * 0.8;
let context = canvas.getContext("2d");

// Starting a buffer, last param is background color
let buffer = new zBuffer(canvas.width, canvas.height, context, "#000");
buffer.describe(true);

bresenhamCircle(buffer, context, 50, 80, 50, 15, "#fff");
drawFilledRect(buffer, context, 100, 100, 20, 20, 20, "blue");
bresenhamLine(buffer, context, 80, 10, 80, 200, 30, "red");