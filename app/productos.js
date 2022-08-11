import * as eventos from "./eventos.js";

// Elementos
let el_productos;
const el_loading = document.querySelector("#loading");
const el_loading_bar = document.querySelector("#loading_bar");

// Variables generales
let categoria_seleccionada;
let altura;

// HTML de cada elemento a renderizar
const html = ({ id, nombre, descripcion, imagen, precio }) => {
	return `
    <div class="card">
        <img src="https://http2.mlstatic.com/D_604790-${imagen}-V.webp" class="card-img-top" alt="Smartphone" />
        <div class="card-body">
            <h5 class="card-title" style="min-height: 52px;">${nombre}</h5>
            <p class="card-text text-secondary" style="min-height: 72px;">
                <small>${descripcion}</small>
            </p>
            <div class="input-group justify-content-center">
                <span class="input-group-text">$ ${numeral(precio).format("0,0")}</span>
                <a href="#" class="btn btn-primary" id="producto_${id}"><i class="bi bi-cart-plus me-2"></i>Agregar</a>
            </div>
        </div>
    </div>`;
};

// Carga los productos según categoría y página actual
const productos_por_categoria = async (categoria, offset) => {
    // Actualizo categoría actual
    categoria_seleccionada = categoria;
    // Mantengo la altura actual del div de productos por una cuestión estética
    altura = document.querySelector(".album").offsetHeight;
    try {
        mostrar_cargador();
        const response = await fetch(`https://api.mercadolibre.com/sites/MLA/search?category=${categoria}&limit=12&offset=${offset}`);
        const result = await response.json();
        // Renderizado
        result.results.forEach(item => {
            renderizar(item);
        });
        // Paginado

        ocultar_cargador();
    } catch (error) {
        el_productos.innerHTML = `<p>${error}</p>`;
	}
};

// Define el elemento a renderizar y los renderiza por primera vez
export function iniciar(elemento_productos) {
    el_productos = elemento_productos;
    productos_por_categoria("MLA1055", 0);
}

// Cargar categoría
export function categoria(categoria) {
    productos_por_categoria(categoria, 0);
}

// Función para buscador
export function buscar(keywords) {
    productos_por_keywords(keywords, 0);
}

// Renderiza productos según categoría y keywords (buscador)
const productos_por_keywords = async (keywords, offset) => {
    // Mantengo la altura actual del div de productos por una cuestión estética
    altura = document.querySelector(".album").offsetHeight;
    try {
        mostrar_cargador();
        const response = await fetch(`https://api.mercadolibre.com/sites/MLA/search?category=${categoria_seleccionada}&q=${keywords}&limit=12&offset=${offset}`);
        const result = await response.json();
        // Renderizado
        if (result.results.length > 0) {
            result.results.forEach(item => {
                renderizar(item);
            });
        } else {
            el_productos.innerHTML = "<p>No se encontraron resultados en la búsqueda</p>";
        }
        // Paginado

        ocultar_cargador();
    } catch (error) {
        el_productos.innerHTML = `<p>${error}</p>`;
	}
}

// Renderizado de cada producto
function renderizar(item) {
    // Primeras 3 palabras para el título
    let nombre = item.title.split(' ').slice(0, 3).join(' ');
    // Objeto producto con los datos de la API
    let producto = {
        id: item.id,
        nombre: nombre,
        descripcion: item.title,
        imagen: item.thumbnail_id,
        precio: item.price
    }
    const div = document.createElement("div");
    div.classList.add("col-md-4");
    div.innerHTML = html(producto);
    el_productos.append(div);
    // Crea evento del botón Agregar al carrito
    eventos.ev_agregar_al_carrito(producto);
}

function mostrar_cargador() {
    el_productos.innerHTML = "";
    const el_loading = document.querySelector("#loading");
    const el_loading_bar = document.querySelector("#loading_bar");
    el_loading.style.height = `${altura}px`;
    el_loading.classList.remove("d-none");
    el_loading_bar.classList.remove("d-none");
}

function ocultar_cargador() {
    el_loading.classList.add("d-none");
    el_loading_bar.classList.add("d-none");
}