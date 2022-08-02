import { database } from "./database.js";
import * as eventos from "./eventos.js";

let el_productos;

// HTML de cada elemento a renderizar
const html = ({ id, nombre, descripcion, imagen, precio }) => {
	return `
    <div class="card">
        <img src="assets/img/${imagen}" class="card-img-top" alt="Smartphone" />
        <div class="card-body">
            <h5 class="card-title">${nombre}</h5>
            <p class="card-text">
                ${descripcion}
            </p>
            <div class="input-group justify-content-center">
                <span class="input-group-text">$ ${numeral(precio).format("0,0.00")}</span>
                <a href="#" class="btn btn-primary" id="producto_${id}"><i class="bi bi-cart-plus me-2"></i>Agregar</a>
            </div>
        </div>
    </div>`;
};

// Define el elemento a renderizar y los renderiza por primera vez
export function iniciar(elemento_productos) {
	el_productos = elemento_productos;
	renderizar(database);
}

// Función para buscador, devuelve un array con los resultados encontrados
export function buscar(busqueda) {
	let resultados = [];
	database.map((producto) => {
		producto.keywords.forEach((keyword) => {
			if (keyword == busqueda) {
				resultados.push(producto);
			}
		});
	});
	return resultados;
}

// Función para renderizado
export function renderizar(productos) {
	// Limpia contenedor
	el_productos.innerHTML = "";
	// Renderizado
	productos.forEach((producto) => {
		const div = document.createElement("div");
		div.classList.add("col-md-4");
		div.innerHTML = html(producto);
		el_productos.append(div);
		// Crea evento del botón Agregar al carrito
		eventos.ev_agregar_al_carrito(producto);
	});
}
