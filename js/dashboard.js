async function cargarDatosDashboard() {
    try {
        const productosResponse = await fetch('http://localhost:3000/api/productos/count');
        const productosData = await productosResponse.json();
        const existenciasResponse = await fetch('http://localhost:3000/api/existencias/total');
        const existenciasData = await existenciasResponse.json();

        document.getElementById('total-productos').textContent = productosData.total;
        document.getElementById('total-existencias').textContent = existenciasData.total;

    } catch (error) {
        console.error('Error al cargar datos del dashboard:', error);
        // Podrías mostrar un mensaje de error en la página si lo deseas
    }
}

document.addEventListener('DOMContentLoaded', cargarDatosDashboard);