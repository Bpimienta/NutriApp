const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const FRUTAS = ["Manzana", "Pera", "Banana", "Mandarina", "Arándanos"];

let menu = JSON.parse(localStorage.getItem("menu")) || {};
let recetasExternas = JSON.parse(localStorage.getItem("recetasExternas")) || [];
let infoHemeroteca = JSON.parse(localStorage.getItem("infoHemeroteca")) || [];

const CONSEJOS_DIARIOS = [
    "Hibiscus: Antioxidante potente, ideal para la presión.",
    "Regla 80/20: Come hasta estar 80% lleno.",
    "Vinagre de Manzana: Reduce picos de glucosa antes de comer.",
    "Magnesio: Semillas de zapallo son una fuente económica.",
    "Cúrcuma + Pimienta: Activa el poder antiinflamatorio.",
    "Caminata: 10 min post-cena mejora la digestión.",
    "Luz Solar: 15 min mañana regula el sueño.",
    "Proteína al Desayuno: Evita antojos dulces luego.",
    "Orden: Primero fibra, luego proteína, al final carbos.",
    "Almidón Resistente: Arroz frío de ayer es mejor fibra.",
    "Hidratación: Bebe agua fuera de las comidas.",
    "Masticación: Muerde 20 veces cada bocado.",
    "Caldo de Huesos: Colágeno barato para el intestino.",
    "Evita JMAF: Enemigo #1 del hígado graso.",
    "Dormir: Oscuridad total mejora el metabolismo.",
    "Fruta Entera: Siempre mejor que el jugo.",
    "Hígado: Multivitamínico natural, una vez por semana.",
    "Aceite de Oliva: Úsalo en crudo para sus beneficios.",
    "Cenas Tempranas: Deja 3h antes de dormir.",
    "Legumbres: Remójalas con vinagre 12h.",
    "Probióticos: Kéfir o chucrut caseros son salud pura.",
    "Huevo: Esencial para hormonas y cerebro.",
    "Jengibre: Mejora la motilidad intestinal.",
    "Sal de Mar: Aporta minerales que la común no tiene.",
    "Grasas: Coco y manteca son estables al calor.",
    "Etiquetas: Más de 5 ingredientes = ultraprocesado.",
    "Edulcorantes: Engañan al cerebro, evítalos.",
    "Vitamina C: El morrón rojo tiene más que el cítrico.",
    "Ducha Fría: Un minuto al final activa la grasa parda.",
    "Pantallas: Apaga el celular 1h antes de dormir.",
    "Gratitud: Comer relajado mejora la absorción."
];

const SUGERENCIAS_INGREDIENTES = {
    "trigo burgol": "🥣 **Tabulé:** Hidratá el trigo burgol, sumá mucho perejil, tomate y limón. ¡Cena fresca!",
    "arroz": "🍚 **Arroz Primavera:** Salteá vegetales y sumá arroz cocido frío con un huevo.",
    "huevo": "🥚 **Shakshuka:** Huevos cocidos en salsa de tomate especiada. ¡Rápido y nutritivo!",
    "atun": "🐟 **Mousse de Atún:** Mezclá atún con palta pisada y usalo sobre hojas de lechuga.",
    "garbanzos": "🥙 **Snack Crujiente:** Horneá garbanzos cocidos con especias hasta que doren.",
    "pollo": "🍗 **Wok de Pollo:** Salteado rápido con zapallitos y cebolla."
};

