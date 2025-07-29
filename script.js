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
let tareas = JSON.parse(localStorage.getItem("tareas_prioridad")) || [];

function agregarTarea() {
  const titulo = document.getElementById("titulo-tarea").value.trim();
  const fecha = document.getElementById("fecha-tarea").value;
  const prioridad = document.getElementById("prioridad-tarea").value;
  const descripcion = document.getElementById("descripcion-tarea").value.trim();
  const imagenInput = document.getElementById("imagen-tarea");
  const archivo = imagenInput.files[0];

  if (!titulo || !fecha || !descripcion) {
    return alert("Completa todos los campos.");
  }

  const lector = new FileReader();
  lector.onloadend = function () {
    const tarea = {
      id: Date.now(),
      titulo,
      fecha,
      prioridad,
      descripcion,
      imagen: lector.result || "",
      completada: false
    };
    tareas.push(tarea);
    localStorage.setItem("tareas_prioridad", JSON.stringify(tareas));
    mostrarTareas();
    limpiarFormularioTarea();
  };

  if (archivo) {
    lector.readAsDataURL(archivo);
  } else {
    lector.onloadend(); // llamada sin imagen
  }
}

function mostrarTareas(filtro = "") {
  const contenedor = document.getElementById("lista-tareas");
  contenedor.innerHTML = "";

  const tareasFiltradas = tareas
    .filter(t => t.titulo.toLowerCase().includes(filtro) || t.descripcion.toLowerCase().includes(filtro))
    .sort((a, b) => {
      const prioridades = { alta: 1, media: 2, baja: 3 };
      return prioridades[a.prioridad] - prioridades[b.prioridad];
    });

  tareasFiltradas.forEach(t => {
    const div = document.createElement("div");
    div.className = `tarea ${t.prioridad} ${t.completada ? "completada" : ""}`;
    div.innerHTML = `
      <strong>${t.titulo}</strong> (${t.fecha})<br>
      <small>${t.descripcion}</small>
      ${t.imagen ? `<img src="${t.imagen}">` : ""}
      <div class="acciones">
        <button onclick="completarTarea(${t.id})">✅</button>
        <button onclick="eliminarTarea(${t.id})">🗑️</button>
      </div>
    `;
    contenedor.appendChild(div);
  });
}

function completarTarea(id) {
  const tarea = tareas.find(t => t.id === id);
  if (tarea) {
    tarea.completada = !tarea.completada;
    localStorage.setItem("tareas_prioridad", JSON.stringify(tareas));
    mostrarTareas();
  }
}

function eliminarTarea(id) {
  tareas = tareas.filter(t => t.id !== id);
  localStorage.setItem("tareas_prioridad", JSON.stringify(tareas));
  mostrarTareas();
}

function limpiarFormularioTarea() {
  document.getElementById("titulo-tarea").value = "";
  document.getElementById("fecha-tarea").value = "";
  document.getElementById("prioridad-tarea").value = "media";
  document.getElementById("descripcion-tarea").value = "";
  document.getElementById("imagen-tarea").value = "";
}

document.getElementById("buscar-tarea").addEventListener("input", (e) => {
  mostrarTareas(e.target.value.toLowerCase());
});

mostrarTareas();
