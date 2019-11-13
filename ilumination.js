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

export { lambertAlgorithm };
