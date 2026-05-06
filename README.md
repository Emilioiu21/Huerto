# Huerto Virtual 🌻

Este proyecto es un juego web interactivo desarrollado con HTML, CSS y JavaScript Vanilla. El objetivo es mantener un huerto, plantar semillas, regar la tierra, recolectar flores y venderlas o armar hermosos ramos en tu propia floristería.

## Historial de Modificaciones y Actualizaciones

A continuación se detalla el progreso y las características que se han ido añadiendo al proyecto desde su creación:

### Versión 1.0 - Creación Inicial del Huerto 🌱
- **Estructura Básica:** Se creó el archivo `index.html` con un contenedor principal, un panel de estadísticas y un panel de herramientas en la parte inferior.
- **Diseño Premium:** Se creó el archivo `style.css` aplicando un diseño moderno, utilizando *glassmorphism* (efecto de cristal translúcido), colores vibrantes para el cielo y el pasto, y una perspectiva isométrica en 3D para la cuadrícula del huerto.
- **Lógica de Juego (app.js):**
  - Implementación de la cuadrícula de 4x4 (16 parcelas).
  - Sistema de herramientas: Regar (💦), Cosechar (🧺) y Plantar (🌻 Semillas de Girasol y 🌹 Semillas de Rosa).
  - **Sistema de tiempo básico:** Botón de "Avanzar Día". Las plantas crecen día a día si tienen agua, y se secan o mueren (`🍂`) si pasan 2 días sin regarse.
  - **Economía:** Al cosechar flores adultas, se obtenían monedas directamente.
  - **Guardado Automático:** Implementación de `localStorage` para que el progreso se mantenga al cerrar la pestaña.
  - **Animaciones CSS:** Efectos visuales de agua, plantas apareciendo y monedas volando.

### Versión 1.1 - Expansión "La Floristería" 💐
- **Nueva Semilla:** Se introdujo el Tulipán (`🌷`), que crece rápido en solo 2 días y cuesta 40🪙.
- **Cambio Radical de la Economía (Inventario):** Al cosechar, el jugador ya no recibe monedas instantáneamente. Las flores se guardan en un Inventario.
- **Taller de Floristería (Crafting):**
  - Se añadió el botón `💐 Floristería` en la barra superior.
  - Se creó un modal flotante con diseño elegante que contiene dos secciones: "Tu Inventario" y "Armar Ramos".
  - **Recetas de Ramos:** Ahora los jugadores deben combinar flores para armar ramos que se venden a precios altísimos.
    - *Ramo de Sol:* 3 Girasoles (120🪙).
    - *Ramo Apasionado:* 3 Rosas (250🪙).
    - *Ramo Atardecer:* 2 Girasoles + 1 Rosa (180🪙).
    - *Ramo Primaveral:* 2 Tulipanes + 1 Rosa + 1 Girasol (300🪙).
- **Corrección de Errores:** Se solucionó un problema de codificación de caracteres en el archivo `style.css` generado durante la actualización, restaurando el diseño de la página a la perfección.

### Versión 1.2 - "El Clima y las Estaciones" 🌦️❄️
- **Sistema de Estaciones:** Primavera, Verano, Otoño e Invierno. Cada estación dura 7 días y cambia drásticamente los colores del entorno.
- **Clima Dinámico:** Cada día hay una probabilidad de que el día sea Soleado, Nublado, Lluvioso o Nevado.
  - *Días Lluviosos:* Riego automático en todas las parcelas.
  - *Verano:* El sol seca la tierra más rápido.
- **Ciclo Día y Noche:** Al avanzar el día, el cielo se oscurece y muestra estrellas antes de pasar al siguiente día.
- **Nuevas Herramientas Sorpresa:**
  - *Fertilizante:* Para hacer crecer las plantas instantáneamente una etapa.
  - *Flor de Hielo:* Semilla exclusiva del Invierno.

### Versión 1.3 - "Organización y Nuevas Herramientas" 🌼⛏️
- **Reubicación de Interfaz:** El botón de "Reiniciar" fue movido a la esquina superior como un icono de engranaje (⚙️) para prevenir reinicios accidentales.
- **Catálogo de Semillas:** Las semillas ya no saturan la pantalla principal. Se introdujo un botón "Abrir Catálogo" que despliega un menú flotante con todas las semillas disponibles.
- **Nuevas Flores:**
  - *Margarita (🌼):* Flor rápida y barata.
  - *Cactus (🌵):* Planta resistente que soporta el verano soleado perfectamente y solo muere después de 4 días sin agua.
  - *Lirio (🪷):* Flor elegante y valiosa.
- **Herramienta Palita (⛏️):** 
  - Si la usas en un brote recién plantado, **devuelve el costo de la semilla** (ideal para errores).
  - Si la usas en una planta muerta, la envía directamente a tu **Basurero (🗑️)**, el cual registra cuántas flores dejaste secar en la Floristería.
### Versión 1.4 - "Suministros Mágicos" 🧪✨
- **Tienda de Suministros:** El abono básico fue removido de la barra de herramientas y movido a un nuevo botón "🧪 Suministros" que abre un menú dedicado.
- **Nuevos Consumibles:**
  - *Abono Básico (30🪙):* Avanza la planta una etapa de crecimiento.
  - *Abono Premium (80🪙):* Hace crecer la planta a su etapa máxima instantáneamente.
  - *Poción de Vida (50🪙):* Si una planta muere por falta de agua, esta poción la revive mágicamente.
  - *Lluvia Embotellada (60🪙):* Riega todas las 16 parcelas del huerto al mismo tiempo con un solo clic.
