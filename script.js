document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById("menuBtn");
    const menuNav = document.getElementById("menuNav");
    const nav = menuNav.querySelectorAll("a");

    menuBtn.addEventListener("click", () => {
        menuNav.classList.toggle("active");
        if (menuNav.classList.contains("active")) {
            menuBtn.innerHTML = "✕";
            menuBtn.setAttribute("aria-expanded", "true");
        } else {
            menuBtn.innerHTML = "☰";
            menuBtn.setAttribute("aria-expanded", "false");
        }
    });

    nav.forEach(link => {
        link.addEventListener("click", () => {
            menuNav.classList.remove("active");
            menuBtn.innerHTML = "☰";
            menuBtn.setAttribute("aria-expanded", "false");
        });
    });

    // Prueba animacion index //
    const elements = document.querySelectorAll(".about-cont .imagen-about, .about-texts p");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("about-visible");
            } else {
                entry.target.classList.remove("about-visible");
            }
        });
    }, {
        threshold: 0.1,          // Se considera "visible" con el 10%
        rootMargin: "-150px 0px" // 🔥 Más tarde en pantalla = animación precisa
    });

    elements.forEach(el => observer.observe(el));

    const items = document.querySelectorAll(".timeline__item");

const timelineItems = document.querySelectorAll(".timeline__item");

const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const el = entry.target;

        // RIGHT SIDE
        if (el.classList.contains("right")) {
            if (entry.isIntersecting) {
                el.classList.remove("hidden-right");
                el.classList.add("appear-right");
            } else {
                el.classList.remove("appear-right");
                el.classList.add("hidden-right");
            }
        }

        // LEFT SIDE
        if (el.classList.contains("left")) {
            if (entry.isIntersecting) {
                el.classList.remove("hidden-left");
                el.classList.add("appear-left");
            } else {
                el.classList.remove("appear-left");
                el.classList.add("hidden-left");
            }
        }
    });
}, { threshold: 0.25 ,
  rootMargin: "0px 0px -20% 0px"
});


timelineItems.forEach(item => timelineObserver.observe(item));




    // --- código del builder ---

    const API_BASE_URL = "https://mi-backend-php-sx-z4mm.onrender.com/api";

// ===============================
// CARGAR CPUs SEGÚN MARCA
// ===============================
async function cargarCPUs(marca) {
    try {
        const response = await fetch(`${API_BASE_URL}/get_cpu.php?marca=${marca}`);
        const cpus = await response.json();
        renderCPUs(cpus);
    } catch (error) {
        console.error("Error cargando CPUs:", error);
    }
}

// ===============================
// RENDERIZAR CPUs EN LA LISTA
// ===============================
function renderCPUs(cpus) {
    const lista = document.getElementById("cpu_list");
    lista.innerHTML = "";

    if (cpus.length === 0) {
        lista.innerHTML = "<p>Elegi un chipset.</p>";
        return;
    }

    cpus.forEach(cpu => {
        lista.innerHTML += `
        <li class="builder__components__choose--lista">

            <img 
                src="${cpu.imagen ?? 'img/procesadores/cpu_default.png'}"
                class="builder__info builder__procesador_image"
                data-id="${cpu.id}" 
                data-tipo="cpu"
            >

            <div class="builder__components__choose--option">

                <h3 
                    class="builder__info"
                    data-id="${cpu.id}" 
                    data-tipo="cpu"
                >
                    ${cpu.nombre}
                </h3>

                <p 
                    class="builder__info"
                    data-id="${cpu.id}" 
                    data-tipo="cpu"
                >
                    Más info
                </p>

                <input type="radio"
                    name="builder__cpu"
                    id="cpu-${cpu.id}"
                    value="${cpu.socket}"
                >
                <label data-select="cpu" data-id="${cpu.id}" class="${cpu.socket} select-label">Seleccionar</label>
            </div>
        </li>`;
    });
}


// ===============================
// CUANDO SE SELECCIONA AMD O INTEL
// ===============================
document.querySelectorAll('input[name="builder__chipset"]').forEach(radio => {
    radio.addEventListener('change', () => {

        const marcaElegida = radio.value; // <= AHORA FUNCIONA

        if (marcaElegida) {
            cargarCPUs(marcaElegida);
        }
    });
});




