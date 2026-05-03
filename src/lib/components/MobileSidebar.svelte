<script lang="ts">
    import NavLogo from './NavLogo.svelte';
    import NavItem from './NavItem.svelte';
    import LogoutButton from './LogoutButton.svelte';

    let { items, onLogout } = $props();

    function manejarNavegacion(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (target.closest('a')) {
            const el = document.getElementById('offcanvasSidebar');
            if (el) {
                // @ts-ignore
                const inst = bootstrap.Offcanvas.getInstance(el);
                if (inst) inst.hide();
            }
        }
    }
</script>

<div class="offcanvas offcanvas-start text-white sidebar-custom-mobile" tabindex="-1" id="offcanvasSidebar">
    <div class="offcanvas-body d-flex flex-column p-0">
        <!-- Logo idéntico al de escritorio -->
        <div class="w-100 p-2 text-center" style="background-color: #F3B105;">
            <NavLogo />
        </div>
        
        <hr class="border-light mx-3 my-2 opacity-25" />
        
        <!-- Área de navegación idéntica -->
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

    /* Sincronización de links con escritorio */
    :global(.nav-link) {
        color: rgba(255, 255, 255, 0.9) !important;
        padding: 0.8rem 1rem !important;
    }
</style>