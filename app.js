const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const FRUTAS = ["Manzana", "Pera", "Banana", "Mandarina", "Arándanos"];

let menu = JSON.parse(localStorage.getItem("menu")) || {};
let recetasExternas = JSON.parse(localStorage.getItem("recetasExternas")) || [];

const CONSEJOS_DIARIOS = [
    "Activación: Remojá las nueces 8h para eliminar antinutrientes.",
    "Lino y Chía: Trituralas antes de comer para absorber su Omega 3.",
    "Sésamo: Es una fuente de calcio superior a los lácteos.",
    "Magnesio: Las semillas de zapallo son el mejor relajante natural.",
    "Cúrcuma + Pimienta: Activa el poder antiinflamatorio.",
    "Caldo de Huesos: Colágeno barato para el intestino.",
    "Vinagre de Manzana: Reduce picos de glucosa antes de comer."
];

// RECETAS MÁS DETALLADAS
const RECETAS_BASE = {
    "Guiso de Lentejas y Girasol": { 
        ingredients: [{ing: "lentejas", qty: 200, unit: "g"}, {ing: "zapallo", qty: 400, unit: "g"}, {ing: "semillas girasol", qty: 30, unit: "g"}], 
        instrucciones: "1. Remojar lentejas 8h. 2. Hervir con cubos de zapallo y cúrcuma por 20 min hasta que esté tierno. 3. Al servir, agregar las semillas de girasol crudas para mantener sus grasas intactas." 
    },
    "Nuggets de Pollo y Almendras": { 
        ingredients: [{ing: "pechuga", qty: 400, unit: "g"}, {ing: "harina almendras", qty: 100, unit: "g"}, {ing: "huevo", qty: 1, unit: "u"}], 
        instrucciones: "1. Cortar pollo en cubos. 2. Pasar por huevo batido y luego por almendras trituradas (harina). 3. Hornear 20 min a 180°C hasta dorar. Sin harinas blancas!" 
    },
    "Tacos de Lechuga y Nueces": { 
        ingredients: [{ing: "pollo", qty: 400, unit: "g"}, {ing: "nueces", qty: 50, unit: "g"}, {ing: "palta", qty: 1, unit: "u"}, {ing: "lechuga", qty: 1, unit: "plantas"}], 
        instrucciones: "1. Saltear el pollo con especias. 2. Picar las nueces. 3. Usar las hojas de lechuga como tortillas, rellenar con pollo, palta y el toque crocante de las nueces." 
    },
    "Tortilla de Garbanzos y Lino": { 
        ingredients: [{ing: "harina garbanzo", qty: 150, unit: "g"}, {ing: "lino molido", qty: 20, unit: "g"}, {ing: "espinaca", qty: 1, unit: "atado"}], 
        instrucciones: "1. Mezclar harina de garbanzo con agua hasta que parezca huevo batido. 2. Sumar lino y espinaca picada. 3. Cocinar en sartén tapada 5 min por lado." 
    }
};

const DESAYUNOS_EXPERT = {
    "Pancakes de Banana y Coco": { 
        ingredients: [{ing: "huevo", qty: 2, unit: "u"}, {ing: "banana", qty: 1, unit: "u"}, {ing: "coco", qty: 2, unit: "cdas"}], 
        instrucciones: "1. Pisar bien la banana. 2. Batir con los huevos y el coco. 3. Cocinar en sartén antiadherente a fuego mínimo hasta que burbujee, dar vuelta." 
    },
    "Chiapudding con Nueces": { 
        ingredients: [{ing: "chía", qty: 3, unit: "cdas"}, {ing: "leche coco", qty: 200, unit: "ml"}, {ing: "nueces", qty: 30, unit: "g"}], 
        instrucciones: "1. Mezclar chía y leche de coco en un frasco. 2. Batir bien y dejar en heladera mínimo 4h (ideal toda la noche). 3. Sumar nueces picadas antes de comer." 
    }
};

