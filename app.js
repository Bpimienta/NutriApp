const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const FRUTAS = ["Manzana", "Pera", "Banana", "Mandarina", "Arándanos"];

// --- 🛡️ MOTOR DE PERSISTENCIA ---
let menu = JSON.parse(localStorage.getItem("menu")) || {};
let recetasExternas = JSON.parse(localStorage.getItem("recetasExternas")) || [];
let infoHemeroteca = JSON.parse(localStorage.getItem("infoHemeroteca")) || [];

const CONSEJOS_DIARIOS = [
    "Activación: Remojá las nueces 8h para eliminar antinutrientes.",
    "Lino y Chía: Trituralas antes de comer para absorber su Omega 3.",
    "Sésamo: Es una fuente de calcio superior a los lácteos.",
    "Girasol: Aporta Vitamina E, ideal para la salud de la piel.",
    "Snack inteligente: Un puñado de almendras calma la ansiedad.",
    "Vinagre de Manzana: Reduce picos de glucosa antes de comer.",
    "Magnesio: Las semillas de zapallo son el mejor relajante muscular.",
    "Cúrcuma + Pimienta: Activa el poder antiinflamatorio.",
    "Caminata: 10 min post-cena mejora la digestión.",
    "Luz Solar: 15 min mañana regula el sueño.",
    "Proteína al Desayuno: Evita antojos dulces luego.",
    "Harina de Coco: Una opción keto y sin gluten para tus pancakes.",
    "Almidón Resistente: Arroz frío de ayer es mejor fibra.",
    "Hidratación: Bebe agua fuera de las comidas.",
    "Masticación: Muerde 20 veces cada bocado.",
    "Caldo de Huesos: Colágeno barato para el intestino.",
    "Evita JMAF: El jarabe de maíz es el enemigo #1.",
    "Dormir: Oscuridad total mejora el metabolismo.",
    "Fruta Entera: Siempre mejor que el jugo.",
    "Hígado: Multivitamínico natural, una vez por semana.",
    "Aceite de Oliva: Úsalo en crudo, no lo calientes demasiado.",
    "Cenas Tempranas: Deja 3h antes de dormir.",
    "Legumbres: Remójalas con vinagre 12h.",
    "Probióticos: El kéfir de agua es salud intestinal pura.",
    "Huevo: Esencial para tus hormonas y cerebro.",
    "Jengibre: Mejora la motilidad intestinal.",
    "Sal de Mar: Aporta minerales esenciales.",
    "Frutos Secos: No los tuestes con azúcar ni mucha sal.",
    "Vitamina C: El morrón rojo tiene más que la naranja.",
    "Ducha Fría: Un minuto al final activa la grasa parda.",
    "Gratitud: Comer relajado mejora la absorción."
];

const RECETAS_BASE = {
    "Guiso de Lentejas Turcas": { ingredients: [{ing: "lentejas turcas", qty: 200, unit: "g"}, {ing: "zapallo", qty: 400, unit: "g"}, {ing: "semillas girasol", qty: 30, unit: "g"}], remojo: "lentejas", instrucciones: "Cocinar 15 min. Sumar girasol al final.", beneficio: "Hierro y Zinc." },
    "Nuggets de Pollo y Almendras": { ingredients: [{ing: "pechuga", qty: 400, unit: "g"}, {ing: "harina almendras", qty: 100, unit: "g"}], instrucciones: "Empanar con almendras trituradas y hornear.", beneficio: "Proteína limpia." },
    "Tacos de Lechuga y Nueces": { ingredients: [{ing: "pollo", qty: 400, unit: "g"}, {ing: "nueces", qty: 50, unit: "g"}, {ing: "palta", qty: 1, unit: "u"}], instrucciones: "Usar lechuga como wrap y sumar nueces picadas.", beneficio: "Grasas sanas." },
    "Hamburguesas de Mijo y Sésamo": { ingredients: [{ing: "mijo", qty: 300, unit: "g"}, {ing: "sésamo", qty: 20, unit: "g"}], remojo: "mijo", instrucciones: "Dorar en sartén con sésamo.", beneficio: "Calcio." },
    "Tortilla de Garbanzos y Lino": { ingredients: [{ing: "harina garbanzo", qty: 150, unit: "g"}, {ing: "lino molido", qty: 20, unit: "g"}], instrucciones: "Mezclar con agua y lino. Cocinar.", beneficio: "Fibra Omega 3." },
    "Pescado en Crosta de Semillas": { ingredients: [{ing: "pescado", qty: 400, unit: "g"}, {ing: "mix semillas", qty: 50, unit: "g"}], instrucciones: "Cubrir el pescado con semillas y hornear.", beneficio: "Omega 3 extra." },
    "Ensalada de Quinoa y Almendras": { ingredients: [{ing: "quinoa", qty: 200, unit: "g"}, {ing: "almendras", qty: 30, unit: "g"}], remojo: "quinoa", instrucciones: "Cocinar quinoa y sumar almendras fileteadas.", beneficio: "Proteína completa." }
};

