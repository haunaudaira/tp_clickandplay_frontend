document.addEventListener('DOMContentLoaded', () => {
    const ticketContenido = document.getElementById('ticket-contenido');
    const carrito = JSON.parse(sessionStorage.getItem('carritoClickAndPlay')) || [];

    if (!ticketContenido) {
        return;
    }

    if (carrito.length === 0) {
        ticketContenido.innerHTML = '<p>No hay productos en el carrito. Por favor, realiza una compra primero.</p>';
        return;
    }

    let total = 0;
    const lista = document.createElement('div');
    lista.classList.add('ticket-list');

    carrito.forEach(item => {
        const precio = Number(item.precio) || 0;
        const cantidad = Number(item.cantidad) || 0;
        const subtotal = precio * cantidad;
        total += subtotal;

        const fila = document.createElement('div');
        fila.classList.add('ticket-item');
        fila.innerHTML = `
            <h3>${item.nombre}</h3>
            <p>Cantidad: ${cantidad} x $${precio.toFixed(2)}</p>
            <p>Subtotal: $${subtotal.toFixed(2)}</p>
        `;
        lista.appendChild(fila);
    });

    const resumen = document.createElement('div');
    resumen.classList.add('ticket-resumen');
    resumen.innerHTML = `
        <h3>Total: $${total.toFixed(2)}</h3>
        <button id="btn-descargar">Descargar Ticket</button>
        <button id="btn-volver">Volver a productos</button>
    `;

    ticketContenido.innerHTML = '';
    ticketContenido.appendChild(lista);
    ticketContenido.appendChild(resumen);

    const jsPDFConstructor = window.jspdf?.jsPDF || window.jsPDF;
    const btnDescargar = document.getElementById('btn-descargar');
    const btnVolver = document.getElementById('btn-volver');

    if (!jsPDFConstructor) {
        btnDescargar.disabled = true;
        btnDescargar.textContent = 'No se pudo cargar jsPDF';
        console.error('jsPDF no está disponible en window.jspdf ni window.jsPDF');
    } else {
        btnDescargar.addEventListener('click', () => {
            const doc = new jsPDFConstructor({ unit: 'pt', format: 'a4' });
            const margen = 40;
            let y = 60;

            doc.setFontSize(18);
            doc.text('Ticket de Compra', margen, y);
            y += 30;
            doc.setFontSize(12);
            doc.text(`Fecha: ${new Date().toLocaleString('es-AR')}`, margen, y);
            y += 25;
            doc.text('Detalle de la compra:', margen, y);
            y += 20;

            carrito.forEach(item => {
                const precio = Number(item.precio) || 0;
                const cantidad = Number(item.cantidad) || 0;
                const linea = `${item.nombre} x ${cantidad} = $${(precio * cantidad).toFixed(2)}`;
                doc.text(linea, margen, y);
                y += 20;
            });

            y += 10;
            doc.setFontSize(14);
            doc.text(`Total: $${total.toFixed(2)}`, margen, y);
            y += 40;
            doc.setFontSize(10);
            doc.text('Gracias por su compra en Click and Play.', margen, y);

            doc.save('ticket-clickandplay.pdf');
        });
    }

    btnVolver.addEventListener('click', () => {
        window.location.href = 'productos.html';
    });

    sessionStorage.removeItem('carritoClickAndPlay');
});
