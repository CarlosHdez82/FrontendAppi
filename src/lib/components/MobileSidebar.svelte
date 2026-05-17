<script lang="ts">
    // ============================================================
    // MobileSidebar.svelte — Sidebar móvil (Offcanvas Bootstrap)
    // ============================================================
    // Versión del sidebar para dispositivos móviles.
    // Se muestra como panel deslizante (offcanvas) activado
    // por el botón hamburguesa del Header.
    // Se cierra automáticamente al hacer clic en un enlace.
    // ============================================================
    import NavLogo from './NavLogo.svelte';
    import NavItem from './NavItem.svelte';
    import LogoutButton from './LogoutButton.svelte';

    let { items, onLogout } = $props();

    // ------------------------------------------------------------
    // Cierra el offcanvas al navegar a otra página
    // Detecta si el clic fue sobre un enlace <a> y oculta el panel
    // usando la instancia de Bootstrap Offcanvas
    // ------------------------------------------------------------
    function manejarNavegacion(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (target.closest('a')) {
            const el = document.getElementById('offcanvasSidebar');
            if (el) {
                // @ts-ignore — bootstrap es una variable global cargada por CDN
                const inst = bootstrap.Offcanvas.getInstance(el);
                if (inst) inst.hide();
            }
        }
    }
</script>

<!-- Offcanvas de Bootstrap: panel deslizante desde la izquierda -->
<div class="offcanvas offcanvas-start text-white sidebar-custom-mobile" tabindex="-1" id="offcanvasSidebar">
    <div class="offcanvas-body d-flex flex-column p-0">
        <!-- Logo idéntico al sidebar de escritorio -->
        <div class="w-100 p-2 text-center" style="background-color: #F3B105;">
            <NavLogo />
        </div>

        <hr class="border-light mx-3 my-2 opacity-25" />

        <!--
            Al hacer clic en cualquier enlace se cierra el offcanvas.
            role="presentation" indica que el div no tiene rol semántico propio.
        -->
        <div
            class="nav-scroll-area flex-grow-1 px-3"
            onclick={manejarNavegacion}
            onkeydown={(e) => e.key === 'Enter' && manejarNavegacion}
            role="presentation"
        >
            <ul class="nav flex-column gap-2">
                {#each items as item}
                    <NavItem {item} />
                {/each}
            </ul>
        </div>

        <div class="p-3 mt-auto border-top border-secondary border-opacity-25">
            <LogoutButton action={onLogout} />
        </div>
    </div>
</div>

<style>
    /* Ancho máximo del 75% en móviles para no tapar toda la pantalla */
    .sidebar-custom-mobile {
        background-color: #222F56 !important;
        width: 250px !important;
        max-width: 75% !important;
        border-right: 3px solid #F3B105;
    }

    .nav-scroll-area {
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: #F3B105 transparent;
    }

    :global(.nav-link) {
        color: rgba(255, 255, 255, 0.9) !important;
        padding: 0.8rem 1rem !important;
    }
</style>