document.addEventListener('DOMContentLoaded', async function() {
    const form = document.getElementById('editar-producto-form');
    const productoIdInput = document.getElementById('producto-id');
    const nombreInput = document.getElementById('nombre');
    const categoriaInput = document.getElementById('categoria');
    const precioInput = document.getElementById('precio');
    const stockInput = document.getElementById('stock');

    // Función para obtener el ID del producto de la URL
    function getProductIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    const productId = getProductIdFromUrl();
    productoIdInput.value = productId; // Establecer el ID en un campo oculto

    // Función para cargar los datos del producto
    async function cargarDatosProducto(id) {
        try {
            const response = await fetch(`http://localhost:3000/api/productos/${id}`);
            if (response.ok) {
                const producto = await response.json();
                nombreInput.value = producto.nombre || '';
                categoriaInput.value = producto.categoria || '';
                precioInput.value = producto.precio || '';
                stockInput.value = producto.stock || '';
            } else {
                console.error('Error al cargar los datos del producto:', response.status);
                alert('Error al cargar los datos del producto.');
            }
        } catch (error) {
            console.error('Error de red:', error);
            alert('Error de red al cargar los datos del producto.');
        }
    }

    // Cargar los datos del producto al cargar la página
    if (productId) {
        await cargarDatosProducto(productId);
    } else {
        alert('ID de producto no válido.');
        window.location.href = 'productos.html'; // Redirigir si no hay ID
    }

    // Evento para guardar los cambios
    form.addEventListener('submit', async function(event) {
        event.preventDefault(); // Evitar el envío del formulario por defecto

        const nuevosDatos = {
            nombre: nombreInput.value,
            categoria: categoriaInput.value,
            precio: parseFloat(precioInput.value),
            stock: parseInt(stockInput.value)
        };

        try {
            const response = await fetch(`http://localhost:3000/api/productos/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevosDatos)
            });

            if (response.ok) {
                alert('Producto actualizado con éxito.');
                window.location.href = 'productos.html'; // Redirigir de vuelta a la lista de productos
            } else {
                const errorData = await response.json();
                console.error('Error al actualizar el producto:', errorData);
                alert('Error al actualizar el producto.');
            }
        } catch (error) {
            console.error('Error de red al actualizar el producto:', error);
            alert('Error de red al actualizar el producto.');
        }
    });
});