const RECETAS_EXPERT = {
    "Guiso de Lentejas Turcas": { ingredients: [{ing: "lentejas turcas", qty: 200, unit: "g"}, {ing: "zapallo", qty: 400, unit: "g"}], remojo: "lentejas", instrucciones: "Cocinar 15 min con cúrcuma.", beneficio: "Hierro." },
    "Nuggets de Pollo y Avena": { ingredients: [{ing: "pechuga", qty: 400, unit: "g"}, {ing: "avena", qty: 100, unit: "g"}], instrucciones: "Empanar y hornear.", beneficio: "Proteína." },
    "Tacos de Lechuga": { ingredients: [{ing: "pollo", qty: 400, unit: "g"}, {ing: "palta", qty: 1, unit: "u"}], instrucciones: "Usar lechuga como wrap.", beneficio: "Sin harinas." },
    "Hamburguesas de Mijo": { ingredients: [{ing: "mijo", qty: 300, unit: "g"}, {ing: "zanahoria", qty: 1, unit: "u"}], remojo: "mijo", instrucciones: "Dorar en sartén.", beneficio: "Económico." },
    "Tortilla de Garbanzos": { ingredients: [{ing: "harina garbanzo", qty: 150, unit: "g"}, {ing: "espinaca", qty: 1, unit: "atado"}], instrucciones: "Mezclar con agua y cocinar.", beneficio: "Fibra." },
    "Pescado al Horno": { ingredients: [{ing: "pescado", qty: 400, unit: "g"}], instrucciones: "Hornear con limón y especias.", beneficio: "Omega 3." },
    "Bolas de Carne": { ingredients: [{ing: "carne picada", qty: 400, unit: "g"}, {ing: "tomate", qty: 200, unit: "g"}], instrucciones: "Cocinar en salsa.", beneficio: "Saciante." },
    "Quinoa con Hongos": { ingredients: [{ing: "quinoa", qty: 200, unit: "g"}], remojo: "quinoa", instrucciones: "Cocinar 15 min.", beneficio: "Completo." },
    "Revuelto Gramajo": { ingredients: [{ing: "huevo", qty: 4, unit: "u"}, {ing: "chauchas", qty: 200, unit: "g"}], instrucciones: "Saltear y revolver.", beneficio: "Rápido." },
    "Pastel de Pollo": { ingredients: [{ing: "puré zapallo", qty: 500, unit: "g"}, {ing: "pollo", qty: 400, unit: "g"}], instrucciones: "Gratinar.", beneficio: "Vitamina A." },
    "Wok de Vegetales": { ingredients: [{ing: "vegetales", qty: 500, unit: "g"}, {ing: "huevo", qty: 2, unit: "u"}], instrucciones: "Saltear fuerte.", beneficio: "Antioxidante." },
    "Sopa de Arvejas": { ingredients: [{ing: "arvejas", qty: 200, unit: "g"}], remojo: "arvejas", instrucciones: "Licuar post-hervido.", beneficio: "Barato." }
};

const DESAYUNOS_EXPERT = {
    "Chiapudding con [FRUTA]": { ingredients: [{ing: "chía", qty: 3, unit: "cdas"}], instrucciones: "Mezclar con leche de avena casera." },
    "Omelette de [FRUTA]": { ingredients: [{ing: "huevo", qty: 2, unit: "u"}], instrucciones: "Hacer omelette dulce con canela." },
    "Porridge de Avena": { ingredients: [{ing: "avena", qty: 4, unit: "cdas"}], instrucciones: "Cocinar con agua o leche." }
};

function generateSmartMenu() {
    const mult = document.getElementById("servings-selector").value / 2;
    let poolCenas = [...Object.keys(RECETAS_EXPERT), ...recetasExternas.map(r => r.nombre)];
    days.forEach(day => {
        const cena = poolCenas.splice(Math.floor(Math.random() * poolCenas.length), 1)[0] || "Sopa de Arvejas";
        const desBase = Object.keys(DESAYUNOS_EXPERT)[Math.floor(Math.random() * 3)];
        const fruta = FRUTAS[Math.floor(Math.random() * FRUTAS.length)];
        let d = RECETAS_EXPERT[cena] || recetasExternas.find(r => r.nombre === cena);
        menu[day] = { desayuno: desBase.replace("[FRUTA]", fruta), cena: cena, isExternal: !!d.isExternal, url: d.url, remojo: d.remojo, 
            ingredients: [...(d.ingredients || []).map(i => ({...i, qty: i.qty * mult})), {ing: "Huevo/Avena", qty: 1, unit: "u"}, {ing: fruta, qty: 1, unit: "u"}] };
    });
    saveAndRender();
}

function renderAll() {
    document.getElementById("menu-grid").innerHTML = days.map(day => {
        const d = menu[day] || {desayuno: "-", cena: "-"};
        return `<div class="day-card" onclick="showRecipe('${day}')"><h3>${day}</h3><p>☀️ ${d.desayuno}</p><p>🌙 ${d.cena}</p></div>`;
    }).join("");
    mostrarConsejoDelDia(); renderInfoList(); generateShoppingList(); updateReminders();
}

