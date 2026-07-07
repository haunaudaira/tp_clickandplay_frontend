// mostrar los productos guardados
const renderizarCarrito = () => {
    const carrito = JSON.parse(sessionStorage.getItem('carritoClickAndPlay')) || [];
    const contenedor = document.getElementById('contenedor-carrito');
    let total = 0;

    contenedor.innerHTML = ""; // limpiamos el dom 

    if (carrito.length === 0) {
        contenedor.innerHTML = "<p>Tu carrito está vacío. ¡Ve a la sección de productos!</p>";
        document.getElementById('precio-total').textContent = "0";
        return;
    }

    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;

        const div = document.createElement('div');
        div.classList.add('item-carrito');
        div.innerHTML = `
            <div>
                <h4>${item.nombre}</h4>
                <p>Precio Unitario: $${item.precio} | Subtotal: $${subtotal}</p>
            </div>
            <div class="controles-cantidad">
                <button onclick="cambiarCantidad(${item.id}, -1)">-</button>
                <span>${item.cantidad}</span>
                <button onclick="cambiarCantidad(${item.id}, 1)">+</button>
                <button onclick="eliminarProducto(${item.id})">Eliminar</button>
            </div>
        `;
        contenedor.appendChild(div);
    });

    document.getElementById('precio-total').textContent = total.toFixed(2);
};

// modificar cantidad (+1 o -1)
const cambiarCantidad = (id, variacion) => {
    let carrito = JSON.parse(sessionStorage.getItem('carritoClickAndPlay'));
    const index = carrito.findIndex(item => item.id === id);

    if (index !== -1) {
        carrito[index].cantidad += variacion;
        // si la cantidad llega a 0, lo eliminamos del carrito
        if (carrito[index].cantidad <= 0) {
            carrito.splice(index, 1);
        }
        sessionStorage.setItem('carritoClickAndPlay', JSON.stringify(carrito));
        renderizarCarrito(); // recargamos la vista
    }
};

// eliminar producto completamente
const eliminarProducto = (id) => {
    let carrito = JSON.parse(sessionStorage.getItem('carritoClickAndPlay'));
    carrito = carrito.filter(item => item.id !== id);
    sessionStorage.setItem('carritoClickAndPlay', JSON.stringify(carrito));
    renderizarCarrito();
};

// vaciar carrito por completo
const vaciarCarrito = () => {
    sessionStorage.removeItem('carritoClickAndPlay');
    renderizarCarrito();
};

// confirmar compra
const confirmarCompra = () => {
    const carrito = JSON.parse(sessionStorage.getItem('carritoClickAndPlay')) || [];
    
    if (carrito.length === 0) {
        alert("No puedes confirmar una compra vacía.");
        return;
    }

    // buscamos el modal y sus botones en el HTML
    const modal = document.getElementById('modal-confirmacion');
    const btnSi = document.getElementById('btn-modal-si');
    const btnNo = document.getElementById('btn-modal-no');

    // activamos el modal cambiandolo a 'flex' para que se centre en pantalla
    modal.style.display = 'flex';

    // si el usuario toca "cancelar", simplemente ocultamos el modal
    btnNo.onclick = () => {
        modal.style.display = 'none';
    };

    // si toca "si, comprar", se dispara el envio de los datos al backend
    btnSi.onclick = async () => {
        modal.style.display = 'none'; // cerramos el modal para limpiar la vista
        
        try {
            // mapeamos los datos para que coincidan con lo que pide tu modelo
            const total = carrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);
            const productos = carrito.map(p => ({ id_producto: p.id, cantidad: p.cantidad }));

            const respuesta = await fetch('http://localhost:3000/api/ventas/nueva', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    nombre_usuario: sessionStorage.getItem('nombreCliente') || 'Cliente Anónimo',
                    precio_total: total, 
                    productos: productos
                })
            });

            if (respuesta.ok) {
                // si la base de datos responde que se guardo, vamos a la ventana del ticket
                window.location.href = 'ticket.html';
            } else {
                alert("Hubo un error al procesar tu compra en el servidor. Intenta de nuevo.");
            }

        } catch (error) {
            console.error("Error de red o conexión:", error);
            alert("No se pudo conectar con el servidor.");
        }
    };
};

// ejecutamos al cargar la vista
renderizarCarrito();