<script lang="ts">
    import NavLogo from './NavLogo.svelte';
    import NavItem from './NavItem.svelte';
    import LogoutButton from './LogoutButton.svelte';
    let { items, onLogout } = $props();
</script>

<nav class="sidebar-custom d-none d-md-flex flex-column vh-100 p-0">
    <!-- Logo con fondo amarillo CUL -->
    <div class="logo-section w-100 p-2" style="background-color: #F3B105;">
        <NavLogo/>
    </div>

    <hr class="border-light mx-3 my-2 opacity-25" />

    <!-- Área de navegación unificada -->
    <div class="nav-scroll-area flex-grow-1 px-3">
        <ul class="nav flex-column gap-2">
            {#each items as item}
                <NavItem {item} />
            {/each}
        </ul>
    </div>

    <div class="p-3 mt-auto border-top border-secondary border-opacity-25">
        <LogoutButton action={onLogout} />
    </div>
</nav>

<style>
    .sidebar-custom {
        background-color: #222F56;
        width: 250px;
        min-width: 250px;
        border-right: 3px solid #F3B105;
    }

    /* Barra de desplazamiento unificada */
    .nav-scroll-area {
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: #F3B105 transparent;
    }

    /* Forzar estilos de los links */
    :global(.nav-link) {
        color: rgba(255, 255, 255, 0.9) !important;
        padding: 0.8rem 1rem !important;
        border-radius: 8px;
        transition: all 0.2s ease;
    }

    :global(.nav-link:hover) {
        background-color: rgba(255, 255, 255, 0.1);
        color: #F3B105 !important;
    }
</style>