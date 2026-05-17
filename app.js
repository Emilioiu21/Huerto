// Configuración de las plantas
const PLANT_TYPES = {
    sunflower: {
        id: 'sunflower',
        name: 'Girasol',
        seedCost: 10,
        stages: ['🌱', '🌿', '🌻'],
        daysPerStage: 1
    },
    daisy: {
        id: 'daisy',
        name: 'Margarita',
        seedCost: 15,
        stages: ['🌱', '🌿', '🌼'],
        daysPerStage: 1
    },
    rose: {
        id: 'rose',
        name: 'Rosa',
        seedCost: 25,
        stages: ['🌱', '🪴', '🌹'],
        daysPerStage: 2
    },
    cactus: {
        id: 'cactus',
        name: 'Cactus',
        seedCost: 35,
        stages: ['🌵', '🌵', '🌵🌸'],
        daysPerStage: 2
    },
    tulip: {
        id: 'tulip',
        name: 'Tulipán',
        seedCost: 40,
        stages: ['🌱', '🌿', '🌷'],
        daysPerStage: 1
    },
    lily: {
        id: 'lily',
        name: 'Lirio',
        seedCost: 50,
        stages: ['🌱', '🪴', '🪷'],
        daysPerStage: 2
    },
    iceflower: {
        id: 'iceflower',
        name: 'Flor de Hielo',
        seedCost: 100,
        stages: ['🧊', '❄️', '💠'],
        daysPerStage: 3
    }
};

const SUPPLIES_TYPES = {
    fertilizer_basic: { id: 'fertilizer_basic', name: 'Abono Básico', cost: 30, icon: '🧪', desc: 'Avanza 1 etapa' },
    fertilizer_premium: { id: 'fertilizer_premium', name: 'Abono Premium', cost: 80, icon: '✨', desc: 'Crece al máximo' },
    revive_potion: { id: 'revive_potion', name: 'Poción de Vida', cost: 50, icon: '💊', desc: 'Revive planta seca' },
    magic_water: { id: 'magic_water', name: 'Lluvia Embotellada', cost: 60, icon: '🌧️', desc: 'Riega todo el huerto' }
};

const RECIPES = [
    { id: 'sun_bouquet', name: 'Ramo de Sol', price: 120, ingredients: { sunflower: 3 }, icon: '💐' },
    { id: 'romantic_bouquet', name: 'Ramo Apasionado', price: 250, ingredients: { rose: 3 }, icon: '🌺' },
    { id: 'sunset_bouquet', name: 'Ramo Atardecer', price: 180, ingredients: { sunflower: 2, rose: 1 }, icon: '🌅' },
    { id: 'spring_bouquet', name: 'Ramo Primaveral', price: 300, ingredients: { tulip: 2, rose: 1, sunflower: 1 }, icon: '🌸' }
];

const PLANT_ICONS = {
    sunflower: '🌻',
    daisy: '🌼',
    rose: '🌹',
    cactus: '🌵',
    tulip: '🌷',
    lily: '🪷',
    iceflower: '💠',
    trash: '🗑️'
};

const SEASONS = ['spring', 'summer', 'autumn', 'winter'];
const SEASON_ICONS = { spring: '🌸', summer: '☀️', autumn: '🍂', winter: '❄️' };
const WEATHER_NAMES = { sunny: 'Soleado', cloudy: 'Nublado', rainy: 'Lluvioso', snowy: 'Nevado' };

const DEAD_PLANT = '🍂';

// Estado del juego
let gameState = {
    coins: 1000,
    day: 1,
    totalDays: 1,
    seasonIndex: 0,
    weather: 'sunny',
    plots: [],
    inventory: { sunflower: 0, daisy: 0, rose: 0, cactus: 0, tulip: 0, lily: 0, iceflower: 0, trash: 0 }
};

const GRID_SIZE = 16;
let currentTool = 'water';
let currentSeed = null;
let currentSupply = null;

