document.addEventListener('DOMContentLoaded', () => {
    const ticketContenido = document.getElementById('ticket-contenido');
    const carrito = JSON.parse(sessionStorage.getItem('carritoClickAndPlay')) || [];
    const nombreCliente = localStorage.getItem('nombreCliente') || sessionStorage.getItem('nombreCliente') || 'Cliente';

    if (!ticketContenido) return;

    if (carrito.length === 0) {
        ticketContenido.innerHTML = '<p>No hay productos en el carrito</p>';
        return;
    }

    const total = carrito.reduce((suma, item) => suma + (Number(item.precio) || 0) * (Number(item.cantidad) || 0), 0);
    const lineas = carrito.map(item => {
        const precio = Number(item.precio) || 0;
        const cantidad = Number(item.cantidad) || 0;
        return `${item.nombre} x ${cantidad} = $${(precio * cantidad).toFixed(2)}`;
    }).join('<br>');

    ticketContenido.innerHTML = `
        <div class="ticket-list">
            <h3>Ticket de Compra</h3>
            <p>Cliente: ${nombreCliente}</p>
            <p>Fecha: ${new Date().toLocaleString('es-AR')}</p>
            <div class="ticket-item">${lineas}</div>
            <div class="ticket-resumen"><strong>Total:</strong> $${total.toFixed(2)}</div>
            <button id="btn-descargar">Descargar Ticket</button>
            <button id="btn-volver">Volver a productos</button>
        </div>
    `;

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
            y += 24;
            doc.setFontSize(12);
            doc.text(`Cliente: ${nombreCliente}`, margen, y);
            y += 18;
            doc.text(`Fecha: ${new Date().toLocaleString('es-AR')}`, margen, y);
            y += 24;
            carrito.forEach(item => {
                const precio = Number(item.precio) || 0;
                const cantidad = Number(item.cantidad) || 0;
                doc.text(`${item.nombre} x ${cantidad} = $${(precio * cantidad).toFixed(2)}`, margen, y);
                y += 18;
            });
            y += 10;
            doc.setFontSize(14);
            doc.text(`Total: $${total.toFixed(2)}`, margen, y);
            doc.save('ticket-clickandplay.pdf');
        });
    }

    btnVolver.addEventListener('click', () => {
        window.location.href = 'productos.html';
    });

    sessionStorage.removeItem('carritoClickAndPlay');
});