function showRecipe(day) {
    const d = menu[day];
    let cenaHtml = d.isExternal ? `<a href="${d.url}" target="_blank" class="btn-link">📺 Ver Video</a>` : `<p>${RECETAS_EXPERT[d.cena]?.instrucciones || ''}</p>`;
    document.getElementById("recipe-detail").innerHTML = `<h3>☀️ Desayuno</h3><p>${d.desayuno}</p><hr><h3>🌙 ${d.cena}</h3>${cenaHtml}<button onclick="changeSingleMeal('${day}')">🎲 Cambiar</button>`;
    document.getElementById("recipe-modal").style.display = "flex";
}

function changeSingleMeal(day) { generateSmartMenu(); showRecipe(day); }

function buscarRecetaPorIngrediente() {
    const i = document.getElementById("inventory-input").value.toLowerCase();
    const res = document.getElementById("search-result");
    let msg = SUGERENCIAS_INGREDIENTES[i] || "Hacé un salteado con lo que tengas y ajo.";
    res.innerHTML = `<p>${msg}</p><button onclick="aplicarAlMenu('${i}')" class="btn-apply">Usar hoy</button>`;
    res.style.display = "block";
}

function aplicarAlMenu(i) { const hoy = days[(new Date().getDay()+6)%7]; menu[hoy].cena = i; saveAndRender(); }

function saveExternalRecipe() {
    const n = document.getElementById("ext-name").value, u = document.getElementById("ext-url").value;
    if(n && u) { recetasExternas.push({nombre:n, url:u, isExternal:true}); localStorage.setItem("recetasExternas", JSON.stringify(recetasExternas)); renderAll(); }
}

function saveInfoItem() {
    const n = document.getElementById("info-name").value, u = document.getElementById("info-url").value;
    if(n && u) { infoHemeroteca.push({nombre:n, url:u}); localStorage.setItem("infoHemeroteca", JSON.stringify(infoHemeroteca)); renderInfoList(); }
}

function renderInfoList() {
    document.getElementById("info-list-preview").innerHTML = infoHemeroteca.map((item, i) => `<div class="lib-item"><span onclick="window.open('${item.url}')">📖 ${item.nombre}</span></div>`).join("");
}

function mostrarConsejoDelDia() { document.getElementById("daily-tip-text").innerText = CONSEJOS_DIARIOS[(new Date().getDate()-1)%31]; }

function generateShoppingList() {
    let t = {}; Object.values(menu).forEach(d => d.ingredients?.forEach(i => { if(!t[i.ing]) t[i.ing] = {q:0, u:i.unit}; t[i.ing].q += i.qty; }));
    document.getElementById("shopping-list").innerHTML = Object.entries(t).map(([n, d]) => `<li><input type="checkbox"> ${Math.ceil(d.q)}${d.u} ${n}</li>`).join("");
}

function closeModal(id) { document.getElementById(id).style.display = "none"; }
function openAdvisor() { document.getElementById("advisor-modal").style.display = "flex"; }
function openLibrary() { 
    document.getElementById("library-list").innerHTML = Object.keys(RECETAS_EXPERT).map(n => `<div class="lib-item" onclick="showLibraryRecipe('${n}')">📖 ${n}</div>`).join("");
    document.getElementById("library-modal").style.display = "flex"; 
}
function showLibraryRecipe(n) { closeModal('library-modal'); document.getElementById("recipe-detail").innerHTML = `<h3>${n}</h3><p>${RECETAS_EXPERT[n].instrucciones}</p>`; document.getElementById("recipe-modal").style.display = "flex"; }
function consultarAsesor() { alert("Priorizá alimentos reales."); }
function updateReminders() { 
    const r = menu[days[new Date().getDay()]]?.remojo; 
    document.getElementById("reminders-section").style.display = r ? "block" : "none";
    if(r) document.getElementById("daily-reminder").innerText = r;
}
function saveAndRender() { localStorage.setItem("menu", JSON.stringify(menu)); renderAll(); }
renderAll();