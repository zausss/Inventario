/**
 * Funcionalidades comunes a todas las páginas
 * - Manejo del menú lateral
 * - Navegación entre páginas (establecimiento del estado activo)
 * - Cierre de submenús al hacer clic fuera*/
document.addEventListener('DOMContentLoaded', function() {
    // --- SECCIÓN DEL MENÚ LATERAL ---
    // Establecer el elemento activo en el menú al cargar la página
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

    // Manejar la apertura y cierre de los submenús al hacer clic en los botones principales que no son enlaces
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

    // Cerrar los submenús al hacer clic fuera
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