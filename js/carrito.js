// 1. Mostrar los productos guardados
const renderizarCarrito = () => {
    const carrito = JSON.parse(sessionStorage.getItem('carritoClickAndPlay')) || [];
    const contenedor = document.getElementById('contenedor-carrito');
    let total = 0;

    contenedor.innerHTML = ""; // Limpiamos el DOM [4]

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
                <button onclick="eliminarProducto(${item.id})" style="color:red;">Eliminar</button>
            </div>
        `;
        contenedor.appendChild(div);
    });

    document.getElementById('precio-total').textContent = total.toFixed(2);
};

// 2. Modificar cantidad (+1 o -1)
const cambiarCantidad = (id, variacion) => {
    let carrito = JSON.parse(sessionStorage.getItem('carritoClickAndPlay'));
    const index = carrito.findIndex(item => item.id === id);

    if (index !== -1) {
        carrito[index].cantidad += variacion;
        // Si la cantidad llega a 0, lo eliminamos del carrito [3]
        if (carrito[index].cantidad <= 0) {
            carrito.splice(index, 1);
        }
        sessionStorage.setItem('carritoClickAndPlay', JSON.stringify(carrito));
        renderizarCarrito(); // Recargamos la vista
    }
};

// 3. Eliminar producto completamente [5]
const eliminarProducto = (id) => {
    let carrito = JSON.parse(sessionStorage.getItem('carritoClickAndPlay'));
    carrito = carrito.filter(item => item.id !== id);
    sessionStorage.setItem('carritoClickAndPlay', JSON.stringify(carrito));
    renderizarCarrito();
};

// 4. Vaciar Carrito por completo
const vaciarCarrito = () => {
    sessionStorage.removeItem('carritoClickAndPlay');
    renderizarCarrito();
};

// 5. Confirmar Compra
const confirmarCompra = () => {
    const carrito = JSON.parse(sessionStorage.getItem('carritoClickAndPlay')) || [];
    
    if (carrito.length === 0) {
        alert("No puedes confirmar una compra vacía.");
        return;
    }

    // El TP exige mostrar un modal de confirmación [5]
    const confirmacion = confirm("¿Deseas confirmar y finalizar tu compra?");
    
    if (confirmacion) {
        // Redirigimos a la pantalla final donde usaremos jsPDF [6]
        window.location.href = 'ticket.html';
    }
};

// Ejecutamos al cargar la vista
renderizarCarrito();