// Elementos del DOM
const coinsDisplay = document.getElementById('coins-display');
const dayDisplay = document.getElementById('day-display');
const gridElement = document.getElementById('garden-grid');
const btnNextDay = document.getElementById('btn-next-day');
const btnReset = document.getElementById('btn-reset');
const btnTheme = document.getElementById('btn-theme');
const toolButtons = document.querySelectorAll('.tool-btn');
const btnFlorist = document.getElementById('btn-florist');
const floristModal = document.getElementById('florist-modal');
const btnCloseFlorist = document.getElementById('btn-close-florist');
const inventoryGrid = document.getElementById('flower-inventory');
const recipesList = document.getElementById('recipes-list');

const seasonIcon = document.getElementById('season-icon');
const weatherText = document.getElementById('weather-text');
const weatherLayer = document.getElementById('weather-layer');
const nightLayer = document.getElementById('night-layer');

const btnCatalog = document.getElementById('btn-catalog');
const catalogModal = document.getElementById('catalog-modal');
const btnCloseCatalog = document.getElementById('btn-close-catalog');
const seedCatalogGrid = document.getElementById('seed-catalog-grid');

const btnSupplies = document.getElementById('btn-supplies');
const suppliesModal = document.getElementById('supplies-modal');
const btnCloseSupplies = document.getElementById('btn-close-supplies');
const suppliesCatalogGrid = document.getElementById('supplies-catalog-grid');

// Inicialización
function initGame() {
    // Lógica de la pantalla de carga
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        if (!sessionStorage.getItem('hasLoadedBefore')) {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                sessionStorage.setItem('hasLoadedBefore', 'true');
            }, 3000); // Muestra la animación por 3 segundos
        } else {
            loadingScreen.style.display = 'none';
            loadingScreen.classList.add('hidden');
        }
    }

    // Aplicar tema guardado
    const savedTheme = localStorage.getItem('huertoTheme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        if (btnTheme) btnTheme.textContent = '☀️';
    } else {
        if (btnTheme) btnTheme.textContent = '🌙';
    }

    loadState();

    if (gameState.plots.length !== GRID_SIZE) {
        gameState.plots = [];
        for (let i = 0; i < GRID_SIZE; i++) {
            gameState.plots.push({ id: i, plant: null, isWet: false });
        }
        saveState();
    }

    renderCatalog();
    renderSuppliesCatalog();
    updateEnvironmentVisuals();
    renderGrid();
    updateStats();
    setupEventListeners();
}

function loadState() {
    const saved = localStorage.getItem('huertoState');
    if (saved) {
        gameState = JSON.parse(saved);
        if (!gameState.inventory) gameState.inventory = {};

        const defaultInventory = { sunflower: 0, daisy: 0, rose: 0, cactus: 0, tulip: 0, lily: 0, iceflower: 0, trash: 0 };
        for (let key in defaultInventory) {
            if (gameState.inventory[key] === undefined) {
                gameState.inventory[key] = 0;
            }
        }

        if (gameState.totalDays === undefined) gameState.totalDays = gameState.day;
        if (gameState.seasonIndex === undefined) gameState.seasonIndex = 0;
        if (gameState.weather === undefined) gameState.weather = 'sunny';
    }
}

function saveState() {
    localStorage.setItem('huertoState', JSON.stringify(gameState));
}

// Renderizado
function renderGrid() {
    gridElement.innerHTML = '';
    gameState.plots.forEach(plot => {
        const plotEl = document.createElement('div');
        plotEl.className = `plot ${plot.isWet ? 'wet' : ''}`;
        plotEl.dataset.id = plot.id;

        if (plot.plant) {
            const plantEl = document.createElement('div');
            plantEl.className = 'plant';

            if (plot.plant.isDead) {
                plantEl.textContent = DEAD_PLANT;
                plotEl.classList.add('dead');
            } else {
                const typeData = PLANT_TYPES[plot.plant.type];
                plantEl.textContent = typeData.stages[plot.plant.stageIndex];
            }
            plotEl.appendChild(plantEl);
        }

        plotEl.addEventListener('click', () => handlePlotClick(plot.id, plotEl));
        gridElement.appendChild(plotEl);
    });
}

