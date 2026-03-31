const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const FRUTAS = ["Manzana", "Pera", "Banana", "Mandarina", "Arándanos"];

// --- 🛡️ MOTOR DE PERSISTENCIA ---
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

const RECETAS_BASE = {
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
    let poolCenas = [...Object.keys(RECETAS_BASE), ...recetasExternas.map(r => r.nombre)];
    
    days.forEach(day => {
        if (poolCenas.length === 0) poolCenas = [...Object.keys(RECETAS_BASE), ...recetasExternas.map(r => r.nombre)];
        const cenaNombre = poolCenas.splice(Math.floor(Math.random() * poolCenas.length), 1)[0];
        const desBase = Object.keys(DESAYUNOS_EXPERT)[Math.floor(Math.random() * 3)];
        const fruta = FRUTAS[Math.floor(Math.random() * FRUTAS.length)];
        
        let d = RECETAS_BASE[cenaNombre] || recetasExternas.find(r => r.nombre === cenaNombre);
        
        menu[day] = { 
            desayuno: desBase.replace("[FRUTA]", fruta), 
            cena: cenaNombre, 
            isExternal: !!d.isExternal, 
            url: d.url || null, 
            remojo: d.remojo || null, 
            ingredients: [
                ...(d.ingredients || []).map(i => ({...i, qty: i.qty * mult})), 
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
    let cenaHtml = d.isExternal ? `<a href="${d.url}" target="_blank" class="btn-link">📺 Ver Video Tutorial</a>` : `<p>${RECETAS_BASE[d.cena]?.instrucciones || ''}</p>`;
    document.getElementById("recipe-detail").innerHTML = `<h3>☀️ Desayuno</h3><p>${d.desayuno}</p><hr><h3>🌙 ${d.cena}</h3>${cenaHtml}<button onclick="changeSingleMeal('${day}')" style="margin-top:10px;">🎲 Cambiar Día</button>`;
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
    // BOTÓN MÁGICO PARA APLICAR AL MENÚ DE HOY
    html += `<button onclick="aplicarAlMenu('${n}')" style="margin-top:20px; background:var(--primary); color:white;">🍽️ Usar en el menú de hoy</button>`;
    
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
    
    saveAndRender(); 
    closeModal('recipe-modal');
    alert(`¡Listo! Hoy cenás ${nombreReceta}.`);
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
    res.innerHTML = `<p>Usalo en un salteado con cúrcuma y ajo.</p><button onclick="aplicarAlMenu('${i}')" class="btn-apply">Usar hoy</button>`;
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
