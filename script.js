let apuntes = JSON.parse(localStorage.getItem("apuntes")) || [];

function guardarApunte() {
  const materia = document.getElementById("materia").value.trim();
  const tema = document.getElementById("tema").value.trim();
  const contenido = document.getElementById("contenido").value.trim();
  const imagenInput = document.getElementById("imagen");
  const archivo = imagenInput.files[0];

  if (!materia || !tema || !contenido) return alert("Por favor completa todos los campos");

  const lector = new FileReader();
  lector.onloadend = function () {
    const apunte = {
      id: Date.now(),
      materia,
      tema,
      contenido,
      imagen: lector.result || ""
    };
    apuntes.push(apunte);
    localStorage.setItem("apuntes", JSON.stringify(apuntes));
    mostrarApuntes();
    limpiarFormulario();
  };

  if (archivo) {
    lector.readAsDataURL(archivo);
  } else {
    lector.onloadend(); // llama igual si no hay imagen
  }
}

function mostrarApuntes(filtro = "") {
  const contenedor = document.getElementById("lista-apuntes");
  contenedor.innerHTML = "";

  apuntes
    .filter(a => a.materia.toLowerCase().includes(filtro) || a.tema.toLowerCase().includes(filtro))
    .forEach(apunte => {
      const div = document.createElement("div");
      div.className = "apunte";
      div.innerHTML = `
        <h3>${apunte.materia} - ${apunte.tema}</h3>
        <p>${apunte.contenido}</p>
        ${apunte.imagen ? `<img src="${apunte.imagen}">` : ""}
        <button class="borrar-btn" onclick="eliminarApunte(${apunte.id})">🗑 Borrar</button>
        <button class="editar-btn" onclick="editarApunte(${apunte.id})">✏️ Editar</button>
      `;
      contenedor.appendChild(div);
    });
}

function eliminarApunte(id) {
  apuntes = apuntes.filter(a => a.id !== id);
  localStorage.setItem("apuntes", JSON.stringify(apuntes));
  mostrarApuntes();
}

function editarApunte(id) {
  const apunte = apuntes.find(a => a.id === id);
  if (!apunte) return;
  document.getElementById("materia").value = apunte.materia;
  document.getElementById("tema").value = apunte.tema;
  document.getElementById("contenido").value = apunte.contenido;
  eliminarApunte(id);
}

function limpiarFormulario() {
  document.getElementById("materia").value = "";
  document.getElementById("tema").value = "";
  document.getElementById("contenido").value = "";
  document.getElementById("imagen").value = "";
}

document.getElementById("buscador").addEventListener("input", (e) => {
  mostrarApuntes(e.target.value.toLowerCase());
});

mostrarApuntes();
