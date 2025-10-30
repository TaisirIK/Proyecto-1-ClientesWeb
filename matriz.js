function generarMatrices() {
  const size = parseInt(document.getElementById("size").value);
  if (size < 2 || size > 10) {
    mostrarMensaje("El tamaño debe estar entre 2 y 10.");
    return;
  }
  crearGrid("matrizA", size);
  crearGrid("matrizB", size);
  mostrarMensaje("");
}

function crearGrid(id, size) {
  const container = document.getElementById(id);
  container.innerHTML = "";
  container.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  for (let i = 0; i < size * size; i++) {
    const input = document.createElement("input");
    input.type = "number";
    input.step = "any";
    input.value = "";
    container.appendChild(input);
  }
}

function limpiarMatrices() {
  ["matrizA", "matrizB"].forEach(id => {
    const container = document.getElementById(id);
    const inputs = container.querySelectorAll("input");
    inputs.forEach(input => input.value = "");
  });
  document.getElementById("resultado").innerHTML = "";
}

function obtenerMatriz(id, size) {
  const container = document.getElementById(id);
  const inputs = container.querySelectorAll("input");
  const matriz = [];
  for (let i = 0; i < size; i++) {
    const fila = [];
    for (let j = 0; j < size; j++) {
      const index = i * size + j;
      const valor = parseInt(inputs[index].value) || 0;
      fila.push(valor);
    }
    matriz.push(fila);
  }
  return matriz;
}

function operar(tipo) {
  const size = parseInt(document.getElementById("size").value);
  const A = obtenerMatriz("matrizA", size);
  const B = obtenerMatriz("matrizB", size);
  let resultado;

  try {
    switch (tipo) {
      case "suma":
        resultado = sumarMatrices(A, B);
        break;
      case "resta":
        resultado = restarMatrices(A, B);
        break;
      case "multiplicacion":
        resultado = multiplicarMatrices(A, B);
        break;
      case "escalar":
        const k = parseInt(prompt("Ingrese el escalar:"));
        if (isNaN(k)) throw new Error("Escalar inválido.");
        resultado = escalarMatriz(k, A);
        break;
      case "transponer":
        resultado = transponerMatriz(A);
        break;
    }
    mostrarResultado(resultado, tipo);
  } catch (error) {
    mostrarMensaje("Error: " + error.message);
  }
}

function mostrarResultado(matriz, tipo) {
  const contenedor = document.getElementById("resultado");
  contenedor.innerHTML = "";

  const titulo = document.createElement("h3");
  titulo.textContent = `Resultado de la operación: ${tipo}`;
  contenedor.appendChild(titulo);

  if (!Array.isArray(matriz)) {
    const mensaje = document.createElement("p");
    mensaje.textContent = "No se pudo calcular el resultado.";
    contenedor.appendChild(mensaje);
    return;
  }

  const tabla = document.createElement("table");
  tabla.style.margin = "0 auto";
  matriz.forEach(fila => {
    const tr = document.createElement("tr");
    fila.forEach(valor => {
      const td = document.createElement("td");
      td.textContent = valor;
      td.style.border = "1px solid #333";
      td.style.padding = "8px";
      td.style.backgroundColor = "#d1d1f0";
      tr.appendChild(td);
    });
    tabla.appendChild(tr);
  });

  contenedor.appendChild(tabla);
}

function mostrarMensaje(texto) {
  const mensaje = document.getElementById("mensaje");
  if (texto === "") {
    mensaje.style.display = "none";
    mensaje.textContent = "";
  } else {
    mensaje.style.display = "block";
    mensaje.textContent = texto;
  }
}

function sumarMatrices(A, B) {
  const n = A.length;
  const resultado = [];
  for (let i = 0; i < n; i++) {
    const fila = [];
    for (let j = 0; j < n; j++) {
      fila.push(A[i][j] + B[i][j]);
    }
    resultado.push(fila);
  }
  return resultado;
}

function restarMatrices(A, B) {
  const n = A.length;
  const resultado = [];
  for (let i = 0; i < n; i++) {
    const fila = [];
    for (let j = 0; j < n; j++) {
      fila.push(A[i][j] - B[i][j]);
    }
    resultado.push(fila);
  }
  return resultado;
}

function multiplicarMatrices(A, B) {
  const n = A.length;
  const resultado = [];
  for (let i = 0; i < n; i++) {
    const fila = [];
    for (let j = 0; j < n; j++) {
      let suma = 0;
      for (let k = 0; k < n; k++) {
        suma += A[i][k] * B[k][j];
      }
      fila.push(suma);
    }
    resultado.push(fila);
  }
  return resultado;
}

function escalarMatriz(k, A) {
  const n = A.length;
  const resultado = [];
  for (let i = 0; i < n; i++) {
    const fila = [];
    for (let j = 0; j < n; j++) {
      fila.push(k * A[i][j]);
    }
    resultado.push(fila);
  }
  return resultado;
}

function transponerMatriz(A) {
  const n = A.length;
  const resultado = [];
  for (let i = 0; i < n; i++) {
    const fila = [];
    for (let j = 0; j < n; j++) {
      fila.push(A[j][i]);
    }
    resultado.push(fila);
  }
  return resultado;
}