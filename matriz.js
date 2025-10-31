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


function llenarAleatorio() {
  const raw = document.getElementById("size").value;
  const size = parseInt(raw, 10);
  if (isNaN(size) || size < 2 || size > 10) { mostrarMensaje("Tamaño entre 2 y 10."); return; }
  crearGrid("matrizA", size);
  crearGrid("matrizB", size);
  const rand = () => Math.floor(Math.random() * 21) - 10;
  document.querySelectorAll("#matrizA input").forEach((inp, i) => inp.value = rand());
  document.querySelectorAll("#matrizB input").forEach((inp, i) => inp.value = rand());
  mostrarMensaje("");
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
  if (!container) throw new Error(`Contenedor ${id} no existe`);
  const inputs = container.querySelectorAll("input");
  if (inputs.length < size * size) throw new Error(`La matriz ${id} no está generada o tiene tamaño incorrecto`);
  const matriz = [];
  for (let i = 0; i < size; i++) {
    const fila = [];
    for (let j = 0; j < size; j++) {
      const index = i * size + j;
      const raw = inputs[index].value.trim();
      const valor = raw === "" ? 0 : parseFloat(raw);
      if (isNaN(valor)) throw new Error(`Valor no numérico en ${id} — fila ${i+1}, col ${j+1}`);
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
      case "sumar":
        resultado = sumarMatrices(A, B);
        break;
      case "restar":
        resultado = restarMatrices(A, B);
        break;
      case "multiplicar":
        resultado = multiplicarMatrices(A, B);
        break;
      case "escalar":
        const k = parseFloat(prompt("Ingrese el escalar:"));
        if (isNaN(k)) throw new Error("Escalar inválido.");
        resultado = escalarMatriz(k, A);
        break;
      case "transponer":
        const AT = transponerMatriz(A);
        resultado = [];
        for (let i = 0; i < size; i++) {
          resultado.push(A[i].concat(["|"]).concat(AT[i]));
        }
        break;
      case "determinante":
        const det = determinante(A);
        resultado = [[Number(det.toFixed(4))]];
        break;
      case "inversa":
        const inv = inversa(A);
        resultado = inv;
        try {
          const prod = multiplicarMatricesRect(A, inv);
          const ok = esIdentidadCasi(prod);
          mostrarMensaje(ok ? "Verificación: A × A⁻¹ ≈ I (OK)" : "Verificación: A × A⁻¹ ≠ I");
        } catch (e) {
        }
        break;
      default:
        throw new Error("Operación desconocida.");
    }

    mostrarResultado(resultado, tipo);
  } catch (error) {
    mostrarMensaje("Error: " + error.message);
    document.getElementById("resultado").innerHTML = "";
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

function determinante(matriz) {
  if (!Array.isArray(matriz) || matriz.length === 0) {
    throw new Error("Matriz inválida");
  }
  const n = matriz.length;
  const A = matriz.map(row => row.slice());
  const EPS = 1e-12;
  let detSign = 1;
  let det = 1;

  for (let i = 0; i < n; i++) {
    let maxRow = i;
    let maxVal = Math.abs(A[i][i]);
    for (let r = i + 1; r < n; r++) {
      const val = Math.abs(A[r][i]);
      if (val > maxVal) {
        maxVal = val;
        maxRow = r;
      }
    }

    if (maxVal < EPS) return 0;

    if (maxRow !== i) {
      const tmp = A[i];
      A[i] = A[maxRow];
      A[maxRow] = tmp;
      detSign = -detSign;
    }

    const pivot = A[i][i];
    det *= pivot;

    for (let r = i + 1; r < n; r++) {
      const factor = A[r][i] / pivot;
      if (Math.abs(factor) < EPS) continue;
      for (let c = i; c < n; c++) {
        A[r][c] -= factor * A[i][c];
      }
    }
  }

  return detSign * det;
}

function inversa(matriz) {
  if (!Array.isArray(matriz) || matriz.length === 0) {
    throw new Error("Matriz inválida");
  }
  const n = matriz.length;
  const M = matriz.map((row, i) => {
    const left = row.slice();
    const right = new Array(n).fill(0);
    right[i] = 1;
    return left.concat(right);
  });

  const EPS = 1e-12;

  for (let i = 0; i < n; i++) {
    let maxRow = i;
    let maxVal = Math.abs(M[i][i]);
    for (let r = i + 1; r < n; r++) {
      const val = Math.abs(M[r][i]);
      if (val > maxVal) {
        maxVal = val;
        maxRow = r;
      }
    }

    if (maxVal < EPS) {
      throw new Error("La matriz no tiene inversa");
    }

    if (maxRow !== i) {
      const tmp = M[i];
      M[i] = M[maxRow];
      M[maxRow] = tmp;
    }

    const pivot = M[i][i];
    for (let col = 0; col < 2 * n; col++) {
      M[i][col] = M[i][col] / pivot;
    }

    for (let r = 0; r < n; r++) {
      if (r === i) continue;
      const factor = M[r][i];
      if (Math.abs(factor) < EPS) continue;
      for (let col = 0; col < 2 * n; col++) {
        M[r][col] -= factor * M[i][col];
      }
    }
  }

  const inv = M.map(row => row.slice(n).map(v => {
    const rounded = Math.abs(v) < EPS ? 0 : Number(v.toPrecision(12));
    return rounded;
  }));

  return inv;
}

function matrizidentidad() {
  const raw = document.getElementById("size").value;
  const size = parseInt(raw, 10);
  if (isNaN(size) || size < 2 || size > 10) {
    mostrarMensaje("El tamaño debe ser un número entre 2 y 10.");
    return;
  }

  const cont = document.getElementById("matrizA");
  if (!cont) {
    mostrarMensaje("Contenedor de la matriz A no encontrado.");
    return;
  }

  if (cont.querySelectorAll("input").length !== size * size) {
    crearGrid("matrizA", size);
  }

  const inputs = cont.querySelectorAll("input");
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const idx = i * size + j;
      inputs[idx].value = (i === j) ? 1 : 0;
    }
  }

  mostrarMensaje("");
}