// ======== SECCIÓN: COMPATIBILIDAD DE MOTHERBOARDS ==========
// ===============================
// CARGAR MOTHERBOARDS DESDE BACKEND
// ===============================
async function cargarMotherboards(socket) {
    try {
        const response = await fetch(`${API_BASE_URL}/get_mother.php?socket=${socket}`);
        const mothers = await response.json();
        renderMotherboards(mothers);
    } catch (error) {
        console.error("Error cargando motherboards:", error);
    }
}

function renderMotherboards(mothers) {
    const contenedor = document.getElementById("seccion-motherboards");
    contenedor.innerHTML = "";

    if (mothers.length === 0) {
        contenedor.innerHTML = `
            <li class="sin-resultados">
                <p>No hay motherboards compatibles.</p>
            </li>`;
        return;
    }

    mothers.forEach(m => {
        contenedor.innerHTML += `
        <li class="builder__components__choose--lista">

            <img 
                src="${m.imagen ?? 'img/mother/mother_default.webp'}"
                class="builder__info builder__mother_image"
                data-id="${m.id}"
                data-tipo="mother"
            >

            <div class="builder__components__choose--option">
                
                <h3 
                    class="builder__info"
                    data-id="${m.id}"
                    data-tipo="mother"
                >
                    ${m.nombre}
                </h3>

                <p 
                    class="builder__info"
                    data-id="${m.id}"
                    data-tipo="mother"
                >
                    Más info
                </p>

                <input type="radio"
                    name="builder__mother"
                    id="mother-${m.id}"
                    value="${m.socket}"
                    data-tipo_memoria="${m.tipo_memoria}"
                >
                <label data-select="mother" data-id="${m.id}" class="select-label">Seleccionar</label>
            </div>
        </li>`;
    });
}

// ===============================
// EVENTO: CUANDO SE SELECCIONA UN PROCESADOR
// ===============================
document.addEventListener("change", e => {
    if (e.target.name === "builder__cpu") {

        const socketSeleccionado = e.target.value; // AM5 / AM4 / LGA1700...

        const motherboardsContainer = document.querySelector('.builder__motherboards');

        if (!socketSeleccionado) {
            motherboardsContainer.style.display = "none";
            return;
        }

        motherboardsContainer.style.display = "flex";

        // Cargar motherboards desde backend
        cargarMotherboards(socketSeleccionado);
    }
});

async function cargarRAM(tipoMemoria) {
    try {
        const response = await fetch(`${API_BASE_URL}/get_ram.php?tipo=${tipoMemoria}`);
        const rams = await response.json();
        renderRAM(rams);
    } catch (error) {
        console.error("Error cargando RAM:", error);
    }
}

function renderRAM(rams) {
    const contenedor = document.getElementById("seccion-ram");
    contenedor.innerHTML = "";

    if (rams.length === 0) {
        contenedor.innerHTML = `
            <li class="sin-resultados">
                <p>No hay memorias RAM compatibles.</p>
            </li>`;
        return;
    }

    rams.forEach(r => {
        contenedor.innerHTML += `
        <li class="builder__components__choose--lista">

            <img 
                src="${r.imagen ?? 'img/ram/ram_default.png'}"
                class="builder__info"
                data-id="${r.id}"
                data-tipo="ram"
            >

            <div class="builder__components__choose--option">
                
                <h3 
                    class="builder__info"
                    data-id="${r.id}"
                    data-tipo="ram"
                >
                    ${r.nombre}
                </h3>

                <p 
                    class="builder__info"
                    data-id="${r.id}"
                    data-tipo="ram"
                >
                    Más info
                </p>

                <input type="radio"
                    name="builder__ram"
                    id="ram-${r.id}"
                    value="${r.capacidad_gb}"
                >

                <label data-select="ram" data-id="${r.id}" class="select-label">Seleccionar</label>
            </div>
        </li>`;
    });
}

