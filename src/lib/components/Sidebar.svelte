<script lang="ts">
    import NavLogo from './NavLogo.svelte';
    import NavItem from './NavItem.svelte';
    import LogoutButton from './LogoutButton.svelte';
    let { items, onLogout } = $props();
</script>

<nav class="navbar navbar-light bg-primary text-white flex-column vh-100 d-none d-md-flex" style="width: 200px;">
    <NavLogo />
    <hr class="border-light w-100" />
    <ul class="navbar-nav flex-column w-100 mb-auto gap-4 ps-3">
        {#each items as item}
            <NavItem {item} />
        {/each}
    </ul>
    <LogoutButton action={onLogout} />
</nav>