function updateStats() {
    coinsDisplay.textContent = gameState.coins;
    dayDisplay.textContent = gameState.day;

    // Actualizar balances en modales
    const catalogBalance = document.getElementById('catalog-balance');
    const suppliesBalance = document.getElementById('supplies-balance');
    if (catalogBalance) catalogBalance.textContent = `🪙 ${gameState.coins}`;
    if (suppliesBalance) suppliesBalance.textContent = `🪙 ${gameState.coins}`;

    const season = SEASONS[gameState.seasonIndex];
    seasonIcon.textContent = SEASON_ICONS[season];
    weatherText.textContent = WEATHER_NAMES[gameState.weather];
}

function updateEnvironmentVisuals() {
    const season = SEASONS[gameState.seasonIndex];
    document.body.className = '';
    document.body.classList.add(`season-${season}`);
    document.body.classList.add(`weather-${gameState.weather}`);
}

// Catálogos
function renderCatalog() {
    seedCatalogGrid.innerHTML = '';
    for (const [key, data] of Object.entries(PLANT_TYPES)) {
        const btn = document.createElement('button');
        btn.className = 'seed-btn';
        btn.innerHTML = `
            <span class="icon">${data.stages[data.stages.length - 1]}</span>
            <div class="seed-info">
                <span class="name">${data.name}</span>
                <span class="cost">${data.seedCost} 🪙</span>
            </div>
        `;
        btn.addEventListener('click', () => {
            selectSeed(key);
            closeCatalog();
        });
        seedCatalogGrid.appendChild(btn);
    }
}

function renderSuppliesCatalog() {
    suppliesCatalogGrid.innerHTML = '';
    for (const [key, data] of Object.entries(SUPPLIES_TYPES)) {
        const btn = document.createElement('button');
        btn.className = 'seed-btn';
        btn.innerHTML = `
            <span class="icon">${data.icon}</span>
            <div class="seed-info">
                <span class="name">${data.name}</span>
                <span class="cost" style="font-size:0.8rem; color:#6b21a8;">${data.desc}</span>
                <span class="cost">${data.cost} 🪙</span>
            </div>
        `;
        btn.addEventListener('click', () => {
            selectSupply(key);
            closeSupplies();
        });
        suppliesCatalogGrid.appendChild(btn);
    }
}

function selectSeed(seedKey) {
    toolButtons.forEach(b => b.classList.remove('active'));
    btnSupplies.classList.remove('active');
    btnCatalog.classList.add('active');

    currentTool = 'seed';
    currentSeed = seedKey;
    currentSupply = null;
}

function selectSupply(supplyKey) {
    toolButtons.forEach(b => b.classList.remove('active'));
    btnCatalog.classList.remove('active');
    btnSupplies.classList.add('active');

    currentTool = 'supply';
    currentSupply = supplyKey;
    currentSeed = null;
}

// Lógica de interacción
function setupEventListeners() {
    toolButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            toolButtons.forEach(b => b.classList.remove('active'));
            btnCatalog.classList.remove('active');
            btnSupplies.classList.remove('active');

            const targetBtn = e.currentTarget;
            targetBtn.classList.add('active');

            currentTool = targetBtn.dataset.tool;
            currentSeed = null;
            currentSupply = null;
        });
    });

    btnNextDay.addEventListener('click', () => {
        btnNextDay.disabled = true;
        advanceDaySequence();
    });

    btnReset.addEventListener('click', () => {
        if (confirm('¿Estás seguro de reiniciar todo tu progreso? ¡Esta acción no se puede deshacer!')) {
            localStorage.removeItem('huertoState');
            location.reload();
        }
    });

    if (btnTheme) {
        btnTheme.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            btnTheme.textContent = isDark ? '☀️' : '🌙';
            localStorage.setItem('huertoTheme', isDark ? 'dark' : 'light');
        });
    }

    btnFlorist.addEventListener('click', openFlorist);
    btnCloseFlorist.addEventListener('click', closeFlorist);

    btnCatalog.addEventListener('click', () => catalogModal.classList.remove('hidden'));
    btnCloseCatalog.addEventListener('click', closeCatalog);

    btnSupplies.addEventListener('click', () => suppliesModal.classList.remove('hidden'));
    btnCloseSupplies.addEventListener('click', closeSupplies);
}