// --- BUSCADOR INTELIGENTE ---
function buscarRecetaPorIngrediente() {
    const input = document.getElementById("inventory-input").value.toLowerCase();
    const res = document.getElementById("search-result");
    
    if(!input) return;

    // Lógica de sugerencias variadas
    let sugerencias = `
        <div class="search-suggestions">
            <p><strong>Basado en lo que tenés, te sugiero estas 3 variantes:</strong></p>
            <div class="option">
                <p><strong>1. Opción Caliente (Cuchara):</strong> Herví el <strong>${input}</strong> con zapallo y jengibre. Al final, procesalo para hacer una crema nutritiva y sumale un puñado de semillas de sésamo.</p>
            </div>
            <div class="option">
                <p><strong>2. Opción Seca (Horno/Sartén):</strong> Mezclá <strong>${input}</strong> con 2 huevos y lino molido. Hacé pequeñas hamburguesas y doralas 5 min de cada lado. Quedan crocantes sin usar pan rallado.</p>
            </div>
            <div class="option">
                <p><strong>3. Opción Proteica:</strong> Sellá <strong>${input}</strong> con aceite de coco y pimienta. Acompañalo con una ensalada de hojas verdes y almendras troceadas para la saciedad.</p>
            </div>
            <button onclick="aplicarHoyPersonalizado('${input}')" class="btn-primary" style="margin-top:10px;">🍽️ Aplicar ingrediente al menú de hoy</button>
        </div>
    `;
    
    res.innerHTML = sugerencias;
    res.style.display = "block";
}

function aplicarHoyPersonalizado(ing) {
    const hoy = days[(new Date().getDay() + 6) % 7];
    menu[hoy].cena = `Plato especial con ${ing}`;
    menu[hoy].ingredients = [{ing: ing, qty: 200, unit: "g"}, {ing: "Mix Semillas", qty: 30, unit: "g"}];
    saveAndRender();
    alert(`¡Listo! Agregué ${ing} a tu cena de hoy.`);
}

function generateSmartMenu() {
    const mult = document.getElementById("servings-selector").value / 2;
    let poolCenas = [...Object.keys(RECETAS_BASE), ...recetasExternas.map(r => r.nombre)];
    
    days.forEach(day => {
        if (poolCenas.length === 0) poolCenas = [...Object.keys(RECETAS_BASE), ...recetasExternas.map(r => r.nombre)];
        const cenaNombre = poolCenas.splice(Math.floor(Math.random() * poolCenas.length), 1)[0];
        const desElegido = Object.keys(DESAYUNOS_EXPERT)[Math.floor(Math.random() * 2)];
        
        let dCena = RECETAS_BASE[cenaNombre] || recetasExternas.find(r => r.nombre === cenaNombre);
        let dDesayuno = DESAYUNOS_EXPERT[desElegido];
        
        menu[day] = { 
            desayuno: desElegido, 
            cena: cenaNombre, 
            isExternal: !!dCena.isExternal, 
            url: dCena.url || null, 
            ingredients: [
                ...(dCena.ingredients || []).map(i => ({...i, qty: i.qty * mult})),
                ...(dDesayuno.ingredients || []).map(i => ({...i, qty: i.qty}))
            ] 
        };
    });
    saveAndRender();
}

function generateShoppingList() {
    let list = {};
    Object.values(menu).forEach(day => {
        if (day.ingredients) {
            day.ingredients.forEach(i => {
                let nombre = i.ing.toLowerCase().trim();
                if (!list[nombre]) list[nombre] = {q: 0, u: i.unit};
                list[nombre].q += i.qty;
            });
        }
    });

    const container = document.getElementById("shopping-list");
    if (Object.keys(list).length === 0) {
        container.innerHTML = "<li>No hay ingredientes. Generá un menú primero.</li>";
    } else {
        container.innerHTML = Object.entries(list)
            .map(([n, d]) => `<li><input type="checkbox"> ${Math.ceil(d.q)}${d.u} ${n}</li>`)
            .join("");
    }
}

function saveAndRender() {
    localStorage.setItem("menu", JSON.stringify(menu));
    localStorage.setItem("recetasExternas", JSON.stringify(recetasExternas));
    renderAll();
}