// ===============================
// EVENTO: CUANDO SE SELECCIONA UNA MOTHERBOARD
// ===============================
document.addEventListener("change", e => {
    if (e.target.name === "builder__mother") {

        const tipoMemoria = e.target.dataset.tipo_memoria; // DDR4 / DDR5
        const ramContainer = document.querySelector('.builder__ram');

        if (!tipoMemoria) {
            ramContainer.style.display = "none";
            return;
        }

        ramContainer.style.display = "flex";

        // Cargar RAM compatibles
        cargarRAM(tipoMemoria);
    }
});

// ===============================
// CARGAR TARJETAS GRÁFICAS (GPU) DESDE BACKEND
// ===============================
async function cargarGraficas() { // Usamos 'cargarGraficas' si prefieres 'grafica' en lugar de 'gpu'
    try {
        // Llama al endpoint get_grafica.php. No necesita parámetros.
        const response = await fetch(`${API_BASE_URL}/get_grafica.php`); 
        const graficas = await response.json();
        renderGraficas(graficas);
    } catch (error) {
        console.error("Error cargando Gráficas:", error);
    }
}

// ===============================
// RENDERIZAR GPUs EN LA LISTA
// ===============================
// ===============================
// RENDERIZAR GPUs EN LA LISTA (CON CORRECCIÓN DE IMAGEN)
// ===============================
function renderGraficas(graficas) {
    // Nota: El ID del contenedor debe ser 'seccion-graficas' (en plural),
    // pero estoy manteniendo 'seccion-grafica' porque lo tienes así en el código
    const contenedor = document.getElementById("seccion-grafica"); 
    contenedor.innerHTML = "";

    if (graficas.length === 0) {
        contenedor.innerHTML = `
            <li class="sin-resultados">
                <p>No hay tarjetas gráficas disponibles.</p>
            </li>`;
        return;
    }

    graficas.forEach(g => {
        // CORRECCIÓN DE IMAGEN: Usamos || (OR) en lugar de ?? (Nullish Coalescing)
        // para asegurar que el 'default' se use si g.imagen es una cadena vacía ("").
        const imagenSrc = g.imagen || 'img/grafica/gpu_default.png';

        contenedor.innerHTML += `
        <li class="builder__components__choose--lista">
            <img 
                src="${imagenSrc}"
                class="builder__info"
                data-id="${g.id}"
                data-tipo="grafica" 
            >

            <div class="builder__components__choose--option">
                <h3 
                    class="builder__info"
                    data-id="${g.id}"
                    data-tipo="grafica"
                >
                    ${g.modelo}
                </h3>
                <p 
                    class="builder__info"
                    data-id="${g.id}"
                    data-tipo="grafica"
                >
                    Más info
                </p>

                <input type="radio"
                    name="builder__grafica"
                    id="grafica-${g.id}"
                    value="${g.id}" 
                >
                <label data-select="grafica" data-id="${g.id}" class="select-label">Seleccionar</label>
            </div>
        </li>`;
    });
}

// ===============================
// EVENTO: CUANDO SE SELECCIONA UNA RAM
// ===============================
document.addEventListener("change", e => {
    if (e.target.name === "builder__ram") {

        const ramSeleccionada = e.target.checked; // Solo verifica si está checkeada
        const graficaContainer = document.querySelector('.builder__grafica'); // Asegúrate de tener este selector de contenedor

        if (!ramSeleccionada) {
            graficaContainer.style.display = "none";
            return;
        }

        graficaContainer.style.display = "flex";

        // Cargar TARJETAS GRÁFICAS
        cargarGraficas(); // <--- ¡NUEVO PASO DE LÓGICA!
    }
});



    // --- código del modal ---
// ===========================================================
//  MODAL GLOBAL
// ===========================================================
const modal = document.getElementById("modal");
const modalContainer = modal.querySelector(".modal__container");

// ===========================================================
//  DETECTOR UNIVERSAL DE MODALES
// ===========================================================
document.addEventListener("click", async function (e) {

    // ¿Se clickeó un botón "Más info"?
    if (!e.target.classList.contains("builder__info")) return;

    e.preventDefault();

    const tipo = e.target.dataset.tipo;   // cpu, mother, ram...
    const id   = e.target.dataset.id;

    if (!tipo || !id) return;

    // === Llamar al backend correcto ===
    const res = await fetch(`${API_BASE_URL}/get_${tipo}.php?id=${id}`);
    const data = await res.json();

    // === Abrir el modal correspondiente ===
    if (tipo === "cpu") generarModalCPU(data);
    if (tipo === "mother") generarModalMother(data);
    if (tipo === "ram") generarModalRAM(data);
    if (tipo === "grafica") generarModalGPU(data);
    if (tipo === "psu") generarModalPSU(data);
});

