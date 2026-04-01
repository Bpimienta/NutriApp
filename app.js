const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

let menu = JSON.parse(localStorage.getItem("menu")) || {};
let recetasExternas = JSON.parse(localStorage.getItem("recetasExternas")) || [];

// --- POOL DE RECETAS (Sin gluten, sin azúcar, con semillas) ---
const RECETAS_POOL = {
    elaboradas: [
        { nombre: "Pescado en Crosta de Semillas", ingredients: [{ing: "pescado", qty: 400, unit: "g"}, {ing: "mix semillas", qty: 50, unit: "g"}], instrucciones: "Cubrir el pescado con semillas y hornear 20 min. Ideal para el lunes." },
        { nombre: "Pastel de Zapallo y Carne", ingredients: [{ing: "carne picada", qty: 400, unit: "g"}, {ing: "zapallo", qty: 500, unit: "g"}, {ing: "nueces", qty: 40, unit: "g"}], instrucciones: "Capas de carne y puré. Gratinar con nueces picadas." },
        { nombre: "Pollo al Horno con Almendras", ingredients: [{ing: "pollo", qty: 500, unit: "g"}, {ing: "almendras", qty: 30, unit: "g"}], instrucciones: "Hornear el pollo con almendras fileteadas y especias." }
    ],
    practicas: [
        { nombre: "Wrap de Lechuga y Atún", ingredients: [{ing: "lechuga", qty: 1, unit: "u"}, {ing: "atún", qty: 170, unit: "g"}], instrucciones: "Rellenar hojas de lechuga con atún y palta. 5 min." },
        { nombre: "Omelette de Espinaca y Sésamo", ingredients: [{ing: "huevo", qty: 3, unit: "u"}, {ing: "espinaca", qty: 100, unit: "g"}], instrucciones: "Cocinar en sartén y espolvorear sésamo al final." },
        { nombre: "Revuelto de Zucchini y Girasol", ingredients: [{ing: "zucchini", qty: 2, unit: "u"}, {ing: "huevo", qty: 2, unit: "u"}], instrucciones: "Saltear zucchini y cuajar con huevo. Sumar girasol." },
        { nombre: "Wok de Pollo y Nueces", ingredients: [{ing: "pechuga", qty: 200, unit: "g"}, {ing: "nueces", qty: 30, unit: "g"}], instrucciones: "Saltear pollo con vegetales y terminar con nueces." }
    ],
    estandar: [
        { nombre: "Guiso de Lentejas Turcas", ingredients: [{ing: "lentejas turcas", qty: 200, unit: "g"}, {ing: "zapallo", qty: 300, unit: "g"}], instrucciones: "Hervir 15 min. Rápido y nutritivo." },
        { nombre: "Hamburguesas de Mijo y Lino", ingredients: [{ing: "mijo cocido", qty: 300, unit: "g"}, {ing: "lino molido", qty: 20, unit: "g"}], instrucciones: "Formar discos y dorar en sartén." },
        { nombre: "Ensalada de Quinoa y Girasol", ingredients: [{ing: "quinoa", qty: 200, unit: "g"}, {ing: "semillas girasol", qty: 30, unit: "g"}], instrucciones: "Mezclar quinoa cocida con girasol y verdes." }
    ]
};

const DESAYUNOS_POOL = [
    { nombre: "Pancakes de Banana y Coco", inst: "Pisar banana, mezclar con huevo y cocinar." },
    { nombre: "Chiapudding con Nueces", inst: "Hidratar chía en leche vegetal 8h. Sumar nueces." },
    { nombre: "Yogur con Mix de Semillas", inst: "Yogur natural con sésamo, girasol y lino." },
    { nombre: "Bowl de Fruta y Almendras", inst: "Fruta de estación con almendras picadas." },
    { nombre: "Omelette Dulce de Canela", inst: "Huevo, un chorrito de leche de coco y canela." }
];

// --- GENERADOR INTELIGENTE (Cero Repetición) ---
function generateSmartMenu() {
    const mult = document.getElementById("servings-selector").value / 2;
    
    // Mezclamos los pools al inicio
    let poolElab = [...RECETAS_POOL.elaboradas].sort(() => Math.random() - 0.5);
    let poolPrac = [...RECETAS_POOL.practicas].sort(() => Math.random() - 0.5);
    let poolEst  = [...RECETAS_POOL.estandar].sort(() => Math.random() - 0.5);
    let poolDes  = [...DESAYUNOS_POOL].sort(() => Math.random() - 0.5);

    days.forEach(day => {
        let cena;
        // Asignación por estrategia de tiempo
        if (day === "Lunes") {
            cena = poolElab.pop(); 
        } else if (day === "Martes" || day === "Jueves") {
            cena = poolPrac.pop(); 
        } else {
            cena = poolEst.length > 0 ? poolEst.pop() : poolPrac.pop();
        }

        // Si se nos acaban los desayunos (porque hay 5 para 7 días), barajamos de nuevo
        if (poolDes.length === 0) poolDes = [...DESAYUNOS_POOL].sort(() => Math.random() - 0.5);
        let desayuno = poolDes.pop();

        menu[day] = { 
            desayuno: desayuno.nombre, 
            cena: cena.nombre, 
            inst_des: desayuno.inst,
            inst_cen: cena.instrucciones,
            ingredients: [
                ...cena.ingredients.map(i => ({...i, qty: i.qty * mult})),
                // Aquí podrías sumar los del desayuno si quieres que aparezcan en la lista
            ] 
        };
    });
    saveAndRender();
}

// --- RENDERIZADO Y PERSISTENCIA ---
function renderAll() {
    const grid = document.getElementById("menu-grid");
    if(grid) {
        grid.innerHTML = days.map(day => {
            const d = menu[day] || {desayuno: "-", cena: "-"};
            return `<div class="day-card" onclick="showRecipe('${day}')"><h3>${day}</h3><p>☀️ ${d.desayuno}</p><p>🌙 ${d.cena}</p></div>`;
        }).join("");
    }
    generateShoppingList();
}

function showRecipe(day) {
    const d = menu[day]; if(!d) return;
    document.getElementById("recipe-detail").innerHTML = `
        <h2 style="color:#2d6a4f">☀️ ${d.desayuno}</h2>
        <p>${d.inst_des}</p><hr>
        <h2 style="color:#2d6a4f">🌙 ${d.cena}</h2>
        <p>${d.inst_cen}</p>
    `;
    document.getElementById("recipe-modal").style.display = "flex";
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
        .map(([n, d]) => `<li><input type="checkbox"> ${Math.ceil(d.q)}${d.u} ${n}</li>`).join("") || "<li>Generá un menú nuevo.</li>";
}

function saveAndRender() {
    localStorage.setItem("menu", JSON.stringify(menu));
    renderAll();
}

function closeModal(id) { document.getElementById(id).style.display = "none"; }
function openLibrary() { alert("Próximamente: Tu biblioteca completa."); }
function openAdvisor() { alert("Priorizá comida real."); }

renderAll();
