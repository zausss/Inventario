/**
 * Funcionalidades comunes a todas las páginas
 * - Manejo del menú lateral
 * - Navegación entre páginas (establecimiento del estado activo)
 * - Cierre de submenús al hacer clic fuera
 * - Manejo del modal de categorías (mostrar, ocultar y guardar -simulado-)
 */
document.addEventListener('DOMContentLoaded', function() {
    // 1. Obtener referencias a los elementos del modal
    const nuevaCategoriaBtn = document.getElementById('nueva-categoria-btn');
    const categoriaModal = document.getElementById('categoria-modal');
    const cerrarModalBtn = categoriaModal ? categoriaModal.querySelector('.close-modal') : null;
    const cancelarModalBtn = document.getElementById('cancelar-categoria');

    // 2. Función para mostrar el modal de nueva categoría
    function mostrarModalNuevaCategoria() {
        if (categoriaModal) {
            categoriaModal.classList.remove('hidden');
            document.getElementById('modal-title').textContent = 'Nueva Categoría';
            document.getElementById('categoria-id').value = ''; // Limpiar ID para nueva categoría
            document.getElementById('categoria-nombre').value = '';
            document.getElementById('categoria-descripcion').value = '';
        }
    }

    // 3. Función para ocultar el modal
    function ocultarModal() {
        if (categoriaModal) {
            categoriaModal.classList.add('hidden');
        }
    }

    // 4. Event listeners para mostrar y ocultar el modal
    if (nuevaCategoriaBtn) {
        nuevaCategoriaBtn.addEventListener('click', mostrarModalNuevaCategoria);
    }

    if (cerrarModalBtn) {
        cerrarModalBtn.addEventListener('click', ocultarModal);
    }

    if (cancelarModalBtn) {
        cancelarModalBtn.addEventListener('click', ocultarModal);
    }

    // 5. Manejar el envío del formulario para guardar una nueva categoría
    const categoriaForm = document.getElementById('categoria-form');
    const categoriasList = document.getElementById('categorias-list');

    if (categoriaForm) {
        categoriaForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Evita que el formulario se envíe de la manera tradicional

            const nombreInput = document.getElementById('categoria-nombre');
            const descripcionInput = document.getElementById('categoria-descripcion');
            const categoriaIdInput = document.getElementById('categoria-id');

            const nombre = nombreInput.value.trim();
            const descripcion = descripcionInput.value.trim();
            const categoriaId = categoriaIdInput.value;

            if (nombre) {
                if (categoriaId) {
                    // Lógica para editar una categoría existente (lo implementaremos más adelante)
                    console.log(`Editar categoría con ID: ${categoriaId}, Nombre: ${nombre}, Descripción: ${descripcion}`);
                    // Aquí actualizaríamos la fila en la tabla con los nuevos datos
                    ocultarModal(); // Cierra el modal después de la edición (simulada)
                } else {
                    // Lógica para crear una nueva categoría
                    const newRow = categoriasList.insertRow(); // Crea una nueva fila al final de la tabla
                    const idCell = newRow.insertCell(0); // Inserta la celda para el ID
                    const nombreCell = newRow.insertCell(1); // Inserta la celda para el Nombre
                    const productosCell = newRow.insertCell(2); // Inserta la celda para Productos
                    const accionesCell = newRow.insertCell(3); // Inserta la celda para Acciones

                    // Simulación de un nuevo ID (en la vida real esto vendría de la base de datos)
                    const newId = categoriasList.rows.length;
                    idCell.textContent = newId;
                    nombreCell.textContent = nombre;
                    productosCell.textContent = 0; // Inicialmente, la nueva categoría no tiene productos

                    // Crear los botones de acción (Editar y Eliminar) para la nueva fila
                    const editButton = document.createElement('button');
                    editButton.textContent = 'Editar';
                    editButton.classList.add('action-btn', 'edit-btn');
                    // Aquí pondremos la lógica para editar cuando la implementemos

                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Eliminar';
                    deleteButton.classList.add('action-btn', 'delete-btn');
                    // Aquí pondremos la lógica para eliminar cuando la implementemos

                    accionesCell.appendChild(editButton);
                    accionesCell.appendChild(deleteButton);

                    ocultarModal(); // Cierra el modal después de guardar la nueva categoría (simulada)

                    // Limpiar los campos del formulario para la próxima vez
                    nombreInput.value = '';
                    descripcionInput.value = '';
                }
            } else {
                alert('El nombre de la categoría es obligatorio.');
            }
        });
    }

    // 6. Establecer el elemento activo en el menú al cargar la página
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.menu-btn, .submenu-btn').forEach(function(link) {
        const href = link.getAttribute('href');
        if (href) {
            const normalizedHref = href.replace('../', '');
            const normalizedCurrent = currentPage.replace('../', '');
            if (normalizedCurrent === normalizedHref ||
                (normalizedHref === 'index.html' && normalizedCurrent === '')) {
                link.classList.add('active');
                if (link.classList.contains('submenu-btn')) {
                    const menuGroup = link.closest('.menu-group');
                    if (menuGroup) {
                        const mainBtn = menuGroup.querySelector('.menu-btn');
                        const submenu = menuGroup.querySelector('.submenu');
                        if (mainBtn && submenu) {
                            mainBtn.classList.add('active');
                            submenu.style.maxHeight = '300px';
                        }
                    }
                }
            }
        }
    });

    // 7. Manejar la apertura y cierre de los submenús al hacer clic en los botones principales que no son enlaces
    document.querySelectorAll('.menu-group > .menu-btn:not([href])').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const submenu = this.nextElementSibling;
            if (submenu && submenu.classList.contains('submenu')) {
                const isOpen = submenu.style.maxHeight === '300px';
                submenu.style.maxHeight = isOpen ? '0' : '300px';
                this.classList.toggle('active');
                const icon = this.querySelector('.icon');
                if (icon) {
                    icon.textContent = isOpen ? '▾' : '▴';
                }
            }
        });
    });

    // 8. Cerrar los submenús al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.menu-group')) {
            document.querySelectorAll('.submenu').forEach(function(submenu) {
                submenu.style.maxHeight = '0';
            });
            document.querySelectorAll('.menu-btn').forEach(function(btn) {
                btn.classList.remove('active');
            });
        }
    });

    console.log('Menú cargado correctamente');
});