function closeCatalog() {
    catalogModal.classList.add('hidden');
}

function closeSupplies() {
    suppliesModal.classList.add('hidden');
}

function handlePlotClick(plotId, plotEl) {
    const plot = gameState.plots[plotId];

    if (currentTool === 'water') {
        if (!plot.isWet) {
            plot.isWet = true;
            if (plot.plant) plot.plant.daysDry = 0;
            const waterEffect = document.createElement('div');
            waterEffect.className = 'water-effect';
            plotEl.appendChild(waterEffect);
            setTimeout(() => waterEffect.remove(), 500);
            saveState();
            renderGrid();
        }
    }
    else if (currentTool === 'seed' && currentSeed) {
        if (!plot.plant) {
            if (currentSeed === 'iceflower' && SEASONS[gameState.seasonIndex] !== 'winter') {
                shakeElement(plotEl);
                alert("¡La Flor de Hielo solo se puede plantar en Invierno!");
                return;
            }

            const seedData = PLANT_TYPES[currentSeed];
            if (gameState.coins >= seedData.seedCost) {
                gameState.coins -= seedData.seedCost;
                plot.plant = {
                    type: currentSeed,
                    stageIndex: 0,
                    age: 0,
                    daysDry: 0,
                    isDead: false
                };
                updateStats();
                saveState();
                renderGrid();
            } else {
                shakeElement(plotEl);
            }
        }
    }
    else if (currentTool === 'supply' && currentSupply) {
        const supplyData = SUPPLIES_TYPES[currentSupply];

        if (currentSupply === 'magic_water') {
            if (gameState.coins >= supplyData.cost) {
                gameState.coins -= supplyData.cost;
                gameState.plots.forEach(p => {
                    p.isWet = true;
                    if (p.plant) p.plant.daysDry = 0;
                });
                document.querySelectorAll('.plot').forEach(pel => {
                    const waterEffect = document.createElement('div');
                    waterEffect.className = 'water-effect';
                    pel.appendChild(waterEffect);
                    setTimeout(() => waterEffect.remove(), 500);
                });
                updateStats(); saveState(); renderGrid();

                // Reiniciar herramienta a regadera por comodidad
                currentTool = 'water';
                currentSupply = null;
                btnSupplies.classList.remove('active');
                document.getElementById('tool-water').classList.add('active');
            } else {
                shakeElement(plotEl);
            }
            return;
        }

        // Resto de suministros necesitan planta
        if (!plot.plant) {
            shakeElement(plotEl);
            return;
        }

        if (currentSupply === 'fertilizer_basic') {
            if (!plot.plant.isDead) {
                const typeData = PLANT_TYPES[plot.plant.type];
                if (plot.plant.stageIndex < typeData.stages.length - 1) {
                    if (gameState.coins >= supplyData.cost) {
                        gameState.coins -= supplyData.cost;
                        plot.plant.stageIndex++;
                        plot.plant.age = 0;
                        spawnIconAnimation(plotEl, '✨');
                        updateStats(); saveState(); renderGrid();
                    } else shakeElement(plotEl);
                }
            } else shakeElement(plotEl);
        }
        else if (currentSupply === 'fertilizer_premium') {
            if (!plot.plant.isDead) {
                const typeData = PLANT_TYPES[plot.plant.type];
                if (plot.plant.stageIndex < typeData.stages.length - 1) {
                    if (gameState.coins >= supplyData.cost) {
                        gameState.coins -= supplyData.cost;
                        plot.plant.stageIndex = typeData.stages.length - 1;
                        plot.plant.age = 0;
                        spawnIconAnimation(plotEl, '🌟');
                        updateStats(); saveState(); renderGrid();
                    } else shakeElement(plotEl);
                }
            } else shakeElement(plotEl);
        }
        else if (currentSupply === 'revive_potion') {
            if (plot.plant.isDead) {
                if (gameState.coins >= supplyData.cost) {
                    gameState.coins -= supplyData.cost;
                    plot.plant.isDead = false;
                    plot.plant.daysDry = 0;
                    plot.isWet = true;
                    spawnIconAnimation(plotEl, '💊');
                    updateStats(); saveState(); renderGrid();
                } else shakeElement(plotEl);
            } else shakeElement(plotEl);
        }
    }
    else if (currentTool === 'harvest') {
        if (plot.plant) {
            if (!plot.plant.isDead) {
                const typeData = PLANT_TYPES[plot.plant.type];
                const isFullyGrown = plot.plant.stageIndex === typeData.stages.length - 1;

                if (isFullyGrown) {
                    gameState.inventory[plot.plant.type]++;
                    const flowerIcon = PLANT_ICONS[plot.plant.type] || '🌸';
                    spawnIconAnimation(plotEl, flowerIcon);
                    plot.plant = null;
                    updateStats();
                    saveState();
                    renderGrid();
                }
            }
        }
    }
    else if (currentTool === 'shovel') {
        if (plot.plant) {
            if (plot.plant.isDead) {
                gameState.inventory.trash++;
                spawnIconAnimation(plotEl, '🗑️');
                plot.plant = null;
                saveState();
                renderGrid();
            } else if (plot.plant.stageIndex === 0 && plot.plant.age === 0) {
                const refund = PLANT_TYPES[plot.plant.type].seedCost;
                gameState.coins += refund;
                spawnIconAnimation(plotEl, '🪙');
                plot.plant = null;
                updateStats();
                saveState();
                renderGrid();
            } else {
                if (confirm('¿Estás seguro de arrancar esta planta? No recuperarás tu dinero.')) {
                    plot.plant = null;
                    saveState();
                    renderGrid();
                }
            }
        }
    }
}

