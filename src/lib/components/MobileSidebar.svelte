<script lang="ts">
    import NavLogo from './NavLogo.svelte';
    import NavItem from './NavItem.svelte';
    import LogoutButton from './LogoutButton.svelte';

    let { items, onLogout } = $props();
</script>

<div class="offcanvas offcanvas-start text-white" tabindex="-1" id="offcanvasSidebar" aria-labelledby="offcanvasSidebarLabel">
    <div class="offcanvas-body d-flex flex-column align-items-center vh-100 pt-0 p-0">
        <div class="w-100 flex-column p-2" style="background-color: #F3B105;">
            <NavLogo />
        </div>
        <hr class="border-light" />
        
        <ul class="navbar-nav flex-column w-100 d-flex justify-content-around ps-3 align-items-left flex-grow-1">
            {#each items as item}
                <NavItem {item} />
            {/each}
        </ul>

        <LogoutButton action={onLogout} />
    </div>
</div>

<style>
    .offcanvas {
        background-color: #222F56; /* Color primario de Bootstrap */
        width: 200px;
    }
</style>