// ===========================================================
//  MODAL DE CPU
// ===========================================================
function generarModalCPU(cpu) {

    modalContainer.innerHTML = `
        <img src="${cpu.imagen ?? 'img/procesadores/cpu_default.png'}">

        <div class="modal__side">
            <h2>${cpu.nombre}</h2>
            <h3>Donde comprar:</h3>
            <ul id="preciosProce"></ul>
        </div>

        <div class="modal__text">
            <h3>Lo que tenés que saber</h3>
            <div>
                <ul>
                    <li><p><b>Socket:</b> ${cpu.socket}</p></li>
                    <li><p><b>Frecuencia:</b> ${cpu.frecuencia_base} / ${cpu.frecuencia_turbo}</p></li>
                    <li><p><b>Núcleos:</b> ${cpu.nucleos}</p></li>
                    <li><p><b>Hilos:</b> ${cpu.hilos}</p></li>
                    <li><p><b>Gráficos integrados:</b> ${cpu.graficos_integrados == 1 ? "Sí" : "No"}</p></li>
                    <li><p><b>TDP:</b> ${cpu.tdp}</p></li>
                    <li><p><b>Memoria:</b> ${cpu.tipo_memoria}</p></li>
                </ul>
            </div>
        </div>

        <div class="modal__buttons">
            <label data-select="cpu" data-id="${cpu.id}" class="${cpu.socket} select-label">Seleccionar</label>
            <a class="modal__close">Cerrar</a>
        </div>
    `;

    modal.classList.add("modal--show");
}

// ===========================================================
//  MODAL DE MOTHER
// ===========================================================
function generarModalMother(m) {

    modalContainer.innerHTML = `
        <img src="${m.imagen ?? 'img/mother/mother_default.webp'}">

        <div class="modal__side">
            <h2>${m.nombre}</h2>
            <h3>Donde comprar:</h3>
            <ul id="preciosMother"></ul>
        </div>

        <div class="modal__text modal_mother">
            <h3>Lo que tenés que saber</h3>
            <div>
                <ul>
                    <li><p><b>Marca:</b> ${m.marca}</p></li>
                    <li><p><b>Socket:</b> ${m.socket}</p></li>
                    <li><p><b>Chipset:</b> ${m.chipset}</p></li>
                    <li><p><b>Formato:</b> ${m.form_factor}</p></li>
                    <li><p><b>Tipo de memoria:</b> ${m.tipo_memoria}</p></li>
                    <li><p><b>Memoria maxima:</b> ${m.max_memoria}</p></li>
                    <li><p><b>Slots de memoria:</b> ${m.slots_memoria}</p></li>
                    <li><p><b>Velocidad de memoria:</b> ${m.velocidad_memoria}</p></li>
                    <li><p><b>Puertos m2:</b> ${m.puertos_m2}</p></li>
                    <li><p><b>Puertos sata:</b> ${m.puertos_sata}</p></li>
                    <li><p><b>PCI express:</b> ${m.pci_express}</p></li>
                    <li><p><b>WIFI:</b> ${m.wifi == 1 ? "Sí" : "No"}</p></li>
                </ul>
            </div>
        </div>

        <div class="modal__buttons">
            <label data-select="mother" data-id="${m.id}" class="select-label">Seleccionar</label>
            <a class="modal__close">Cerrar</a>
        </div>
    `;

    modal.classList.add("modal--show");
}

