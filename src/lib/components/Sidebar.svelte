<script lang="ts">
    // ============================================================
    // Sidebar.svelte — Barra lateral de navegación (escritorio)
    // ============================================================
    // Visible solo en pantallas medianas y grandes (d-md-flex).
    // Muestra el logo, los ítems de navegación del rol activo
    // y el botón de cerrar sesión al fondo.
    // ============================================================
    import NavLogo from './NavLogo.svelte';
    import NavItem from './NavItem.svelte';
    import LogoutButton from './LogoutButton.svelte';

    // items: lista de ítems del menú según el rol del usuario
    // onLogout: función para cerrar sesión pasada desde AppLayout
    let { items, onLogout } = $props();
</script>

<!-- d-none d-md-flex: oculto en móvil, visible en escritorio -->
<nav class="sidebar-custom d-none d-md-flex flex-column vh-100 p-0">
    <!-- Sección del logo con fondo amarillo institucional CUL -->
    <div class="logo-section w-100 p-2" style="background-color: #F3B105;">
        <NavLogo/>
    </div>

    <hr class="border-light mx-3 my-2 opacity-25" />

    <!-- Área de navegación con scroll si los ítems superan la altura -->
    <div class="nav-scroll-area flex-grow-1 px-3">
        <ul class="nav flex-column gap-2">
            {#each items as item}
                <NavItem {item} />
            {/each}
        </ul>
    </div>

    <!-- Botón de cerrar sesión fijado al fondo del sidebar -->
    <div class="p-3 mt-auto border-top border-secondary border-opacity-25">
        <LogoutButton action={onLogout} />
    </div>
</nav>

<style>
    /* Ancho fijo del sidebar con color azul institucional CUL */
    .sidebar-custom {
        background-color: #222F56;
        width: 250px;
        min-width: 250px;
        border-right: 3px solid #F3B105; /* Borde amarillo institucional */
    }

    /* Scroll suave con scrollbar personalizado color CUL */
    .nav-scroll-area {
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: #F3B105 transparent;
    }

    /* Estilo base de los links de navegación */
    :global(.nav-link) {
        color: rgba(255, 255, 255, 0.9) !important;
        padding: 0.8rem 1rem !important;
        border-radius: 8px;
        transition: all 0.2s ease;
    }

    /* Efecto hover: fondo translúcido y color amarillo */
    :global(.nav-link:hover) {
        background-color: rgba(255, 255, 255, 0.1);
        color: #F3B105 !important;
    }
</style>