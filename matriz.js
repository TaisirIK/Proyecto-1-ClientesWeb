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
}

function mostrarMensaje(texto) {
  document.getElementById("mensaje").textContent = texto;
}