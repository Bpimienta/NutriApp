const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const FRUTAS = ["Manzana", "Pera", "Banana", "Mandarina", "Arándanos"];

let menu = JSON.parse(localStorage.getItem("menu")) || {};
let recetasExternas = JSON.parse(localStorage.getItem("recetasExternas")) || [];

const CONSEJOS_DIARIOS = [
    "Semillas de Zapallo: Gran fuente de magnesio para descansar mejor.",
    "Activación: Remojá nueces y almendras 8h para digerirlas mejor.",
    "Lino y Chía: Siempre molidas para aprovechar el Omega 3.",
    "Sésamo: Tostalo apenas para activar su calcio.",
    "Frutos Secos: Guardalos en frasco de vidrio en lugar oscuro.",
    "Girasol: Aporta Vitamina E, protectora de tus células.",
    "Tip: Sumá un puñado de semillas a tus ensaladas para saciedad."
];

const RECETAS_BASE = {
    "Guiso de Lentejas y Girasol": { 
        ingredients: [{ing: "lentejas", qty: 200, unit: "g"}, {ing: "zapallo", qty: 400, unit: "g"}, {ing: "semillas girasol", qty: 30, unit: "g"}], 
        instrucciones: "1. Remojar lentejas 8h. 2. Hervir con zapallo y cúrcuma 20 min. 3. Sumar semillas al servir." 
    },
    "Nuggets de Pollo y Almendras": { 
        ingredients: [{ing: "pechuga", qty: 400, unit: "g"}, {ing: "harina almendras", qty: 100, unit: "g"}], 
        instrucciones: "1. Trozar pollo. 2. Pasar por huevo y almendras molidas. 3. Hornear 20 min a 180°C." 
    },
    "Tacos de Lechuga y Nueces": { 
        ingredients: [{ing: "pollo", qty: 400, unit: "g"}, {ing: "nueces", qty: 50, unit: "g"}, {ing: "lechuga", qty: 1, unit: "u"}], 
        instrucciones: "1. Saltear pollo. 2. Usar lechuga como wrap. 3. Agregar nueces picadas y palta." 
    }
};

const DESAYUNOS_EXPERT = {
    "Pancakes de Banana y Coco": { 
        ingredients: [{ing: "huevo", qty: 2, unit: "u"}, {ing: "banana", qty: 1, unit: "u"}], 
        instrucciones: "1. Pisar banana, mezclar con huevo. 2. Cocinar en sartén vuelta y vuelta." 
    },
    "Chiapudding con Nueces": { 
        ingredients: [{ing: "chía", qty: 3, unit: "cdas"}, {ing: "leche coco", qty: 200, unit: "ml"}], 
        instrucciones: "1. Hidratar chía en leche 8h. 2. Servir con nueces activadas arriba." 
    }
};

function buscarRecetaPorIngrediente() {
    const input = document.getElementById("inventory-input").value.toLowerCase();
    const res = document.getElementById("search-result");
    if(!input) return;

    res.innerHTML = `
        <div style="background:#f0f7f4; padding:15px; border-radius:10px;">
            <p><strong>3 Ideas con "${input}":</strong></p>
            <p><strong>🥘 Cuchara:</strong> Crema de zapallo con <strong>${input}</strong> salteado y semillas de sésamo por encima.</p>
            <p><strong>🥞 Tortilla:</strong> Rallá el <strong>${input}</strong>, mezclalo con 2 huevos y lino molido. Vuelta y vuelta en sartén.</p>
            <p><strong>🥗 Proteico:</strong> Pollo o pescado sellado con <strong>${input}</strong> al vapor y un puñado de nueces picadas.</p>
            <button onclick="aplicarHoyPersonalizado('${input}')" class="btn-primary" style="margin-top:10px;">🍽️ Usar en mi cena de hoy</button>
        </div>
    `;
    res.style.display = "block";
}

function aplicarHoyPersonalizado(ing) {
    const hoy = days[(new Date().getDay() + 6) % 7];
    menu[hoy].cena = `Plato con ${ing}`;
    menu[hoy].ingredients = [{ing: ing, qty: 200, unit: "g"}, {ing: "Mix Semillas", qty: 20, unit: "g"}];
    saveAndRender();
}

function generateSmartMenu() {
    const mult = document.getElementById("servings-selector").value / 2;
    days.forEach(day => {
        const cenaKey = Object.keys(RECETAS_BASE)[Math.floor(Math.random() * Object.keys(RECETAS_BASE).length)];
        const desKey = Object.keys(DESAYUNOS_EXPERT)[Math.floor(Math.random() * Object.keys(DESAYUNOS_EXPERT).length)];
        let dCena = RECETAS_BASE[cenaKey];
        let dDes = DESAYUNOS_EXPERT[desKey];
        menu[day] = {
            desayuno: desKey, cena: cenaKey,
            ingredients: [
                ...dCena.ingredients.map(i => ({...i, qty: i.qty * mult})),
                ...dDes.ingredients.map(i => ({...i, qty: i.qty}))
            ]
        };
    });
    saveAndRender();
}

function generateShoppingList() {
    let list = {};
    Object.values(menu).forEach(day => {
        day.ingredients?.forEach(i => {
            let n = i.ing.toLowerCase().trim();
            if(!list[n]) list[n] = {q:0, u:i.unit};
            list[n].q += i.qty;
        });
    });
    document.getElementById("shopping-list").innerHTML = Object.entries(list)
        .map(([n, d]) => `<li><input type="checkbox"> ${Math.ceil(d.q)}${d.u} ${n}</li>`).join("");
}

function saveAndRender() {
    localStorage.setItem("menu", JSON.stringify(menu));
    localStorage.setItem("recetasExternas", JSON.stringify(recetasExternas));
    renderAll();
}

function renderAll() {
    const grid = document.getElementById("menu-grid");
    if(grid) {
        grid.innerHTML = days.map(day => {
            const d = menu[day] || {desayuno:"-", cena:"-"};
            return `<div class="day-card" onclick="showRecipe('${day}')"><h3>${day}</h3><p>☀️ ${d.desayuno}</p><p>🌙 ${d.cena}</p></div>`;
        }).join("");
    }
    document.getElementById("daily-tip-text").innerText = CONSEJOS_DIARIOS[new Date().getDate() % CONSEJOS_DIARIOS.length];
    generateShoppingList();
}

function showRecipe(day) {
    const d = menu[day]; if(!d) return;
    let des = DESAYUNOS_EXPERT[d.desayuno];
    let cen = RECETAS_BASE[d.cena] || {instrucciones: "Mezclar y cocinar."};
    document.getElementById("recipe-detail").innerHTML = `
        <h3>☀️ ${d.desayuno}</h3><p>${des?.instrucciones || '-'}</p><hr>
        <h3>🌙 ${d.cena}</h3><p>${cen.instrucciones}</p>
    `;
    document.getElementById("recipe-modal").style.display = "flex";
}

function closeModal(id) { document.getElementById(id).style.display = "none"; }
function openAdvisor() { document.getElementById("advisor-modal").style.display = "flex"; }
function consultarAsesor() { alert("Priorizá alimentos reales."); }

renderAll();
