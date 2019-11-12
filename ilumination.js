function lambertAlgorithm(ia, ka, kd) {
  let il = [100, 0, 100];
  let cosAngle = "Inserir aqui função para calcular o cosseno do angulo entre dois vetores";
  let intensity = ia * ka + il * kd * cosAngle;

  console.log("Intensity: ", intensity);
}

export { lambertAlgorithm };
