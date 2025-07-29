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
let notas = JSON.parse(localStorage.getItem("notas")) || [];

function guardarNota() {
  const materia = document.getElementById("materia-nota").value.trim();
  const valor = parseFloat(document.getElementById("valor-nota").value);

  if (!materia || isNaN(valor) || valor < 1 || valor > 5) {
    return alert("Escribe la materia y una nota válida (1.0 a 5.0)");
  }

  // Verifica si ya existe la materia
  const existente = notas.find(n => n.materia.toLowerCase() === materia.toLowerCase());
  if (existente) {
    existente.nota = valor;
  } else {
    notas.push({ materia, nota: valor });
  }

  localStorage.setItem("notas", JSON.stringify(notas));
  mostrarFrase(valor);
  graficarNotas();
  document.getElementById("materia-nota").value = "";
  document.getElementById("valor-nota").value = "";
}

function mostrarFrase(nota) {
  const fraseDiv = document.getElementById("frase-motivadora");
  if (nota < 3.0) {
    fraseDiv.textContent = "🔴 No te rindas, Melany. Cada error te acerca a mejorar 💪";
  } else if (nota === 3.0) {
    fraseDiv.textContent = "🟡 Regular... ¡puedes dar más, confía en ti! ✨";
  } else {
    fraseDiv.textContent = "🟢 ¡Sigue así, Melany! ¡Eres capaz de todo! 🌟";
  }
}

function graficarNotas() {
  const ctx = document.getElementById('grafico-notas').getContext('2d');
  const materias = notas.map(n => n.materia);
  const valores = notas.map(n => n.nota);
  const colores = valores.map(nota => {
    if (nota < 3) return "#ff4d4d";
    if (nota === 3) return "#ffd700";
    return "#32cd32";
  });

  if (window.graficoNotas) window.graficoNotas.destroy(); // Evitar gráficos duplicados

  window.graficoNotas = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: materias,
      datasets: [{
        label: 'Nota',
        data: valores,
        backgroundColor: colores,
        borderRadius: 8
      }]
    },
    options: {
      scales: {
        y: {
          suggestedMin: 1,
          suggestedMax: 5
        }
      }
    }
  });
}

graficarNotas();
let examenes = JSON.parse(localStorage.getItem("examenes")) || [];

function registrarExamen() {
  const materia = document.getElementById("materia-examen").value.trim();
  const nota = parseFloat(document.getElementById("nota-examen").value);
  const fecha = document.getElementById("fecha-examen").value;
  const error = document.getElementById("error-examen").value.trim();

  if (!materia || isNaN(nota) || nota < 1 || nota > 5 || !fecha || !error) {
    return alert("Por favor completa todos los campos correctamente.");
  }

  const examen = { materia, nota, fecha, error };
  examenes.push(examen);
  localStorage.setItem("examenes", JSON.stringify(examenes));
  mostrarExamenes();
  mostrarFraseExamen(nota);
  graficarExamenes();

  // Limpiar
  document.getElementById("materia-examen").value = "";
  document.getElementById("nota-examen").value = "";
  document.getElementById("fecha-examen").value = "";
  document.getElementById("error-examen").value = "";
}

function mostrarFraseExamen(nota) {
  const fraseDiv = document.getElementById("frase-examen");
  if (nota < 3.0) {
    fraseDiv.textContent = "🔴 ¡No pasa nada, Melany! Aprende del error y sigue adelante 💪";
  } else if (nota === 3.0) {
    fraseDiv.textContent = "🟡 Regular... ¡A practicar más y mejorar! ✨";
  } else {
    fraseDiv.textContent = "🟢 ¡Buen trabajo, Melany! Vas por buen camino 🌈";
  }
}

function mostrarExamenes() {
  const contenedor = document.getElementById("lista-examenes");
  contenedor.innerHTML = "";

  examenes.forEach(ex => {
    const div = document.createElement("div");
    div.className = "examen";
    div.innerHTML = `
      <b>${ex.materia}</b> - Nota: ${ex.nota} - Fecha: ${ex.fecha}
      <br><i>💡 En qué fallaste:</i> ${ex.error}
    `;
    contenedor.appendChild(div);
  });
}

function graficarExamenes() {
  const ctx = document.getElementById("grafico-examenes").getContext("2d");
  const etiquetas = examenes.map(e => `${e.materia} (${e.fecha})`);
  const notas = examenes.map(e => e.nota);
  const colores = notas.map(n => {
    if (n < 3) return "#ff4d4d";
    if (n === 3) return "#ffd700";
    return "#32cd32";
  });

  if (window.graficoExamenes) window.graficoExamenes.destroy();

  window.graficoExamenes = new Chart(ctx, {
    type: 'line',
    data: {
      labels: etiquetas,
      datasets: [{
        label: 'Nota por Examen',
        data: notas,
        fill: false,
        borderColor: '#c71585',
        backgroundColor: colores,
        tension: 0.2
      }]
    },
    options: {
      scales: {
        y: {
          min: 1,
          max: 5
        }
      }
    }
  });
}

