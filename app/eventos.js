import * as carrito from './carrito.js';

export function agregar_al_carrito(item) {
    const boton = document.getElementById(`producto_${item.id}`);
    boton.addEventListener('click', (e) => {
        e.preventDefault();
        carrito.agregar(item);
    });
}

export function quitar_del_carrito(item) {
    const boton = document.getElementById(`item_${item.id}`);
    boton.addEventListener('click', (e) => {
        e.preventDefault();
        carrito.quitar(item);
    });
}
