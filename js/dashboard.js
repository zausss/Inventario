document.addEventListener('DOMContentLoaded', function() {
    const totalProductosElement = document.getElementById('total-productos');
    const totalExistenciasElement = document.getElementById('total-existencias');

    async function cargarEstadisticas() {
        try {
            const productosResponse = await fetch('/.netlify/functions/obtener_total_productos');
            const productosData = await productosResponse.json();
            totalProductosElement.textContent = productosData.total || 0;
        } catch (error) {
            console.error('Error al cargar el total de productos:', error);
            totalProductosElement.textContent = 'Error';
        }

        try {
            const existenciasResponse = await fetch('/.netlify/functions/obtener_total_existencias');
            const existenciasData = await existenciasResponse.json();
            totalExistenciasElement.textContent = existenciasData.total || 0;
        } catch (error) {
            console.error('Error al cargar el total de existencias:', error);
            totalExistenciasElement.textContent = 'Error';
        }
    }

    cargarEstadisticas();
});