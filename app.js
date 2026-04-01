const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const FRUTAS = ["Manzana", "Pera", "Banana", "Mandarina", "Arándanos"];

let menu = JSON.parse(localStorage.getItem("menu")) || {};
let recetasExternas = JSON.parse(localStorage.getItem("recetasExternas")) || [];

const CONSEJOS_DIARIOS = [
    "Activación: Remojá las nueces 8h para eliminar antinutrientes.",
    "Lino y Chía: Trituralas justo antes de comer para el Omega 3.",
    "Sésamo: Gran fuente de calcio. Tostalo apenas para activar.",
    "Magnesio: Semillas de zapallo son ideales para relajar post-trabajo.",
    "Crocante Sano: Usá frutos secos picados en vez de crutones.",
    "Tip: Los martes y jueves priorizá la practicidad sin harinas.",
    "Hidratación: Un vaso de agua con limón al despertar limpia el hígado."
];

// CATEGORÍAS DE RECETAS POR TIEMPO/ESFUERZO
const RECETAS_POOL = {
    elaboradas: {
        "Pescado en Crosta de Semillas al Horno": { 
            ingredients: [{ing: "pescado", qty: 400, unit: "g"}, {ing: "mix semillas", qty: 50, unit: "g"}, {ing: "vegetales varios", qty: 300, unit: "g"}], 
            instrucciones: "1. Precalentar horno a 200°C. 2. Cubrir el pescado con mostaza y pegar el mix de semillas. 3. Hornear con vegetales 25 min. Ideal para lunes con tiempo." 
        },
        "Pastel de Zapallo y Carne con Nueces": { 
            ingredients: [{ing: "carne picada", qty: 400, unit: "g"}, {ing: "puré zapallo", qty: 500, unit: "g"}, {ing: "nueces", qty: 40, unit: "g"}], 
            instrucciones: "1. Cocinar la carne con cebolla. 2. Armar capas con el puré de zapallo. 3. Agregar nueces picadas arriba y gratinar al horno." 
        }
    },
    practicas: {
        "Wrap de Lechuga Express": { 
            ingredients: [{ing: "lechuga", qty: 1, unit: "u"}, {ing: "atún o pollo cocido", qty: 200, unit: "g"}, {ing: "palta", qty: 1, unit: "u"}], 
            instrucciones: "1. Lavar hojas de lechuga. 2. Rellenar con proteína y palta. 3. Enrollar y comer. ¡Listo en 5 minutos!" 
        },
        "Omelette de Espinaca y Sésamo": { 
            ingredients: [{ing: "huevo", qty: 3, unit: "u"}, {ing: "espinaca", qty: 1, unit: "atado"}, {ing: "sésamo", qty: 20, unit: "g"}], 
            instrucciones: "1. Batir huevos con espinaca picada. 2. Cocinar 3 min de cada lado. 3. Espolvorear sésamo. Rápido para días agotadores." 
        },
        "Revuelto de Zucchini y Girasol": { 
            ingredients: [{ing: "zucchini", qty: 2, unit: "u"}, {ing: "huevo", qty: 2, unit: "u"}, {ing: "semillas girasol", qty: 30, unit: "g"}], 
            instrucciones: "1. Rallar zucchini y saltear 4 min. 2. Agregar huevos y revolver. 3. Sumar girasol al final. Cena nutritiva en 8 min." 
        }
    },
    estandar: {
        "Guiso de Lentejas Turcas Rápido": { 
            ingredients: [{ing: "lentejas turcas", qty: 200, unit: "g"}, {ing: "zapallo", qty: 300, unit: "g"}], 
            instrucciones: "1. Hervir lentejas (se cocinan en 15 min). 2. Agregar cubos de zapallo. 3. Condimentar con cúrcuma y pimentón." 
        },
        "Hamburguesas de Mijo y Lino": { 
            ingredients: [{ing: "mijo cocido", qty: 300, unit: "g"}, {ing: "lino molido", qty: 30, unit: "g"}], 
            instrucciones: "1. Mezclar mijo con lino y formar discos. 2. Dorar en sartén 5 min por lado." 
        }
    }
};

