const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const FRUTAS = ["Manzana", "Pera", "Banana", "Mandarina", "Arándanos"];

let menu = JSON.parse(localStorage.getItem("menu")) || {};
let recetasExternas = JSON.parse(localStorage.getItem("recetasExternas")) || [];

const CONSEJOS_DIARIOS = [
    "Activación: Remojá las nueces 8h para eliminar antinutrientes.",
    "Lino y Chía: Trituralas antes de comer para absorber su Omega 3.",
    "Sésamo: Es una fuente de calcio superior a los lácteos.",
    "Girasol: Aporta Vitamina E, ideal para la salud de la piel.",
    "Snack inteligente: Un puñado de almendras calma la ansiedad.",
    "Magnesio: Las semillas de zapallo son el mejor relajante natural.",
    "Cúrcuma + Pimienta: Activa el poder antiinflamatorio.",
    "Caldo de Huesos: Colágeno barato para el intestino.",
    "Frutos Secos: No los tuestes con azúcar ni aceites vegetales.",
    "Ducha Fría: Un minuto al final activa la grasa parda.",
    "Hidratación: Bebe agua fuera de las comidas."
];

const RECETAS_BASE = {
    "Guiso de Lentejas y Girasol": { ingredients: [{ing: "lentejas", qty: 200, unit: "g"}, {ing: "zapallo", qty: 400, unit: "g"}, {ing: "semillas girasol", qty: 30, unit: "g"}], remojo: "lentejas", instrucciones: "Cocinar lentejas y zapallo. Sumar girasol al servir." },
    "Nuggets de Pollo y Almendras": { ingredients: [{ing: "pechuga", qty: 400, unit: "g"}, {ing: "harina almendras", qty: 100, unit: "g"}], instrucciones: "Empanar el pollo con las almendras procesadas. Hornear." },
    "Tacos de Lechuga y Nueces": { ingredients: [{ing: "pollo", qty: 400, unit: "g"}, {ing: "nueces", qty: 50, unit: "g"}, {ing: "palta", qty: 1, unit: "u"}], instrucciones: "Usar lechuga como wrap. Sumar nueces picadas para el crocante." },
    "Tortilla de Garbanzos y Lino": { ingredients: [{ing: "harina garbanzo", qty: 150, unit: "g"}, {ing: "lino molido", qty: 20, unit: "g"}], instrucciones: "Mezclar ingredientes con agua hasta formar pasta. Cocinar." },
    "Pescado en Crosta de Semillas": { ingredients: [{ing: "pescado", qty: 400, unit: "g"}, {ing: "mix semillas", qty: 50, unit: "g"}], instrucciones: "Cubrir el pescado con las semillas y llevar al horno." }
};

const DESAYUNOS_EXPERT = {
    "Pancakes de Banana y Coco": { ingredients: [{ing: "huevo", qty: 2, unit: "u"}, {ing: "banana", qty: 1, unit: "u"}], instrucciones: "Pisar banana, mezclar con huevo. Vuelta y vuelta." },
    "Chiapudding con Nueces": { ingredients: [{ing: "chía", qty: 3, unit: "cdas"}, {ing: "nueces", qty: 30, unit: "g"}], instrucciones: "Hidratar chía 8hs. Decorar con nueces activadas." },
    "Yogur con Mix de Semillas": { ingredients: [{ing: "yogur natural", qty: 200, unit: "g"}, {ing: "mix semillas", qty: 2, unit: "cdas"}], instrucciones: "Mezclar yogur (sin azúcar) con semillas de sésamo y zapallo." }
};

function generateSmartMenu() {
    const mult = document.getElementById("servings-selector").value / 2;
    let poolCenas = [...Object.keys(RECETAS_BASE), ...recetasExternas.map(r => r.nombre)];
    
    days.forEach(day => {
        if (poolCenas.length === 0) poolCenas = [...Object.keys(RECETAS_BASE), ...recetasExternas.map(r => r.nombre)];
        const cenaNombre = poolCenas.splice(Math.floor(Math.random() * poolCenas.length), 1)[0];
        const desNombres = Object.keys(DESAYUNOS_EXPERT);
        const desElegido = desNombres[Math.floor(Math.random() * desNombres.length)];
        
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
    let cenaHtml = d.isExternal ? `<a href="${d.url}" target="_blank" class="btn-link">📺 Ver Tutorial</a>` : `<p>${RECETAS_BASE[d.cena]?.instrucciones || 'Sin instrucciones.'}</p>`;
    
    document.getElementById("recipe-detail").innerHTML = `
        <h3>☀️ Desayuno: ${d.desayuno}</h3>
        <p>${desInfo ? desInfo.instrucciones : '-'}</p>
        <hr>
        <h3>🌙 Cena: ${d.cena}</h3>
        ${cenaHtml}
    `;
    document.getElementById("recipe-modal").style.display = "flex";
}

function generateShoppingList() {
    let list = {};
    Object.values(menu).forEach(day => {
        day.ingredients?.forEach(i => {
            if (!list[i.ing]) list[i.ing] = {q: 0, u: i.unit};
            list[i.ing].q += i.qty;
        });
    });
    document.getElementById("shopping-list").innerHTML = Object.entries(list).map(([n, d]) => `<li><input type="checkbox"> ${Math.ceil(d.q)}${d.u} ${n}</li>`).join("");
}

function saveExternalRecipe() {
    const n = document.getElementById("ext-name").value;
    const u = document.getElementById("ext-url").value;
    const rawIng = document.getElementById("ext-ingredients").value;
    if(n && u) {
        let ingredientes = [];
        rawIng.split("\n").forEach(linea => {
            if(linea.trim()) ingredientes.push({qty: 1, unit: "u", ing: linea.trim()});
        });
        recetasExternas.push({nombre: n, url: u, isExternal: true, ingredients: ingredientes});
        saveAndRender();
        document.getElementById("ext-name").value = ""; document.getElementById("ext-url").value = ""; document.getElementById("ext-ingredients").value = "";
        alert("¡Receta guardada!");
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
    let html = `<h3>${n}</h3>${d.isExternal ? `<a href="${d.url}" target="_blank" class="btn-link">📺 Ver Video</a>` : `<p>${d.instrucciones}</p>`}`;
    html += `<button onclick="aplicarHoy('${n}')" style="margin-top:20px; background:var(--primary); color:white;">🍽️ Usar Hoy</button>`;
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
