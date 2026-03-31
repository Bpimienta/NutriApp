const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const FRUTAS = ["Manzana", "Pera", "Banana", "Mandarina", "Arándanos"];

// --- 🛡️ MOTOR DE PERSISTENCIA (Esto evita que se borren tus datos) ---
// Intentamos recuperar; si no existe, inicializamos como array/objeto vacío
let menu = JSON.parse(localStorage.getItem("menu")) || {};
let recetasExternas = JSON.parse(localStorage.getItem("recetasExternas")) || [];
let infoHemeroteca = JSON.parse(localStorage.getItem("infoHemeroteca")) || [];

// --- 💡 BASE DE DATOS FIJA (CONSEJOS) ---
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

// --- 🍳 RECETARIO EXPERTO (ESTO ES EL CÓDIGO, NO SE BORRA) ---
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

const SUGERENCIAS_INGREDIENTES = {
    "trigo burgol": "🥣 **Tabulé:** Hidratá el trigo burgol, sumá mucho perejil, tomate y limón. ¡Cena fresca!",
    "arroz": "🍚 **Arroz Primavera:** Salteá vegetales y sumá arroz cocido frío con un huevo.",
    "huevo": "🥚 **Shakshuka:** Huevos cocidos en salsa de tomate especiada. ¡Rápido y nutritivo!",
    "atun": "🐟 **Mousse de Atún:** Mezclá atún con palta pisada y usalo sobre hojas de lechuga.",
    "garbanzos": "🥙 **Snack Crujiente:** Horneá garbanzos cocidos con especias hasta que doren.",
    "pollo": "🍗 **Wok de Pollo:** Salteado rápido con zapallitos y cebolla."
};

// --- 🏗️ FUNCIONES DE LÓGICA ---

