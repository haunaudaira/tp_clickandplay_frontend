// seleccionamos el formulario y el input del DOM
const formulario = document.getElementById('formulario-bienvenida');
const inputNombre = document.getElementById('nombreCliente');

// escuchamos el evento submit
formulario.addEventListener('submit', (e) => {
    // Evitamos que el formulario recargue la página por defecto
    e.preventDefault();

    // obtenemos el valor del input y le quitamos los espacios en blanco de los extremos
    const nombre = inputNombre.value.trim();

    if (nombre !== "") {
        // creamos un objeto con los datos del cliente. 
        // a futuro aquí podrías agregar un array vacío para el carrito: { nombre: nombre, carrito: [] }
        const datosCliente = { nombre: nombre };

        // guardamos en ssesion storage con stringify
        sessionStorage.setItem('clienteClicknPlay', JSON.stringify(datosCliente));

        // redirigimos automaticamente a la pantalla de productos
        window.location.href = 'productos.html';
    } else {
        alert("Por favor, ingresa un nombre válido para continuar.");
    }
});