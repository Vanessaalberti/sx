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

    // --- código del builder ---
// ======== SECCIÓN: MOSTRAR AMD / INTEL ==========
const radios = document.querySelectorAll('input[name="builder__chipset"]');
const amdList = document.getElementById('amd_list');
const intelList = document.getElementById('intel_list');

function ocultarTodo() {
  amdList.style.display = 'none';
  intelList.style.display = 'none';
}
ocultarTodo();

radios.forEach(radio => {
  radio.addEventListener('change', function() {
    if (this.value === 'amd') {
      amdList.style.display = 'flex';
      intelList.style.display = 'none';
    } else if (this.value === 'intel') {
      intelList.style.display = 'flex';
      amdList.style.display = 'none';
    } else {
      ocultarTodo();
    }
  });
});


// ======== SECCIÓN: COMPATIBILIDAD DE MOTHERBOARDS ==========
const procesadores = document.querySelectorAll('input[name="builder__procesador"]');
const motherboardsContainer = document.querySelector('.builder__motherboards');
const motherboards = document.querySelectorAll('.builder__motherboards > li'); // solo los visibles
motherboardsContainer.style.display = 'none'; // Ocultar todos al inicio

procesadores.forEach(proce => {
  proce.addEventListener('change', () => {
    const socketSeleccionado = proce.value; // ej: "am5", "am4", "lga1700"

    // Mostrar el contenedor solo si hay selección
    if (!socketSeleccionado) {
      motherboardsContainer.style.display = 'none';
      return;
    } else {
      motherboardsContainer.style.display = 'flex';
    }

    const compatibles = [];
    const incompatibles = [];

    motherboards.forEach(mother => {
      const esCompatible = mother.id === socketSeleccionado;
      const input = mother.querySelector('input[type="radio"], input[type="checkbox"]');

      if (esCompatible) {
        mother.classList.remove('incompatible');
        mother.classList.add('compatible');
        compatibles.push(mother);
      } else {
        mother.classList.add('incompatible');
        mother.classList.remove('compatible');
        incompatibles.push(mother);

        // Si estaba seleccionada y ahora es incompatible → deseleccionarla
        if (input && input.checked) {
          input.checked = false;

          // También eliminar de la sección de la derecha
          const listaSeleccion = document.querySelector(".structure_ia_seleccion ul");
          if (listaSeleccion) {
            const li = Array.from(listaSeleccion.querySelectorAll("li"))
              .find(li => li.querySelector("h3").textContent.includes("Motherboard"));
            if (li) {
              const p = li.querySelector("p");
              p.textContent = "No seleccionado";
              p.style.color = "var(--secondary-text)";
              p.style.fontWeight = "normal";
            }
          }
        }
      }
    });

    // Reordenar: primero las compatibles, luego las incompatibles
    motherboardsContainer.innerHTML = '';
    compatibles.forEach(m => motherboardsContainer.appendChild(m));
    incompatibles.forEach(m => motherboardsContainer.appendChild(m));
  });
});

    // --- código del modal ---
const infoButtons = document.querySelectorAll('.builder__procesador_info');

infoButtons.forEach(button => {
  const listItem = button.closest('.builder__components__choose--lista');
  const modal = listItem.querySelector('.modal');
  const closeBtn = modal.querySelector('.modal__close');
  const selectBtn = modal.querySelector('.modal__buttons label');

  button.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.add('modal--show');
  });
  closeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.remove('modal--show');
  });
  selectBtn.addEventListener('click', () => {
    modal.classList.remove('modal--show');
  });
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

// --- Código de seleccion de componentes ---
const labels = document.querySelectorAll(".builder__components__choose--lista label");

  labels.forEach(label => {
    label.addEventListener("click", () => {
      const inputId = label.getAttribute("for");
      const input = document.getElementById(inputId);
      if (!input) return;

      // Encuentra el nombre del producto
      const nombreProducto = label.closest(".builder__components__choose--lista").querySelector("h3").textContent;

      // Detecta el tipo de componente por el nombre del input
      let tipo = "";
      if (input.name.includes("procesador")) tipo = "Procesador";
      else if (input.name.includes("RAM")) tipo = "RAM";
      else if (input.name.includes("mother")) tipo = "Motherboard";
      else if (input.name.includes("grafica")) tipo = "Tarjeta Grafica";
      else if (input.name.includes("almacenamiento")) tipo = "Almacenamiento";
      else if (input.name.includes("cooler")) tipo = "Cooler";
      else if (input.name.includes("fuente")) tipo = "Fuente";
      else if (input.name.includes("gabinete")) tipo = "Gabinete";

      // Actualiza el texto en la lista de selección
      const listaSeleccion = document.querySelector(".structure_ia_seleccion ul");
      if (listaSeleccion) {
        const li = Array.from(listaSeleccion.querySelectorAll("li"))
          .find(li => li.querySelector("h3").textContent.includes(tipo));

        if (li) {
          const p = li.querySelector("p");
          p.textContent = nombreProducto;
          p.style.color = "#2ecc71"; // Verde para indicar selección
          p.style.fontWeight = "bold";
        }
      }
    });
  });

  // --- Fin código de seleccion de componentes ---