function shakeElement(el) {
    el.style.animation = 'shake 0.5s';
    setTimeout(() => el.style.animation = '', 500);
}

function spawnIconAnimation(parentElement, iconChar) {
    const iconEl = document.createElement('div');
    iconEl.className = 'coin-anim';
    iconEl.textContent = iconChar;
    parentElement.appendChild(iconEl);
    setTimeout(() => iconEl.remove(), 1000);
}

// ---- Lógica de Floristería ----
function openFlorist() {
    renderInventory();
    renderRecipes();
    floristModal.classList.remove('hidden');
}

function closeFlorist() {
    floristModal.classList.add('hidden');
}

function renderInventory() {
    inventoryGrid.innerHTML = '';
    for (const [type, count] of Object.entries(gameState.inventory)) {
        if (count > 0 || type === 'trash') {
            const item = document.createElement('div');
            item.className = 'inventory-item';
            if (type === 'trash') item.style.background = '#ffebee';
            item.innerHTML = `
                <span class="icon">${PLANT_ICONS[type] || '🌸'}</span>
                <span class="count" ${type === 'trash' ? 'style="color: #d32f2f; background: #ffcdd2;"' : ''}>${count}</span>
            `;
            inventoryGrid.appendChild(item);
        }
    }
}

function renderRecipes() {
    recipesList.innerHTML = '';
    RECIPES.forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'recipe-card';

        let ingredientsHtml = '';
        let canCraft = true;

        for (const [type, required] of Object.entries(recipe.ingredients)) {
            const has = gameState.inventory[type] || 0;
            if (has < required) canCraft = false;
            for (let i = 0; i < required; i++) {
                ingredientsHtml += `<span class="ingredient">${PLANT_ICONS[type] || '🌸'}</span>`;
            }
        }

        card.innerHTML = `
            <div class="recipe-info">
                <span class="recipe-title">${recipe.icon} ${recipe.name}</span>
                <div class="recipe-ingredients">
                    ${ingredientsHtml}
                </div>
            </div>
            <div class="recipe-action">
                <span class="recipe-price">+${recipe.price} 🪙</span>
                <button class="craft-btn" ${canCraft ? '' : 'disabled'}>Armar y Vender</button>
            </div>
        `;

        const craftBtn = card.querySelector('.craft-btn');
        craftBtn.addEventListener('click', () => craftBouquet(recipe, card));
        recipesList.appendChild(card);
    });
}