function renderAll() {
    const grid = document.getElementById("menu-grid");
    if (grid) {
        grid.innerHTML = days.map(day => {
            const d = menu[day] || {desayuno: "-", cena: "-"};
            return `<div class="day-card" onclick="showRecipe('${day}')"><h3>${day}</h3><p>☀️ ${d.desayuno}</p><p>🌙 ${d.cena}</p></div>`;
        }).join("");
    }
    document.getElementById("daily-tip-text").innerText = CONSEJOS_DIARIOS[new Date().getDate() % CONSEJOS_DIARIOS.length];
    generateShoppingList();
}

function showRecipe(day) {
    const d = menu[day];
    if (!d) return;
    let desInfo = DESAYUNOS_EXPERT[d.desayuno];
    let cenaInfo = RECETAS_BASE[d.cena] || recetasExternas.find(r => r.nombre === d.cena);
    
    let cenaHtml = d.isExternal ? 
        `<a href="${d.url}" target="_blank" class="btn-link">📺 Ver Video Tutorial</a>` : 
        `<p><strong>Preparación:</strong><br>${cenaInfo?.instrucciones || 'Mezclar los ingredientes y cocinar a fuego medio.'}</p>`;
    
    document.getElementById("recipe-detail").innerHTML = `
        <h2 style="color:var(--primary)">☀️ ${d.desayuno}</h2>
        <p>${desInfo ? desInfo.instrucciones : '-'}</p>
        <hr>
        <h2 style="color:var(--primary)">🌙 ${d.cena}</h2>
        ${cenaHtml}
    `;
    document.getElementById("recipe-modal").style.display = "flex";
}

function saveExternalRecipe() {
    const n = document.getElementById("ext-name").value;
    const u = document.getElementById("ext-url").value;
    const rawIng = document.getElementById("ext-ingredients").value;
    if(n && u) {
        let ingredientes = [];
        rawIng.split("\n").forEach(linea => {
            if(linea.trim()) {
                const parts = linea.match(/(\d+)?\s*(\w+)?\s*(.*)/);
                ingredientes.push({
                    qty: parseInt(parts[1]) || 1,
                    unit: parts[2] || "u",
                    ing: parts[3] || linea.trim()
                });
            }
        });
        recetasExternas.push({nombre: n, url: u, isExternal: true, ingredients: ingredientes});
        saveAndRender();
        alert("¡Receta detallada guardada!");
    }
}

function openLibrary() { 
    const list = document.getElementById("library-list");
    const todas = [...Object.keys(RECETAS_BASE), ...recetasExternas.map(r => r.nombre)];
    list.innerHTML = todas.map(n => `<div class="lib-item" onclick="showLibraryRecipe('${n}')">📖 ${n}</div>`).join("");
    document.getElementById("library-modal").style.display = "flex"; 
}

function showLibraryRecipe(n) { 
    closeModal('library-modal'); 
    let d = RECETAS_BASE[n] || recetasExternas.find(r => r.nombre === n);
    let html = `<h2>${n}</h2>${d.isExternal ? `<a href="${d.url}" target="_blank" class="btn-link">📺 Ver Video</a>` : `<p>${d.instrucciones}</p>`}`;
    html += `<button onclick="aplicarHoy('${n}')" class="btn-primary" style="margin-top:20px;">🍽️ Usar esta receta hoy</button>`;
    document.getElementById("recipe-detail").innerHTML = html;
    document.getElementById("recipe-modal").style.display = "flex"; 
}

function aplicarHoy(nombre) {
    const hoy = days[(new Date().getDay() + 6) % 7];
    let d = RECETAS_BASE[nombre] || recetasExternas.find(r => r.nombre === nombre);
    menu[hoy].cena = nombre;
    menu[hoy].isExternal = !!d.isExternal;
    menu[hoy].url = d.url || null;
    menu[hoy].ingredients = d.ingredients || [];
    saveAndRender(); closeModal('recipe-modal');
}

function closeModal(id) { document.getElementById(id).style.display = "none"; }
function openAdvisor() { document.getElementById("advisor-modal").style.display = "flex"; }
function consultarAsesor() { alert("Priorizá alimentos reales."); }

renderAll();