mostrarExamenes();
graficarExamenes();
let flashcards = JSON.parse(localStorage.getItem("flashcards")) || [];
let juego = {
  preguntas: [],
  indice: 0,
  correctas: 0
};

function guardarFlashcard() {
  const pregunta = document.getElementById("pregunta").value.trim();
  const respuesta = document.getElementById("respuesta").value.trim();

  if (!pregunta || !respuesta) {
    return alert("Escribe la pregunta y su respuesta");
  }
  function mostrarFlashcardsGuardadas() {
  const contenedor = document.getElementById("lista-flashcards");
  contenedor.innerHTML = "";

  if (flashcards.length === 0) {
    contenedor.innerHTML = "<p>❌ No tienes flashcards guardadas.</p>";
    return;
  }

  flashcards.forEach((card, index) => {
    const div = document.createElement("div");
    div.className = "card-item";
    div.innerHTML = `
      <strong>❓ ${card.pregunta}</strong><br>
      <em>✅ ${card.respuesta}</em>
      <button onclick="borrarFlashcard(${index})">Eliminar</button>
    `;
    contenedor.appendChild(div);
  });
}

function borrarFlashcard(index) {
  if (confirm("¿Estás segura de eliminar esta flashcard?")) {
    flashcards.splice(index, 1);
    localStorage.setItem("flashcards", JSON.stringify(flashcards));
    mostrarFlashcardsGuardadas();
    alert("Flashcard eliminada correctamente 🗑️");
  }
}

  flashcards.push({ pregunta, respuesta });
  localStorage.setItem("flashcards", JSON.stringify(flashcards));
  document.getElementById("pregunta").value = "";
  document.getElementById("respuesta").value = "";
  alert("Flashcard agregada con éxito 📚");
}

function empezarJuego() {
  if (flashcards.length === 0) {
    return alert("Primero agrega algunas flashcards.");
  }

  // Mezclar aleatoriamente
  juego.preguntas = flashcards.sort(() => Math.random() - 0.5);
  juego.indice = 0;
  juego.correctas = 0;
  document.getElementById("puntaje-final").textContent = "";
  document.getElementById("resultado-flashcard").textContent = "";
  document.getElementById("juego-flashcards").style.display = "block";
  mostrarPregunta();
}

function mostrarPregunta() {
  const actual = juego.preguntas[juego.indice];
  document.getElementById("pregunta-juego").textContent = actual.pregunta;
  document.getElementById("respuesta-juego").value = "";
}

function verificarRespuesta() {
  const actual = juego.preguntas[juego.indice];
  const respuestaUsuario = document.getElementById("respuesta-juego").value.trim().toLowerCase();
  const resultado = document.getElementById("resultado-flashcard");

  if (respuestaUsuario === actual.respuesta.toLowerCase()) {
    resultado.textContent = "✅ ¡Correcto!";
    resultado.style.color = "green";
    juego.correctas++;
  } else {
    resultado.textContent = `❌ Incorrecto. La respuesta era: ${actual.respuesta}`;
    resultado.style.color = "red";
  }

  juego.indice++;
  if (juego.indice < juego.preguntas.length) {
    setTimeout(() => {
      resultado.textContent = "";
      mostrarPregunta();
    }, 1500);
  } else {
    mostrarPuntajeFinal();
  }
}

function mostrarPuntajeFinal() {
  const total = juego.preguntas.length;
  const correctas = juego.correctas;
  const porcentaje = (correctas / total) * 100;
  let mensaje = "";

  if (porcentaje === 100) {
    mensaje = "🎉 ¡Perfecto! ¡Eres una crack, Melany!";
  } else if (porcentaje >= 70) {
    mensaje = "🌟 Muy bien hecho. ¡Sigue así!";
  } else if (porcentaje >= 40) {
    mensaje = "🔁 Puedes mejorar. ¡Practica más!";
  } else {
    mensaje = "😥 ¡No te rindas! La práctica hace al genio.";
  }

  document.getElementById("juego-flashcards").style.display = "none";
  document.getElementById("puntaje-final").innerHTML = `
    <h3>Puntaje Final: ${correctas}/${total} (${porcentaje.toFixed(0)}%)</h3>
    <p>${mensaje}</p>
  `;
}
