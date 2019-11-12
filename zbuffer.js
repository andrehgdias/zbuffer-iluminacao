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

  init(context,background, initializing = true) {
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
    if (z < this.data[x][y].z){
      this.data[x][y] = {
        z,
        color
      };
      context.fillStyle = color;
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
export default zBuffer;