function craftBouquet(recipe, cardElement) {
    let canCraft = true;
    for (const [type, required] of Object.entries(recipe.ingredients)) {
        if ((gameState.inventory[type] || 0) < required) canCraft = false;
    }

    if (canCraft) {
        for (const [type, required] of Object.entries(recipe.ingredients)) {
            gameState.inventory[type] -= required;
        }
        gameState.coins += recipe.price;
        cardElement.classList.add('crafting-anim');
        setTimeout(() => cardElement.classList.remove('crafting-anim'), 500);

        saveState();
        updateStats();
        renderInventory();
        renderRecipes();
    }
}

// Lógica de tiempo
function advanceDaySequence() {
    nightLayer.classList.add('active');

    setTimeout(() => {
        processNextDayLogic();
        updateEnvironmentVisuals();
        renderGrid();

        nightLayer.classList.remove('active');
        btnNextDay.disabled = false;
    }, 1500);
}

function generateWeather() {
    const season = SEASONS[gameState.seasonIndex];
    let possibleWeather = ['sunny', 'cloudy', 'rainy'];

    if (season === 'winter') {
        possibleWeather = ['sunny', 'cloudy', 'snowy'];
    }

    const rand = Math.random();
    if (season === 'summer') {
        if (rand < 0.6) return 'sunny';
        if (rand < 0.8) return 'cloudy';
        return 'rainy';
    } else if (season === 'winter') {
        if (rand < 0.3) return 'sunny';
        if (rand < 0.5) return 'cloudy';
        return 'snowy';
    } else {
        if (rand < 0.33) return 'sunny';
        if (rand < 0.66) return 'cloudy';
        return 'rainy';
    }
}

function processNextDayLogic() {
    gameState.totalDays++;
    gameState.day++;

    if (gameState.day > 7) {
        gameState.day = 1;
        gameState.seasonIndex = (gameState.seasonIndex + 1) % 4;
    }

    gameState.weather = generateWeather();
    const season = SEASONS[gameState.seasonIndex];
    const isSummerSunny = season === 'summer' && gameState.weather === 'sunny';

    gameState.plots.forEach(plot => {
        if (gameState.weather === 'rainy' || gameState.weather === 'snowy') {
            plot.isWet = true;
        }

        if (plot.plant && !plot.plant.isDead) {
            const typeData = PLANT_TYPES[plot.plant.type];

            if (plot.plant.type === 'iceflower' && season !== 'winter') {
                plot.plant.isDead = true;
            }
            else {
                let isCactus = plot.plant.type === 'cactus';

                if (plot.isWet) {
                    plot.plant.age++;
                    if (plot.plant.age >= typeData.daysPerStage) {
                        plot.plant.age = 0;
                        if (plot.plant.stageIndex < typeData.stages.length - 1) {
                            plot.plant.stageIndex++;
                        }
                    }
                    plot.plant.daysDry = 0;
                } else {
                    plot.plant.daysDry++;

                    if (isCactus) {
                        if (plot.plant.daysDry >= 4) plot.plant.isDead = true;
                    } else {
                        if (isSummerSunny && plot.plant.daysDry >= 1) {
                            plot.plant.isDead = true;
                        }
                        else if (plot.plant.daysDry >= 2) {
                            plot.plant.isDead = true;
                        }
                    }
                }
            }
        }

        plot.isWet = false;
    });

    updateStats();
    saveState();
}

document.addEventListener('DOMContentLoaded', initGame);

const style = document.createElement('style');
style.innerHTML = `
@keyframes shake {
  0% { transform: translate(1px, 1px) rotate(0deg); }
  10% { transform: translate(-1px, -2px) rotate(-1deg); }
  20% { transform: translate(-3px, 0px) rotate(1deg); }
  30% { transform: translate(3px, 2px) rotate(0deg); }
  40% { transform: translate(1px, -1px) rotate(1deg); }
  50% { transform: translate(-1px, 2px) rotate(-1deg); }
  60% { transform: translate(-3px, 1px) rotate(0deg); }
  70% { transform: translate(3px, 1px) rotate(-1deg); }
  80% { transform: translate(-1px, -1px) rotate(1deg); }
  90% { transform: translate(1px, 2px) rotate(0deg); }
  100% { transform: translate(1px, -2px) rotate(-1deg); }
}`;
document.head.appendChild(style);
