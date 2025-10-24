# sx

🧠 PC Builder Interactivo

PC Builder Interactivo es una plataforma web diseñada para que los usuarios puedan armar su propia PC paso a paso, visualizando la compatibilidad entre componentes en tiempo real.
El sistema permite seleccionar procesadores, placas madre y —en el futuro— el resto de los componentes, mostrando visualmente qué combinaciones son válidas o incompatibles, y actualizando los precios en tiempo real desde una hoja de Google Sheets conectada al proyecto.

🚀 Objetivo del proyecto

El objetivo principal es ofrecer una herramienta didáctica e interactiva que ayude a los usuarios a entender la relación entre los distintos componentes de hardware de una computadora.
Además, se busca implementar una IA asistente lateral, que sirva como guía durante la selección, explicando conceptos, resolviendo dudas y sugiriendo configuraciones equilibradas.

⚙️ Funcionamiento general

🔹 Flujo actual

1- El usuario elige un procesador (CPU) de la lista.

2- El sistema detecta el socket del procesador seleccionado.

3- Se filtran automáticamente las motherboards según su compatibilidad con ese socket.

4- Las placas madre compatibles se muestran a color y son clickeables.

5- Las incompatibles aparecen al final de la lista, en escala de grises, con el texto superpuesto “Incompatible” y sin posibilidad de interacción.

6- Si el usuario cambia de procesador, el sistema revisa la selección actual y deselecciona la motherboard si es incompatible con el nuevo CPU.

7- Si no se ha seleccionado ningún procesador, las motherboards permanecen ocultas para guiar visualmente al usuario.

El archivo script.js maneja toda la lógica interactiva:

-Detecta cambios en los inputs (radios, checkboxes, etc.).

-Compara sockets mediante atributos id o data-socket.

-Aplica clases CSS (compatible / incompatible) y estilos visuales dinámicos.

-Reordena los elementos del DOM para mostrar primero los compatibles.

-Desactiva la interacción en los elementos incompatibles.

-Restaura o mantiene selecciones según la compatibilidad al cambiar de CPU.

🧩 Componentes actuales

-Procesadores (CPU): lista inicial con modelos de Intel y AMD, diferenciados por socket.

-Motherboards: catálogo agrupado por socket correspondiente.

-Interfaz dinámica: oculta o muestra componentes según la selección.

Compatibilidad visual:

✅ Compatibles → color original, clickeables.

⚪ Incompatibles → escala de grises, texto “Incompatible”, bloqueadas.

💾 Integración de precios en tiempo real (Google Sheets)

Una de las características planificadas más importantes es la conexión con Google Sheets para manejar los precios actualizados en tiempo real de todos los componentes.

Esta integración permitirá:

-Actualizar automáticamente los precios sin modificar el código fuente.

-Utilizar la hoja de cálculo como una base de datos centralizada.

-Mostrar el precio total de la build en tiempo real a medida que el usuario selecciona los componentes.

-Permitir al administrador del proyecto modificar precios, disponibilidad o añadir nuevos productos directamente desde Google Sheets.

🔗 El proyecto obtendrá los datos mediante la API pública de Google Sheets (JSON), garantizando que los precios estén siempre actualizados sin necesidad de desplegar nuevamente el sitio.

🧠 Integración de IA (futura implementación)

-Se integrará una IA asistente lateral visible en todo momento, que permitirá:

-Explicar conceptos técnicos (p. ej. diferencia entre DDR4 y DDR5).

-Sugerir componentes compatibles y balanceados.

-Recomendar configuraciones basadas en el uso (gaming, diseño, oficina, etc.).

-Responder preguntas en lenguaje natural dentro del flujo del constructor.

-La IA podría implementarse mediante una API de lenguaje natural (como OpenAI) y conectarse al contexto del usuario (lo que ha seleccionado, presupuesto, etc.) para ofrecer respuestas contextualizadas.

🧠 Futuras implementaciones

Además de la integración de la IA y los precios en tiempo real, se planea expandir el sistema para cubrir todos los componentes de hardware, incluyendo:

-Memoria RAM: filtrado por tipo (DDR4, DDR5), velocidad y compatibilidad.

-Tarjetas gráficas (GPU): validación de tamaño, conectores y fuente requerida.

-Almacenamiento: soporte para SATA y M.2 NVMe, con prioridad visual.

-Fuentes de poder (PSU): cálculo automático del consumo total.

-Gabinetes: compatibilidad física con la placa madre y GPU.

-Refrigeración: compatibilidad térmica y de espacio.

🎨 Experiencia de usuario

-Interfaz totalmente responsiva.

-Elementos dinámicos y visuales que guían al usuario paso a paso.

-Compatibilidad visual representada con colores, opacidad y overlays.

-Feedback inmediato al cambiar cualquier componente.

-Futuro panel de resumen que mostrará todos los componentes elegidos, con el costo total actualizado en tiempo real.

🧩 Tecnologías utilizadas

-HTML5 – estructura del sitio.

-CSS3 – diseño y efectos visuales de compatibilidad.

-JavaScript (ES6) – lógica de interacción y validación.

-Google Sheets API – (pendiente) para actualización automática de precios.

-(Futuro) API de IA conversacional – asistencia personalizada contextual.

💡 Visión a largo plazo

El proyecto apunta a convertirse en un constructor de PC inteligente, donde cada elección del usuario actualiza:

-La compatibilidad de los demás componentes.

-El precio total estimado.

-Las recomendaciones personalizadas de la IA.

De esta forma, el usuario podrá diseñar, aprender y cotizar su PC de manera informada, visual y didáctica, sin necesidad de conocimientos técnicos avanzados.