const DESAYUNOS = {
    "Pancakes de Banana y Coco": { 
        ingredients: [{ing: "huevo", qty: 2, unit: "u"}, {ing: "banana", qty: 1, unit: "u"}], 
        instrucciones: "Pisar banana, mezclar con huevo y cocinar en sartén vuelta y vuelta." 
    },
    "Chiapudding con Almendras": { 
        ingredients: [{ing: "chía", qty: 3, unit: "cdas"}, {ing: "almendras", qty: 30, unit: "g"}], 
        instrucciones: "Hidratar chía en leche vegetal 8h. Sumar almendras fileteadas." 
    }
};

// --- LÓGICA DE ASIGNACIÓN INTELIGENTE ---
function generateSmartMenu() {
    const mult = document.getElementById("servings-selector").value / 2;
    
    days.forEach(day => {
        let pool;
        // Estrategia fija por día
        if (day === "Lunes") {
            pool = RECETAS_POOL.elaboradas;
        } else if (day === "Martes" || day === "Jueves") {
            pool = RECETAS_POOL.practicas;
        } else {
            pool = {...RECETAS_POOL.estandar, ...RECETAS_POOL.practicas};
        }

        const cenaNombres = Object.keys(pool);
        const cenaElegida = cenaNombres[Math.floor(Math.random() * cenaNombres.length)];
        const desElegido = Object.keys(DESAYUNOS)[Math.floor(Math.random() * 2)];
        
        let dCena = pool[cenaElegida];
        let dDes = DESAYUNOS[desElegido];
        
        menu[day] = { 
            desayuno: desElegido, 
            cena: cenaElegida, 
            ingredients: [
                ...dCena.ingredients.map(i => ({...i, qty: i.qty * mult})),
                ...dDes.ingredients.map(i => ({...i, qty: i.qty}))
            ] 
        };
    });
    saveAndRender();
}

// --- BUSCADOR DETALLADO ---
function buscarRecetaPorIngrediente() {
    const input = document.getElementById("inventory-input").value.toLowerCase();
    const res = document.getElementById("search-result");
    if(!input) return;

    res.innerHTML = `
        <div style="background:#f0f7f4; padding:15px; border-radius:10px;">
            <p><strong>💡 Ideas con "${input}" (Sin Gluten/Azúcar):</strong></p>
            <p><strong>⏱️ Opción Rápida:</strong> Rallá <strong>${input}</strong> y dalo vuelta en la sartén con 2 huevos y semillas de sésamo (estilo tortilla express).</p>
            <p><strong>🔥 Opción Horno:</strong> Cortá <strong>${input}</strong> en bastones, pasalos por aceite de oliva y harina de almendras. Hornealos hasta que estén crocantes.</p>
            <p><strong>🥣 Opción Nutritiva:</strong> Salteá <strong>${input}</strong> con ajo, jengibre y un puñado de nueces. Servilo sobre una base de hojas verdes.</p>
            <button onclick="aplicarHoyPersonalizado('${input}')" class="btn-primary" style="margin-top:10px;">🍽️ Aplicar a mi cena de hoy</button>
        </div>
    `;
    res.style.display = "block";
}

function aplicarHoyPersonalizado(ing) {
    const hoy = days[(new Date().getDay() + 6) % 7];
    menu[hoy].cena = `Plato con ${ing}`;
    menu[hoy].ingredients = [{ing: ing, qty: 200, unit: "g"}, {ing: "Mix Semillas", qty: 20, unit: "g"}];
    saveAndRender();
    alert("Agregado a hoy. ¡No olvides revisar la lista de compras!");
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
    let des = DESAYUNOS[d.desayuno];
    // Buscar en todas las categorías
    let cen = RECETAS_POOL.elaboradas[d.cena] || RECETAS_POOL.practicas[d.cena] || RECETAS_POOL.estandar[d.cena] || {instrucciones: "Mezclar ingredientes y cocinar saludablemente."};
    
    document.getElementById("recipe-detail").innerHTML = `
        <h2 style="color:var(--primary)">☀️ ${d.desayuno}</h2>
        <p>${des?.instrucciones || '-'}</p>
        <hr>
        <h2 style="color:var(--primary)">🌙 ${d.cena}</h2>
        <p><strong>Preparación:</strong><br>${cen.instrucciones}</p>
    `;
    document.getElementById("recipe-modal").style.display = "flex";
}

function closeModal(id) { document.getElementById(id).style.display = "none"; }
function openAdvisor() { document.getElementById("advisor-modal").style.display = "flex"; }
function consultarAsesor() { alert("Priorizá alimentos reales."); }

renderAll();
