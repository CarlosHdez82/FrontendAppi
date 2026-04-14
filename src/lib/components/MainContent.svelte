<script lang="ts">
    let { children } = $props();
</script>

<main class="container-fluid bg-body-tertiary flex-grow-1 p-3 overflow-auto">
    {#if children}
        {@render children()}
    {/if}
</main>

<style>
    /* Asegura que el área de contenido ocupe el espacio restante */
    main {
        min-height: 0; 
    }
</style>