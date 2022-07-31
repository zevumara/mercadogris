import * as carrito from './carrito.js';

export function ev_agregar_al_carrito(item) {
    const boton = document.getElementById(`producto_${item.id}`);
    boton.addEventListener('click', (e) => {
        e.preventDefault();
        carrito.agregar(item.id);
    });
}

export function ev_quitar_del_carrito(item) {
    const boton = document.getElementById(`item_${item.id_producto}`);
    boton.addEventListener('click', (e) => {
        e.preventDefault();
        carrito.quitar(item);
    });
}
