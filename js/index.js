document.getElementById('formulario-bienvenida').onsubmit = (event) => {
    event.preventDefault(); 
    
    // agarramos el texto ingresado
    const nombreIngresado = document.getElementById('cliente-nombre').value;

    // guardamos el texto en el almacenamiento del navegador
    sessionStorage.setItem('nombreCliente', nombreIngresado);

    // lo redirigimos a la pag de productos
    window.location.href = 'productos.html'; 
};