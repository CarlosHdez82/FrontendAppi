<script lang="ts">
    import NavLogo from './NavLogo.svelte';
    import NavItem from './NavItem.svelte';
    import LogoutButton from './LogoutButton.svelte';
    let { items, onLogout } = $props();
</script>

<nav class="navbar navbar-light text-white flex-column vh-100 d-none d-md-flex p-0">
    <div class="w-100 flex-column p-2" style="background-color: #F3B105;">
        <NavLogo/>
    </div>

    <hr class="border-light" />
    <ul class="navbar-nav flex-column w-100 mb-auto gap-4 ps-3">
        {#each items as item}
            <NavItem {item} />
        {/each}
    </ul>
    <LogoutButton action={onLogout} />
</nav>

<style>
    .navbar {
        background-color: #222F56; /* Color primario de Bootstrap */
        width: 200px;
    }
</style>