const DESAYUNOS_EXPERT = {
    "Pancakes de Banana y Coco": { ingredients: [{ing: "huevo", qty: 2, unit: "u"}, {ing: "banana", qty: 1, unit: "u"}, {ing: "coco", qty: 20, unit: "g"}], instrucciones: "Mezclar huevo, banana y coco. Vuelta y vuelta." },
    "Chiapudding con Nueces": { ingredients: [{ing: "chía", qty: 3, unit: "cdas"}, {ing: "nueces", qty: 4, unit: "u"}], instrucciones: "Hidratar chía en leche vegetal. Sumar nueces arriba." },
    "Yogur con Mix de Semillas": { ingredients: [{ing: "yogur natural", qty: 200, unit: "g"}, {ing: "mix semillas", qty: 2, unit: "cdas"}], instrucciones: "Mezclar yogur (sin azúcar) con semillas activadas." }
};

function generateSmartMenu() {
    const mult = document.getElementById("servings-selector").value / 2;
    let poolCenas = [...Object.keys(RECETAS_BASE), ...recetasExternas.map(r => r.nombre)];
    
    days.forEach(day => {
        if (poolCenas.length === 0) poolCenas = [...Object.keys(RECETAS_BASE), ...recetasExternas.map(r => r.nombre)];
        const cenaNombre = poolCenas.splice(Math.floor(Math.random() * poolCenas.length), 1)[0];
        const desNombres = Object.keys(DESAYUNOS_EXPERT);
        const desElegido = desNombres[Math.floor(Math.random() * desNombres.length)];
        const fruta = FRUTAS[Math.floor(Math.random() * FRUTAS.length)];
        
        let dCena = RECETAS_BASE[cenaNombre] || recetasExternas.find(r => r.nombre === cenaNombre);
        let dDesayuno = DESAYUNOS_EXPERT[desElegido];
        
        menu[day] = { 
            desayuno: desElegido, 
            cena: cenaNombre, 
            isExternal: !!dCena.isExternal, 
            url: dCena.url || null, 
            remojo: dCena.remojo || null, 
            ingredients: [
                ...(dCena.ingredients || []).map(i => ({...i, qty: i.qty * mult})),
                ...(dDesayuno.ingredients || []).map(i => ({...i, qty: i.qty})),
                {ing: fruta, qty: 1, unit: "u"}
            ] 
        };
    });
    saveAndRender();
}

function saveAndRender() {
    localStorage.setItem("menu", JSON.stringify(menu));
    localStorage.setItem("recetasExternas", JSON.stringify(recetasExternas));
    localStorage.setItem("infoHemeroteca", JSON.stringify(infoHemeroteca));
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
    mostrarConsejoDelDia(); renderInfoList(); generateShoppingList(); updateReminders();
}

function showRecipe(day) {
    const d = menu[day];
    if (!d) return;
    let desInfo = DESAYUNOS_EXPERT[d.desayuno];
    let cenaHtml = d.isExternal ? `<a href="${d.url}" target="_blank" class="btn-link">📺 Ver Video Tutorial</a>` : `<p>${RECETAS_BASE[d.cena]?.instrucciones || ''}</p>`;
    
    document.getElementById("recipe-detail").innerHTML = `
        <h3>☀️ Desayuno: ${d.desayuno}</h3>
        <p>${desInfo ? desInfo.instrucciones : 'Acompañar con infusión.'}</p>
        <hr>
        <h3>🌙 Cena: ${d.cena}</h3>
        ${cenaHtml}
        <button onclick="changeSingleMeal('${day}')" style="margin-top:15px; background:#6c757d;">🎲 Cambiar Cena</button>
    `;
    document.getElementById("recipe-modal").style.display = "flex";
}

function changeSingleMeal(day) {
    let poolCenas = [...Object.keys(RECETAS_BASE), ...recetasExternas.map(r => r.nombre)];
    const cena = poolCenas[Math.floor(Math.random() * poolCenas.length)];
    let d = RECETAS_BASE[cena] || recetasExternas.find(r => r.nombre === cena);
    menu[day].cena = cena;
    menu[day].isExternal = !!d.isExternal;
    menu[day].url = d.url || null;
    menu[day].ingredients = [...(d.ingredients || []).map(i => ({...i, qty: 2})), {ing: "Fruta", qty: 1, unit: "u"}];
    saveAndRender(); showRecipe(day);
}

function saveExternalRecipe() {
    const n = document.getElementById("ext-name").value;
    const u = document.getElementById("ext-url").value;
    const rawIng = document.getElementById("ext-ingredients").value;
    if(n && u) {
        let listaProcesada = [];
        if (rawIng) {
            rawIng.split("\n").forEach(linea => {
                if (linea.trim()) {
                    const match = linea.match(/(\d+)\s*(\w*)\s*(.*)/);
                    if (match) {
                        listaProcesada.push({ qty: parseInt(match[1]) || 1, unit: match[2] || "u", ing: match[3] || linea.trim() });
                    } else {
                        listaProcesada.push({ qty: 1, unit: "u", ing: linea.trim() });
                    }
                }
            });
        }
        recetasExternas.push({nombre: n, url: u, isExternal: true, ingredients: listaProcesada}); 
        saveAndRender();
        document.getElementById("ext-name").value = ""; document.getElementById("ext-url").value = ""; document.getElementById("ext-ingredients").value = "";
        alert("¡Receta guardada!");
    }
}

