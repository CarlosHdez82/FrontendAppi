<script lang="ts">
    import NavLogo from './NavLogo.svelte';
    import NavItem from './NavItem.svelte';
    import LogoutButton from './LogoutButton.svelte';

    let { items, onLogout } = $props();
</script>

<div class="offcanvas offcanvas-start bg-primary text-white" tabindex="-1" id="offcanvasSidebar" aria-labelledby="offcanvasSidebarLabel" style="width: 200px;">
    <div class="offcanvas-body d-flex flex-column align-items-center vh-100">
        <NavLogo />
        <hr class="border-light w-100" />
        
        <ul class="navbar-nav flex-column w-100 d-flex justify-content-around ps-3 align-items-left flex-grow-1">
            {#each items as item}
                <NavItem {item} />
            {/each}
        </ul>

        <LogoutButton action={onLogout} />
    </div>
</div>