// ===========================================================
//  MODAL DE RAM
// ===========================================================
function generarModalRAM(r) {

    modalContainer.innerHTML = `
        <img src="${r.imagen ?? 'img/ram/ram_default.png'}">

        <div class="modal__side">
            <h2>${r.nombre}</h2>
            <h3>Donde comprar:</h3>
            <ul id="preciosRAM"></ul>
        </div>

        <div class="modal__text">
            <h3>Lo que tenés que saber</h3>
            <div>
                <ul>
                    <li><p><b>Marca:</b> ${r.marca}</p></li>
                    <li><p><b>Tipo de memoria:</b> ${r.tipo_memoria}</p></li>
                    <li><p><b>Capacidad:</b> ${r.capacidad_gb} GB</p></li>
                    <li><p><b>Velocidad:</b> ${r.velocidad_mhz} MHz</p></li>
                    <li><p><b>Latencia (CL):</b> ${r.latencia_cl}</p></li>
                    <li><p><b>Voltaje:</b> ${r.voltaje}</p></li>
                    <li><p><b>Kits:</b> ${r.kits}</p></li>
                    <li><p><b>Soporte XMP:</b> ${r.soporte_xmp == 1 ? "Sí" : "No"}</p></li>
                    <li><p><b>Soporte Expo:</b> ${r.soporte_expo == 1 ? "Sí" : "No"}</p></li>
                </ul>
            </div>
        </div>

        <div class="modal__buttons">
            <label data-select="ram" data-id="${r.id}" class="select-label">Seleccionar</label>
            <a class="modal__close">Cerrar</a>
        </div>
    `;

    modal.classList.add("modal--show");
}

// ===========================================================
// MODAL DE TARJETA GRÁFICA (GPU)
// ===========================================================
function generarModalGPU(g) {
    // Asegúrate de que 'modalContainer' y 'modal' existen en el scope global
    // Si usas el operador '||' es para que funcione si la DB tiene cadena vacía ('')
    const imagenSrc = g.imagen || 'img/grafica/gpu_default.png';

    modalContainer.innerHTML = `
        <img src="${imagenSrc}">

        <div class="modal__side">
            <h2>${g.modelo}</h2> 
            <h3>Donde comprar:</h3>
            <ul id="preciosGPU"></ul>
        </div>

        <div class="modal__text">
            <h3>Especificaciones de la GPU</h3>
            <div>
                <ul>
                    <li><p><b>Marca (Chipset):</b> ${g.marca}</p></li>
                    <li><p><b>Modelo:</b> ${g.modelo}</p></li>
                    <li><p><b>Memoria VRAM:</b> ${g.vram_gb} GB</p></li>
                    <li><p><b>Tipo de VRAM:</b> ${g.tipo_vram}</p></li>
                    <li><p><b>Consumo Máx. (TDP):</b> ${g.consumo_watts} Watts</p></li>
                    <li><p><b>Pines de Alimentación:</b> ${g.pin_power}</p></li>
                    <li><p><b>Requisito de Fuente:</b> ${g.requisitos_fuente_watts} Watts</p></li>
                    <li><p><b>Versión PCI-E:</b> ${g.pci_version}</p></li>
                    <li><p><b>Largo (aprox.):</b> ${g.largo_mm} mm</p></li>
                    <li><p><b>Slots ocupados:</b> ${g.ancho_slots}</p></li>
                </ul>
            </div>
        </div>

        <div class="modal__buttons">
            <label data-select="grafica" data-id="${g.id}" class="select-label">Seleccionar</label>
            <a class="modal__close">Cerrar</a>
        </div>
    `;

    // Muestra el modal
    modal.classList.add("modal--show");
}


// ===========================================================
//  CERRAR MODAL
// ===========================================================
document.addEventListener("click", function (e) {
    if (e.target.classList.contains("modal__close") || e.target.id === "modal") {
        modal.classList.remove("modal--show");
    }
});


    // --- fin código del modal ---
});

// --- código de precios ---

