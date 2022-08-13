import * as eventos from './eventos.js';

// Pop-up de mensaje de "cargando contenido"
var modalCargando = new bootstrap.Modal(document.getElementById('modalCargando'), {
    keyboard: false,
});

// Elementos
let el_productos;
const el_paginado = document.querySelector("#paginado");

// Variables generales
let categoria_seleccionada;
const productos_por_pagina = 12;

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
                <span class="input-group-text">$ ${numeral(precio).format('0,0')}</span>
                <a href="#" class="btn btn-primary" id="producto_${id}"><i class="bi bi-cart-plus me-2"></i>Agregar</a>
            </div>
        </div>
    </div>`;
};

// Carga los productos según categoría y página actual
const productos_por_categoria = async (categoria, offset) => {
    modalCargando.show();
    // Actualizo categoría actual
    categoria_seleccionada = categoria;
    try {
        const response = await fetch(
            `https://api.mercadolibre.com/sites/MLA/search?category=${categoria}&limit=${productos_por_pagina}&offset=${offset}`
        );
        const result = await response.json();
        // Renderizado
        el_productos.innerHTML = '';
        result.results.forEach((item) => {
            renderizar(item);
        });
        // Paginado
        let cantidad_items = Number(result.paging.primary_results);
        paginado(cantidad_items, Number(offset));
    } catch (error) {
        el_productos.innerHTML = `<p>${error}</p>`;
    }
    modalCargando.hide();
};

// Define el elemento a renderizar y los renderiza por primera vez
export function iniciar(elemento_productos) {
    el_productos = elemento_productos;
    productos_por_categoria('MLA1055', 0);
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
    modalCargando.show();
    try {
        const response = await fetch(`https://api.mercadolibre.com/sites/MLA/search?category=${categoria_seleccionada}&q=${keywords}&limit=${productos_por_pagina}&offset=${offset}`);
        const result = await response.json();
        // Renderizado
        el_productos.innerHTML = '';
        if (result.results.length > 0) {
            result.results.forEach((item) => {
                renderizar(item);
            });
        } else {
            el_productos.innerHTML = '<p>No se encontraron resultados en la búsqueda.</p>';
        }
        // Paginado
        let cantidad_items = Number(result.paging.primary_results);
        paginado(cantidad_items, Number(offset), keywords);
    } catch (error) {
        el_productos.innerHTML = `<p>${error}</p>`;
    }
    modalCargando.hide();
};

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
        precio: item.price,
    };
    const div = document.createElement('div');
    div.classList.add('col-md-4');
    div.innerHTML = html(producto);
    el_productos.append(div);
    // Crea evento del botón Agregar al carrito
    eventos.ev_agregar_al_carrito(producto);
}

// Paginado
function paginado(cantidad_items, pagina_actual, keywords = false) {
    let cantidad_de_paginas = Math.ceil(cantidad_items / productos_por_pagina);
    if (!keywords){
        keywords = "";
    }
    // HTML del paginado
    let html = `
        <ul id="paginas" class="pagination pagination justify-content-center">`;
    if (pagina_actual > 0) {
        html += `
                <li class="page-item">
                    <a class="page-link btn_paginado" href="#" data-offset="${pagina_actual - 1}" data-keywords="${keywords}">Anterior</a>
                </li>`;
    }
    html += `
            <li class="page-item active" aria-current="page">
                <a class="page-link" href="#">${pagina_actual + 1}</a>
            </li>
            <li class="page-item disabled">
                <a class="page-link" href="#">de ${cantidad_de_paginas}</a>
            </li>`;

    if (pagina_actual + 1 < cantidad_de_paginas) {
        html += `
                <li class="page-item">
                    <a class="page-link btn_paginado" href="#" data-offset="${pagina_actual + 1}" data-keywords="${keywords}">Siguiente</a>
                </li>`;
    }
    html += `
        </ul>`;
    el_paginado.innerHTML = html;
    // Evento botón anterior / siguiente
    const botones_paginado = document.querySelectorAll('.btn_paginado');
    botones_paginado.forEach(boton => {
        boton.addEventListener("click", (e) =>{
            let keywords = boton.dataset.keywords;
            let offset = boton.dataset.offset;
            keywords ? productos_por_keywords(keywords, offset) : productos_por_categoria(categoria_seleccionada, offset);
        });
    });
}