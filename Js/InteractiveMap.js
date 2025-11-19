// Archivo: ../Js/InteractiveMap.js (Sistema de 3 Niveles de Vistas)

document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos principales
    const buttons = document.querySelectorAll('.buttons-list .btn');
    const comunas = document.querySelectorAll('.comuna');
    const mapLayout = document.querySelector('.map-layout');
    const detailedMapContainer = document.getElementById('detailed-map-views');
    const pointContentViews = document.getElementById('point-content-views');
    const allDetailedMaps = document.querySelectorAll('.detailed-map-view');
    const allPointContents = document.querySelectorAll('.point-content');

    // --- Mapeo de Clases de Botón a IDs de Imagen ---
    const comunaMap = {
        'btn--popular': { id: 'popular-1', detailedId: 'map-popular-1', color: '#DB4F44' },
        'btn--santa-cruz': { id: 'santacruz-8', detailedId: 'map-santacruz-8', color: '#FF9D00' },
        'btn--manrique': { id: 'manrique-2', detailedId: 'map-manrique-2', color: '#A855F7' },
        'btn--aranjuez': { id: 'aranjuez-7', detailedId: 'map-aranjuez-7', color: '#30C15D' },
        'btn--castilla': { id: 'castilla-9', detailedId: 'map-castilla-9', color: '#00C4C6' },
        'btn--doce-oct': { id: 'doceoctubre-10', detailedId: 'map-doceoctubre-10', color: '#1E9DB2' },
        'btn--robledo': { id: 'robledo-11', detailedId: 'map-robledo-11', color: '#49A2D6' },
        'btn--villa-hermosa': { id: 'villahermosa-3', detailedId: 'map-villahermosa-3', color: '#4E4FC7' },
        'btn--la-america': { id: 'laamerica-15', detailedId: 'map-laamerica-15', color: '#B45AE8' },
        'btn--laureles': { id: 'laureles-12', detailedId: 'map-laureles-12', color: '#FB3F6B' },
        'btn--san-javier': { id: 'sanjavier-16', detailedId: 'map-sanjavier-16', color: '#A98A67' },
        'btn--el-poblado': { id: 'elpoblado-5', detailedId: 'map-elpoblado-5', color: '#EA3A38' },
        'btn--guayabal': { id: 'guayabal-14', detailedId: 'map-guayabal-14', color: '#FFAB00' },
        'btn--belen': { id: 'belen-13', detailedId: 'map-belen-13', color: '#F9E84A' },
        'btn--la-candelaria': { id: 'lacandelaria-6', detailedId: 'map-lacandelaria-6', color: '#35C66D' },
        'btn--buenos-aires': { id: 'buenosaires-4', detailedId: 'map-buenosaires-4', color: '#2CBCCF' }
    };

    // Variable para rastrear la vista actual
    let currentView = 'main'; // 'main', 'detailed', 'point'
    let currentComuna = null;

    // Diccionario inverso para mapear ID de Comuna a clase de Botón
    const getComunaDataFromId = (comunaId) => {
        const entry = Object.entries(comunaMap).find(([key, value]) => value.id === comunaId);
        return entry ? { buttonClass: entry[0], ...entry[1] } : null;
    };

    // --- Función para obtener el filtro CSS ---
    const getFilterForColor = (hexColor) => {
        return `drop-shadow(0 0 10px ${hexColor})`;
    };

    // --- Función para resaltar comuna (solo en vista principal) ---
    const toggleHighlight = (comunaId, hexColor, shouldHighlight) => {
        if (currentView !== 'main') return;
        
        const comuna = document.getElementById(comunaId);
        if (comuna) {
            if (shouldHighlight) {
                comuna.classList.add('highlighted');
                comuna.style.filter = getFilterForColor(hexColor);
            } else {
                comuna.classList.remove('highlighted');
                comuna.style.filter = '';
            }
        }
    };

    // --- NIVEL 1 -> NIVEL 2: Transición a vista detallada ---
    const showDetailedView = (buttonClass) => {
        const data = comunaMap[buttonClass];
        if (!data) return;

        // Guardar la comuna actual
        currentComuna = buttonClass;
        currentView = 'detailed';

        // Ocultar vista principal
        mapLayout.style.display = 'none';

        // Limpiar todas las vistas detalladas
        allDetailedMaps.forEach(map => map.style.display = 'none');

        // Mostrar el contenedor de vistas detalladas
        detailedMapContainer.style.display = 'block';

        // Mostrar la vista detallada específica
        const targetDetailedMap = document.getElementById(data.detailedId);
        if (targetDetailedMap) {
            targetDetailedMap.style.display = 'block';
        }

        // Ocultar vista de puntos si estaba visible
        pointContentViews.style.display = 'none';
    };

    // --- NIVEL 2 -> NIVEL 1: Volver al mapa principal ---
    const showMainView = () => {
        currentView = 'main';
        currentComuna = null;

        // Mostrar mapa principal
        mapLayout.style.display = 'flex';

        // Ocultar vistas detalladas y de puntos
        detailedMapContainer.style.display = 'none';
        pointContentViews.style.display = 'none';

        // Limpiar estados
        comunas.forEach(c => {
            c.classList.remove('selected-comuna', 'highlighted');
            c.style.filter = '';
        });
        buttons.forEach(b => b.classList.remove('active'));
    };

    // --- NIVEL 2 -> NIVEL 3: Mostrar contenido de punto ---
    const showPointView = (pointId) => {
        currentView = 'point';

        // Ocultar vista detallada
        detailedMapContainer.style.display = 'none';

        // Limpiar todos los contenidos de puntos
        allPointContents.forEach(content => content.style.display = 'none');

        // Mostrar contenedor de puntos
        pointContentViews.style.display = 'block';

        // Mostrar el contenido específico
        const targetContent = document.getElementById(`content-${pointId}`);
        if (targetContent) {
            targetContent.style.display = 'block';
        }
    };

    // --- NIVEL 3 -> NIVEL 2: Volver a vista detallada ---
    const backToDetailedView = () => {
        if (!currentComuna) return;

        currentView = 'detailed';

        // Ocultar vista de puntos
        pointContentViews.style.display = 'none';

        // Mostrar vista detallada
        detailedMapContainer.style.display = 'block';
        const data = comunaMap[currentComuna];
        if (data) {
            const targetDetailedMap = document.getElementById(data.detailedId);
            if (targetDetailedMap) {
                targetDetailedMap.style.display = 'block';
            }
        }
    };

    // --- EVENT LISTENERS ---

    // 1. Eventos de BOTONES (menú lateral)
    buttons.forEach(button => {
        const buttonClass = Array.from(button.classList).find(c => c.startsWith('btn--'));
        const data = comunaMap[buttonClass];

        if (data) {
            // Hover: Solo en vista principal
            button.addEventListener('mouseenter', () => {
                toggleHighlight(data.id, data.color, true);
            });

            button.addEventListener('mouseleave', () => {
                toggleHighlight(data.id, data.color, false);
            });

            // Click: Ir a vista detallada
            button.addEventListener('click', () => {
                showDetailedView(buttonClass);
                button.classList.add('active');
            });
        }
    });

    // 2. Eventos de IMÁGENES DE COMUNAS (en el mapa principal)
    comunas.forEach(comuna => {
        const comunaId = comuna.id;
        const data = getComunaDataFromId(comunaId);

        if (data) {
            // Click en imagen: simular click en botón
            comuna.addEventListener('click', () => {
                if (currentView === 'main') {
                    const targetButton = document.querySelector(`.${data.buttonClass}`);
                    if (targetButton) {
                        targetButton.click();
                    }
                }
            });
        }
    });

    // 3. Eventos de BOTONES "Volver al mapa" (Nivel 2 -> Nivel 1)
    detailedMapContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-back-main')) {
            showMainView();
        }
    });

    // 4. Eventos de PUNTOS DE INTERÉS (Nivel 2 -> Nivel 3)
    detailedMapContainer.addEventListener('click', (e) => {
        const point = e.target.closest('.point-of-interest');
        if (point) {
            const pointId = point.dataset.point;
            showPointView(pointId);
        }
    });

    // 5. Eventos de BOTONES "Volver al mapa de la comuna" (Nivel 3 -> Nivel 2)
    pointContentViews.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-back-to-map')) {
            backToDetailedView();
        }
    });
});