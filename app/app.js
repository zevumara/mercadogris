import * as productos from "./productos.js";
import * as carrito from "./carrito.js";
import { database } from "./database.js";

// Elementos
const el_productos = document.querySelector("#container");
const el_carrito = document.querySelector("#items");
const el_contador = document.querySelector("#contador");
const el_buscador = document.getElementById("buscador");

// Productos
productos.iniciar(el_productos);

// Carrito
carrito.iniciar(el_carrito, el_contador);

// Buscador
el_buscador.addEventListener("submit", (e) => {
	e.preventDefault();
	const keywords = e.target.children[0].value.toLowerCase();
	let resultados = productos.buscar(keywords);
	if (resultados.length) {
		productos.renderizar(resultados);
	} else {
		keywords ? (el_productos.innerHTML = "<p>No se encontraron resultados en la búsqueda.</p>") : productos.renderizar(database);
	}
});
