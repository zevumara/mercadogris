// Array productos (objetos Producto)
let productos = [];

// Array carrito (objetos Item)
let carrito = [];

// Contador de items carrito
let contador = 0;

// Objeto producto
function Producto(nombre, descripcion, imagen, precio, keywords) {
	this.id = productos.length + 1;
	this.nombre = nombre;
	this.descripcion = descripcion;
	this.imagen = imagen;
	this.precio = precio;
	this.keywords = keywords;
}

// Objeto carrito
function Item(id) {
	this.id_producto = id;
	this.cantidad = 1;
}

// Contenedor HTML
const contenedor = document.querySelector("#container");

// Contenedor del carrito HTML
const contenedor_items = document.querySelector("#items");

// HTML de producto
const html_producto = ({ id, nombre, descripcion, imagen, precio }) => {
	return `
    <div class="card">
        <img src="img/${imagen}" class="card-img-top" alt="Smartphone" />
        <div class="card-body">
            <h5 class="card-title">${nombre}</h5>
            <p class="card-text">
                ${descripcion}
            </p>
            <div class="input-group justify-content-center">
                <span class="input-group-text">$ ${precio}</span>
                <a href="#" class="btn btn-primary" id="producto_${id}"><i class="bi bi-cart-plus me-2"></i>Agregar</a>
            </div>
        </div>
    </div>`;
};

// HTML item
const html_item = (id, nombre, precio, cantidad) => {
	return `
    <li class="list-group-item d-flex justify-content-between align-items-start">
        <div class="ms-2 me-auto">
            <div class="fw-bold">${nombre}</div>
            <small>$ ${precio}</small>
        </div>
        <span id="item_${id}_cantidad" class="badge bg-primary pill py-3 px-4">${cantidad}</span>
        <a id="item_${id}" class="btn border-0 py-2" href="#"><i class="bi bi-cart-dash-fill"></i></a>
    </li>`;
};

// Carrito
function cargar_carrito_storage() {
	if (localStorage.getItem("carrito")) {
		carrito = JSON.parse(localStorage.getItem("carrito"));
		contador = localStorage.getItem("contador");
		const el = document.getElementById("contador");
		el.innerHTML = contador;
		el.classList.remove("d-none");
		renderizar_carrito();
		console.log(localStorage.getItem("contador"));
	}
}

// Agregar item al carrito
function agregar_al_carrito(id) {
	let item = carrito.find((carrito) => carrito.id_producto === id);
	item ? item.cantidad++ : carrito.push(new Item(id));
	// Actualiza el contador general
	contador++;
	const el = document.getElementById("contador");
	el.innerHTML = contador;
	el.classList.remove("d-none");
	renderizar_carrito();
	// Guardar en Storage
	const carritoJSON = JSON.stringify(carrito);
	localStorage.setItem("carrito", carritoJSON);
	localStorage.setItem("contador", contador);
}

// Renderizar carrito
function renderizar_carrito() {
	contenedor_items.innerHTML = ""; // Limpiar contenedor
	carrito.forEach((item) => {
		let producto = productos.find((producto) => producto.id === item.id_producto);
		const div = document.createElement("div");
		div.innerHTML = html_item(producto.id, producto.nombre, producto.precio, item.cantidad);
		contenedor_items.append(div);
		// Botón para eliminar item del carrito
		const boton = document.getElementById(`item_${producto.id}`);
		const el_cantidad = document.getElementById(`item_${producto.id}_cantidad`);
		boton.addEventListener("click", (e) => {
			e.preventDefault();
			contador--;
			const el = document.getElementById("contador");
			el.innerHTML = contador;
			// Si el contador llega a 0 hacer invisible
			if (contador <= 0) {
				el.classList.add("d-none");
				contenedor_items.innerHTML = "<p>No hay productos en el carrito.</p>";
				carrito = [];
				localStorage.clear();
			} else {
				// Si la cantidad es 1, borrar del carrito
				if (item.cantidad <= 1) {
					boton.parentNode.remove();
					let index = carrito.indexOf(item);
					carrito.splice(index, 1);
				} else {
					// De lo contrario solo restar cantidad
					item.cantidad--;
					el_cantidad.innerHTML = item.cantidad;
				}
				// Guardar en Storage
				const carritoJSON = JSON.stringify(carrito);
				localStorage.setItem("carrito", carritoJSON);
				localStorage.setItem("contador", contador);
			}
		});
	});
}

// Buscador
const buscador = document.getElementById("buscador");
buscador.addEventListener("submit", (e) => {
	e.preventDefault();
	const busqueda = e.target.children[0].value.toLowerCase();
	let resultados = [];
	productos.map((producto) => {
		producto.keywords.forEach((keyword) => {
			if (keyword == busqueda) {
				resultados.push(producto);
			}
		});
	});
	if (resultados.length) {
		renderizar_productos(resultados);
	} else {
		contenedor.innerHTML = "<p>No se encontraron resultados en la búsqueda.</p>";
	}
});

// Carga de productos de prueba
function cargar_productos() {
	productos.push(
		new Producto(
			"Smartphone Xiaomi",
			"Some quick example text to build on the card title and make up the bulk of the card's content.",
			"smartphone-1.png",
			122000,
			["smartphone", "celular", "celu"]
		)
	);
	productos.push(
		new Producto(
			"Tablet Samsung",
			"Some quick example text to build on the card title and make up the bulk of the card's content.",
			"tablet-1.png",
			89000,
			["tablet", "tableta"]
		)
	);
	productos.push(
		new Producto(
			"Mouse Logitech",
			"Some quick example text to build on the card title and make up the bulk of the card's content.",
			"mouse-1.png",
			122000,
			["mouse", "raton", "puntero"]
		)
	);
}

// Renderizado
function renderizar_productos(listado) {
	contenedor.innerHTML = ""; // Limpiar contenedor
	listado.forEach((producto) => {
		const div = document.createElement("div");
		div.classList.add("col-md-4");
		div.innerHTML = html_producto(producto);
		contenedor.append(div);
		// Botón para agregar al carrito
		const boton = document.getElementById(`producto_${producto.id}`);
		boton.addEventListener("click", (e) => {
			e.preventDefault();
			agregar_al_carrito(producto.id);
		});
	});
}

// Inicializar
cargar_productos();
cargar_carrito_storage();
renderizar_productos(productos);

//localStorage.clear();
