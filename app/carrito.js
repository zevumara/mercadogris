import * as eventos from "./eventos.js";

// Elementos
let el_carrito;
let el_contador;
const el_total = document.querySelector("#total");
const el_suma = document.querySelector("#suma");

// Variables generales
let items = [];
let contador = 0;

// HTML de cada elemento a renderizar
const html = (id, nombre, precio, cantidad) => {
	return `
        <div class="ms-2 me-auto">
            <div class="fw-bold">${nombre}</div>
            <small>$ ${numeral(precio).format("0,0.00")}</small>
        </div>
        <span id="item_${id}_cantidad" class="badge bg-primary pill py-3 px-4">${cantidad}</span>
        <a id="item_${id}" class="btn border-0 py-2" href="#"><i class="bi bi-cart-dash-fill"></i></a>`;
};

// Inicia el carrito
export function iniciar(elemento_carrito, elemento_contador) {
	el_carrito = elemento_carrito;
	el_contador = elemento_contador;
	// Cargar carrito del storage
	if (localStorage.getItem("carrito")) {
		items = JSON.parse(localStorage.getItem("carrito"));
		contador = localStorage.getItem("contador");
	}
	actualizar_contador();
	renderizar();
}

// Actualiza el contador general
const actualizar_contador = () => {
	// Si el contador está en 0 lo hace invisible, de lo contrario lo muestra
	if (contador <= 0) {
		el_contador.innerHTML = 0;
		el_contador.classList.add("d-none");
		borrar_carrito();
	} else {
		el_contador.innerHTML = contador;
		el_contador.classList.remove("d-none");
	}
};

// Agrega un item al carrito
export function agregar(producto) {
	// Contador general
	contador++;
    actualizar_contador();
    // Verifica si el item ya existe en la lista
	let item = items.find((item) => item.id === producto.id);
	// Si el item ya está en el carrito aumenta la cantidad, de lo contrario agrega un nuevo item
	item ? item.cantidad++ : items.push({ ...producto, cantidad: 1 });
	guardar_carrito();
	renderizar();
}

export function quitar(item) {
	// Contador general
	contador--;
	actualizar_contador();
	// Si solo hay uno en cantidad, borrar del carrito
	if (item.cantidad <= 1) {
		let index = items.indexOf(item);
		items.splice(index, 1);
	} else {
		// De lo contrario solo restar cantidad
		item.cantidad--;
	}
	guardar_carrito();
	renderizar();
}

// Guardar estado del carrito en el storage
function guardar_carrito() {
	const carrito = JSON.stringify(items);
	localStorage.setItem("carrito", carrito);
	localStorage.setItem("contador", contador);
}

// Cuando no hay más productos se limpia el storage
function borrar_carrito() {
	items = [];
	localStorage.clear();
}

function renderizar() {
	// Limpia contenedor
	el_carrito.innerHTML = "";
	// Si hay productos en el carrito los renderiza
	if (items.length > 0) {
		let total = 0;
		items.forEach((item) => {
			const li = document.createElement("li");
			li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-start");
			li.innerHTML = html(item.id, item.nombre, item.precio, item.cantidad);
			el_carrito.append(li);
			// Crea evento del botón Quitar de carrito
			eventos.ev_quitar_del_carrito(item);
			// Cálculo del total
			total += item.precio * item.cantidad;
		});
		// Actualizar el cálculo total
		let pesos = numeral(total).format("0,0.00"); // Librería para convertir números a pesos
		el_suma.innerHTML = pesos;
		el_total.classList.remove("d-none");
	} else {
		// Si no hay productos renderiza el mensaje
		el_suma.innerHTML = 0;
		el_total.classList.add("d-none");
		el_carrito.innerHTML = "<p>No hay productos en el carrito.</p>";
	}
}