function openLibrary() { 
    const list = document.getElementById("library-list");
    const todas = [...Object.keys(RECETAS_BASE), ...recetasExternas.map(r => r.nombre)];
    list.innerHTML = todas.map(n => {
        const esBase = RECETAS_BASE[n];
        return `<div class="lib-item" style="display:flex; justify-content:space-between; align-items:center;">
                    <span onclick="showLibraryRecipe('${n}')" style="flex-grow:1; cursor:pointer;">📖 ${n} ${esBase ? '' : '(Mía)'}</span>
                    ${esBase ? '' : `<button onclick="deleteUserRecipe('${n}')" style="background:red; width:auto; padding:2px 8px; margin:0;">🗑️</button>`}
                </div>`;
    }).join("");
    document.getElementById("library-modal").style.display = "flex"; 
}

function deleteUserRecipe(nombre) {
    if(confirm(`¿Borrar "${nombre}"?`)) { recetasExternas = recetasExternas.filter(r => r.nombre !== nombre); saveAndRender(); openLibrary(); }
}

function showLibraryRecipe(n) { 
    closeModal('library-modal'); 
    let d = RECETAS_BASE[n] || recetasExternas.find(r => r.nombre === n);
    let html = `<h3>${n}</h3>`;
    html += d.isExternal ? `<a href="${d.url}" target="_blank" class="btn-link">📺 Ver Video</a>` : `<p>${d.instrucciones}</p>`;
    html += `<button onclick="aplicarAlMenu('${n}')" style="margin-top:20px; background:var(--primary); color:white;">🍽️ Usar hoy</button>`;
    document.getElementById("recipe-detail").innerHTML = html;
    document.getElementById("recipe-modal").style.display = "flex"; 
}

function aplicarAlMenu(nombreReceta) { 
    const hoy = days[(new Date().getDay() + 6) % 7];
    let d = RECETAS_BASE[nombreReceta] || recetasExternas.find(r => r.nombre === nombreReceta);
    menu[hoy].cena = nombreReceta;
    menu[hoy].isExternal = !!d.isExternal;
    menu[hoy].url = d.url || null;
    menu[hoy].ingredients = [...(d.ingredients || []).map(i => ({...i, qty: 2})), {ing: "Fruta", qty: 1, unit: "u"}];
    saveAndRender(); closeModal('recipe-modal');
}

function renderInfoList() {
    document.getElementById("info-list-preview").innerHTML = infoHemeroteca.map((item, i) => `<div class="lib-item"><span>💡 ${item.nombre}</span> <button onclick="deleteInfo(${i})" style="background:red; width:auto; padding:2px 5px; margin:0;">🗑️</button></div>`).join("");
}

function deleteInfo(i) { infoHemeroteca.splice(i, 1); saveAndRender(); }
function saveInfoItem() {
    const n = document.getElementById("info-name").value, u = document.getElementById("info-url").value;
    if(n && u) { infoHemeroteca.push({nombre:n, url:u}); saveAndRender(); document.getElementById("info-name").value = ""; document.getElementById("info-url").value = ""; }
}

function buscarRecetaPorIngrediente() {
    const i = document.getElementById("inventory-input").value.toLowerCase();
    const res = document.getElementById("search-result");
    res.innerHTML = `<p>Idea: Salteado crocante con ${i} y mix de semillas.</p><button onclick="aplicarAlMenu('${i}')" class="btn-apply">Usar hoy</button>`;
    res.style.display = "block";
}

function mostrarConsejoDelDia() { document.getElementById("daily-tip-text").innerText = CONSEJOS_DIARIOS[(new Date().getDate() - 1) % 31]; }

function generateShoppingList() {
    let t = {}; 
    Object.values(menu).forEach(d => d.ingredients?.forEach(i => { if(!t[i.ing]) t[i.ing] = {q:0, u:i.unit}; t[i.ing].q += i.qty; }));
    document.getElementById("shopping-list").innerHTML = Object.entries(t).map(([n, d]) => `<li><input type="checkbox"> ${Math.ceil(d.q)}${d.u} ${n}</li>`).join("");
}

function updateReminders() { 
    const hoy = days[(new Date().getDay() + 6) % 7];
    const r = menu[hoy]?.remojo; 
    document.getElementById("reminders-section").style.display = r ? "block" : "none";
    document.getElementById("daily-reminder").innerText = r || "";
}

function closeModal(id) { document.getElementById(id).style.display = "none"; }
function openAdvisor() { document.getElementById("advisor-modal").style.display = "flex"; }
function consultarAsesor() { alert("Priorizá alimentos reales."); }

renderAll();