function generateSmartMenu() {
    const mult = document.getElementById("servings-selector").value / 2;
    let poolCenas = [...Object.keys(RECETAS_EXPERT), ...recetasExternas.map(r => r.nombre)];
    
    days.forEach(day => {
        const cena = poolCenas.splice(Math.floor(Math.random() * poolCenas.length), 1)[0] || "Sopa de Arvejas";
        const desBase = Object.keys(DESAYUNOS_EXPERT)[Math.floor(Math.random() * 3)];
        const fruta = FRUTAS[Math.floor(Math.random() * FRUTAS.length)];
        let d = RECETAS_EXPERT[cena] || recetasExternas.find(r => r.nombre === cena);
        
        menu[day] = { 
            desayuno: desBase.replace("[FRUTA]", fruta), 
            cena: cena, 
            isExternal: !!d.isExternal, 
            url: d.url, 
            remojo: d.remojo, 
            ingredients: [
                ...(d.ingredients || []).map(i => ({...i, qty: i.qty * mult})), 
                {ing: "Huevo/Avena", qty: 1, unit: "u"}, 
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
    mostrarConsejoDelDia(); 
    renderInfoList(); 
    generateShoppingList(); 
    updateReminders();
}

function showRecipe(day) {
    const d = menu[day];
    if (!d) return;
    let cenaHtml = d.isExternal ? `<a href="${d.url}" target="_blank" class="btn-link">📺 Ver Video</a>` : `<p>${RECETAS_EXPERT[d.cena]?.instrucciones || 'Receta personalizada.'}</p>`;
    document.getElementById("recipe-detail").innerHTML = `<h3>☀️ Desayuno</h3><p>${d.desayuno}</p><hr><h3>🌙 ${d.cena}</h3>${cenaHtml}<button onclick="changeSingleMeal('${day}')">🎲 Cambiar Día</button>`;
    document.getElementById("recipe-modal").style.display = "flex";
}

function changeSingleMeal(day) {
    // Generar solo un día nuevo sin borrar el resto
    let poolCenas = [...Object.keys(RECETAS_EXPERT), ...recetasExternas.map(r => r.nombre)];
    const cena = poolCenas[Math.floor(Math.random() * poolCenas.length)];
    const desBase = Object.keys(DESAYUNOS_EXPERT)[Math.floor(Math.random() * 3)];
    const fruta = FRUTAS[Math.floor(Math.random() * FRUTAS.length)];
    let d = RECETAS_EXPERT[cena] || recetasExternas.find(r => r.nombre === cena);
    
    menu[day] = { 
        desayuno: desBase.replace("[FRUTA]", fruta), 
        cena: cena, 
        isExternal: !!d.isExternal, 
        url: d.url, 
        remojo: d.remojo, 
        ingredients: [
            ...(d.ingredients || []).map(i => ({...i, qty: 2})), 
            {ing: fruta, qty: 1, unit: "u"}
        ] 
    };
    saveAndRender(); 
    showRecipe(day);
}

function saveExternalRecipe() {
    const n = document.getElementById("ext-name").value;
    const u = document.getElementById("ext-url").value;
    if(n && u) { 
        recetasExternas.push({nombre:n, url:u, isExternal:true}); 
        saveAndRender();
        document.getElementById("ext-name").value = "";
        document.getElementById("ext-url").value = "";
        alert("¡Receta guardada!");
    }
}

function saveInfoItem() {
    const n = document.getElementById("info-name").value;
    const u = document.getElementById("info-url").value;
    if(n && u) { 
        infoHemeroteca.push({nombre:n, url:u}); 
        saveAndRender();
        document.getElementById("info-name").value = "";
        document.getElementById("info-url").value = "";
    }
}

function renderInfoList() {
    const list = document.getElementById("info-list-preview");
    if (list) {
        list.innerHTML = infoHemeroteca.map((item, i) => `
            <div class="lib-item">
                <span onclick="window.open('${item.url}')">📖 ${item.nombre}</span>
                <button class="btn-delete" onclick="deleteInfo(${i})" style="width:auto; padding:2px 5px; margin:0; background:red;">🗑️</button>
            </div>`).join("");
    }
}

function deleteInfo(i) {
    infoHemeroteca.splice(i, 1);
    saveAndRender();
}

function buscarRecetaPorIngrediente() {
    const i = document.getElementById("inventory-input").value.toLowerCase();
    const res = document.getElementById("search-result");
    let msg = SUGERENCIAS_INGREDIENTES[i] || "Hacé un salteado con lo que tengas, ajo y cúrcuma. ¡Queda todo bien!";
    res.innerHTML = `<p>${msg}</p><button onclick="aplicarAlMenu('${i}')" class="btn-apply" style="background:#40c057; color:white; border:none; padding:8px; border-radius:5px; width:100%;">Usar en el menú de hoy</button>`;
    res.style.display = "block";
}

function aplicarAlMenu(ing) {
    const hoy = days[(new Date().getDay() + 6) % 7];
    menu[hoy].cena = `Especial de ${ing}`;
    saveAndRender();
    alert("Menú de hoy actualizado.");
}

function mostrarConsejoDelDia() {
    const el = document.getElementById("daily-tip-text");
    if (el) el.innerText = CONSEJOS_DIARIOS[(new Date().getDate() - 1) % 31];
}

function generateShoppingList() {
    let t = {}; 
    Object.values(menu).forEach(d => d.ingredients?.forEach(i => { 
        if(!t[i.ing]) t[i.ing] = {q:0, u:i.unit}; 
        t[i.ing].q += i.qty; 
    }));
    const listEl = document.getElementById("shopping-list");
    if (listEl) {
        listEl.innerHTML = Object.entries(t).map(([n, d]) => `<li><input type="checkbox"> ${Math.ceil(d.q)}${d.u} ${n}</li>`).join("");
    }
}

function updateReminders() { 
    const r = menu[days[(new Date().getDay() + 6) % 7]]?.remojo; 
    const sec = document.getElementById("reminders-section");
    if (sec) {
        sec.style.display = r ? "block" : "none";
        document.getElementById("daily-reminder").innerText = r || "";
    }
}

// Modales
function closeModal(id) { document.getElementById(id).style.display = "none"; }
function openAdvisor() { document.getElementById("advisor-modal").style.display = "flex"; }
function openLibrary() { 
    document.getElementById("library-list").innerHTML = Object.keys(RECETAS_EXPERT).map(n => `<div class="lib-item" onclick="showLibraryRecipe('${n}')">📖 ${n}</div>`).join("");
    document.getElementById("library-modal").style.display = "flex"; 
}
function showLibraryRecipe(n) { 
    closeModal('library-modal'); 
    document.getElementById("recipe-detail").innerHTML = `<h3>${n}</h3><p>${RECETAS_EXPERT[n].instrucciones}</p>`; 
    document.getElementById("recipe-modal").style.display = "flex"; 
}
function consultarAsesor() { alert("Priorizá alimentos reales, evitá ultraprocesados y dormí 8hs."); }

// Arrancamos la App
renderAll();
