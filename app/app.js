import * as productos from "./productos.js";
import * as carrito from "./carrito.js";

// Elementos
const el_productos = document.querySelector("#container");
const el_carrito = document.querySelector("#items");
const el_contador = document.querySelector("#contador");
const el_buscador_form = document.getElementById("buscador");
const el_buscador_input = document.getElementById("buscador_input");
const els_categoria = document.querySelectorAll(".nav-link");

// Productos
productos.iniciar(el_productos);

// Carrito
carrito.iniciar(el_carrito, el_contador);

// Buscador
el_buscador_form.addEventListener("submit", (e) => {
	e.preventDefault();
	const keywords = e.target.children[0].value.toLowerCase();
	productos.buscar(keywords);
});

// Categorías
els_categoria.forEach(item => {
    item.addEventListener("click", (e) => {
        e.preventDefault();
        // Limpia buscador por las dudas
        el_buscador_input.value = "";
        // Quita todas las clases de activo
        els_categoria.forEach(item => {
            item.classList.remove("active", "bg-white", "text-dark");
        });
        // Agrega la clase activo a la que está haciendo click
        item.classList.add("active", "bg-white", "text-dark");
        // Carga la categoría
        productos.categoria(item.dataset.categoria);
    });
});