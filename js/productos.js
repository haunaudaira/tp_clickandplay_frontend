let catalogoCompleto = []; // guardamos los productos en memoria para filtrarlos fácil

// validacion usuario nombre
const clienteGuardado = JSON.parse(sessionStorage.getItem('clienteClicknPlay'));
if (!clienteGuardado) {
    alert("Debes ingresar tu nombre antes de ver los productos.");
    window.location.href = 'index.html';
}

// traer prods de la bd
const API_BASE = 'http://localhost:3000/admin/api';

const cargarProductos = async () => {
    try {
        const respuesta = await fetch(`${API_BASE}/productos`);
        if (!respuesta.ok) {
            throw new Error(`API devolvió estado ${respuesta.status}`);
        }
        catalogoCompleto = await respuesta.json();
        if (!Array.isArray(catalogoCompleto) || catalogoCompleto.length === 0) {
            document.getElementById('contenedor-productos').innerHTML = "<p>No hay productos disponibles.</p>";
            return;
        }
        renderizarProductos(catalogoCompleto);
        actualizarContadorCarrito();
    } catch (error) {
        console.error("Error al conectar con la API:", error);
        document.getElementById('contenedor-productos').innerHTML = "<p>Error al cargar los productos.</p>";
    }
};

const obtenerRutaImagen = (producto) => {
    const ruta = producto.imagen || producto.rutaImg || '';
    if (!ruta) {
        return 'assets/img/pruebalogo.png';
    }
    const rutaNormalizada = ruta.startsWith('/') ? ruta : `/${ruta}`;
    return `http://localhost:3000${rutaNormalizada}`;
};

const obtenerCategoria = (producto) => {
    const categoria = (producto.categoria || '').toString().trim().toUpperCase();
    if (categoria) {
        return categoria;
    }

    const genero = (producto.genero || '').toString().trim().toUpperCase();
    return ['VINILO', 'DVD'].includes(genero) ? genero : '';
};

// dibujar productos en el DOM
const renderizarProductos = (productos) => {
    const contenedor = document.getElementById('contenedor-productos');
    contenedor.innerHTML = ""; // limpiar antes de mostrar

    productos.forEach(producto => {
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('tarjeta-producto');
        const categoriaTexto = obtenerCategoria(producto) || 'Sin categoría';
        const generoTexto = producto.genero && !['VINILO','DVD'].includes((producto.genero || '').toString().trim().toUpperCase()) ? producto.genero : '';

        tarjeta.innerHTML = `
            <img src="${obtenerRutaImagen(producto)}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>Categoría: ${categoriaTexto}</p>
            ${generoTexto ? `<p>Género: ${generoTexto}</p>` : ''}
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
        const filtrados = catalogoCompleto.filter(prod => obtenerCategoria(prod) === categoria);
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