const sheetId = '1yWENMAq1I2lmBLrBRGOZNFrXtSBf4lNDZZxLCPedPGY'; 
const sheetName = 'Precios';
const apiUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${sheetName}&headers=1&cacheBust=${Date.now()}`;

// Función para formatear precios con separador de miles y símbolo $
function formatearPrecio(valor) {
  if (isNaN(valor)) return valor;
  else if ((valor)== 0){
    return `<span style="color:red;">Sin stock</span>`;
  };
  return `$ ${Number(valor).toLocaleString('es-AR')}`;
}

// Cargar datos del Sheet
fetch(apiUrl)
  .then(res => res.text())
  .then(data => {
    try {
      const jsonData = JSON.parse(
        data.match(/google\.visualization\.Query\.setResponse\((.*)\);/)[1]
      );
      const rows = jsonData.table.rows;

      // Convertimos las filas en objetos más legibles
      const productos = rows.map(row => ({
        nombre: row.c[0]?.v || '',
        tienda: row.c[1]?.v || '',
        precio: row.c[2]?.v || '',
        url: row.c[3]?.v || '#'
      }));

      // 🔹 Recorremos todos los modales de la página
      document.querySelectorAll('.modal').forEach(modal => {
        const productoModal = modal.dataset.producto?.trim();
        const lista = modal.querySelector('ul[id^="precios"]');

        if (!productoModal || !lista) return;

        // Filtramos las filas que coincidan con este producto
        const coincidencias = productos.filter(
          p => p.nombre.toLowerCase() === productoModal.toLowerCase()
        );

        // Limpiamos la lista actual
        lista.innerHTML = '';

        // Si hay coincidencias, agregamos los precios
        if (coincidencias.length > 0) {
          coincidencias.forEach(p => {
            const item = document.createElement('li');
            item.innerHTML = `
              <a href="${p.url}" target="_blank">
                <p>${p.tienda}</p>
                <span>${formatearPrecio(p.precio) || 'N/A'}</span>
              </a>
            `;
            lista.appendChild(item);
          });
        } else {
          lista.innerHTML = '<li><p>No hay precios disponibles</p></li>';
        }
      });
    } catch (e) {
      console.error("Error al analizar JSON:", e);
    }
  })
  .catch(err => console.error("Error al cargar datos:", err));

// --- Fin código de precios ---

// ===========================================================
// SELECCIÓN DE COMPONENTES (cards + modal unificado)
// ===========================================================
document.addEventListener("click", function(e) {
    // Solo funciona si clickeaste un botón de tipo “Seleccionar”
    if (!e.target.matches("[data-select]")) return;

    const tipo = e.target.dataset.select;     // cpu / mother / ram / gpu / etc
    const id = e.target.dataset.id;           // ID del componente

    // Buscar el input correspondiente al radio
    const input = document.getElementById(`${tipo}-${id}`);
    if (!input) return;

    // Activar el radio
    input.checked = true;
    input.dispatchEvent(new Event("change", { bubbles: true })); // sigue el flujo normal

    // ===========================================================
    // BORDES SELECCIONADOS
    // ===========================================================
    document.querySelectorAll(`input[name="builder__${tipo}"]`).forEach(inp => {
        const li = inp.closest(".builder__components__choose--lista");
        if (li) li.classList.remove("seleccionado");
    });

    const liActual = input.closest(".builder__components__choose--lista");
    if (liActual) liActual.classList.add("seleccionado");

    // ===========================================================
    // ACTUALIZAR NOMBRE EN LA LISTA DERECHA
    // ===========================================================
    const nombreProducto =
        liActual.querySelector("h3")?.textContent ??
        "Producto seleccionado";

    let textoTipo = "";
    switch (tipo) {
        case "cpu": textoTipo = "Procesador"; break;
        case "mother": textoTipo = "Motherboard"; break;
        case "ram": textoTipo = "RAM"; break;
        case "grafica": textoTipo = "Tarjeta Grafica"; break;
        case "almacenamiento": textoTipo = "Almacenamiento"; break;
        case "cooler": textoTipo = "Cooler"; break;
        case "fuente": textoTipo = "Fuente"; break;
        case "gabinete": textoTipo = "Gabinete"; break;
    }

    // Buscar el <li> correspondiente en la estructura de la derecha
    const li = Array.from(document.querySelectorAll(".structure_ia_seleccion li"))
                    .find(x => x.querySelector("h3").textContent.includes(textoTipo));

    if (li) {
        const p = li.querySelector("p");
        p.textContent = nombreProducto;
        p.style.color = "#2ecc71";
        p.style.fontWeight = "bold";
    }

    // Cerrar modal si está abierto
    if (modal.classList.contains("modal--show")) {
        modal.classList.remove("modal--show");
    }

});

  // --- Fin código de seleccion de componentes ---


