let catalogoCompleto = []; // guardamos los productos en memoria para filtrarlos fácil

// validacion usuario nombre
const clienteGuardado = JSON.parse(sessionStorage.getItem('clienteClicknPlay'));
if (!clienteGuardado) {
    alert("Debes ingresar tu nombre antes de ver los productos.");
    window.location.href = 'index.html';
}

// traer prods de la bd
const cargarProductos = async () => {
    try {
        const respuesta = await fetch('http://localhost:3000/api/productos');
        catalogoCompleto = await respuesta.json();
        renderizarProductos(catalogoCompleto);
        actualizarContadorCarrito();
    } catch (error) {
        console.error("Error al conectar con la API:", error);
        document.getElementById('contenedor-productos').innerHTML = "<p>Error al cargar los productos.</p>";
    }
};

// dibujar productos en el DOM
const renderizarProductos = (productos) => {
    const contenedor = document.getElementById('contenedor-productos');
    contenedor.innerHTML = ""; // limpiar antes de mostrar

    productos.forEach(producto => {
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('tarjeta-producto');
        
        // el btn invoca a la funcion agregar pasandole todo el objeto convertido a texto (JSON)
        tarjeta.innerHTML = `
            <img src="http://localhost:3000/uploads/${producto.imagen || producto.rutaImg}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>Categoría: ${producto.categoria}</p>
            <p>Precio: $${producto.precio}</p>
            <button onclick='agregarAlCarrito(${JSON.stringify(producto)})'>Añadir al Carrito</button>
        `;
        contenedor.appendChild(tarjeta);
    });
};

// filtrar por categoría
const filtrarCategoria = (categoria) => {
    if (categoria === 'TODOS') {
        renderizarProductos(catalogoCompleto);
    } else {
        const filtrados = catalogoCompleto.filter(prod => prod.categoria === categoria);
        renderizarProductos(filtrados);
    }
};

//agregar al carrito manejando cantidades
const agregarAlCarrito = (productoAAgregar) => {
    // Traemos el carrito actual o creamos uno vacío
    let carrito = JSON.parse(sessionStorage.getItem('carritoClickAndPlay')) || [];

    // buscamos si ya existe el producto en el carrito
    const productoExistente = carrito.find(item => item.id === productoAAgregar.id);

    if (productoExistente) {
        productoExistente.cantidad += 1; // sumamos cantidad
    } else {
        // le agregamos la propiedad cantidad antes de pushear
        productoAAgregar.cantidad = 1;
        carrito.push(productoAAgregar);
    }

    // guardamos nuevamente en Storage
    sessionStorage.setItem('carritoClickAndPlay', JSON.stringify(carrito));
    actualizarContadorCarrito();
    alert(`¡${productoAAgregar.nombre} añadido al carrito!`);
};

// actualizar contador visual
const actualizarContadorCarrito = () => {
    const carrito = JSON.parse(sessionStorage.getItem('carritoClickAndPlay')) || [];
    const totalItems = carrito.reduce((acumulador, item) => acumulador + item.cantidad, 0);
    document.getElementById('contador-carrito').textContent = totalItems;
};

cargarProductos();