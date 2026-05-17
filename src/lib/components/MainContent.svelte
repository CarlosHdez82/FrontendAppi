<script lang="ts">
    // ============================================================
    // MainContent.svelte — Área principal de contenido
    // ============================================================
    // Contenedor que envuelve el contenido de cada página.
    // Maneja el scroll vertical del área de trabajo y aplica
    // el fondo y padding estándar de la aplicación.
    // ============================================================
    let { children } = $props();
</script>

<!-- overflow-auto permite scroll vertical cuando el contenido supera la altura -->
<main class="container-fluid bg-body-tertiary flex-grow-1 p-3 overflow-auto">
    {#if children}
        {@render children()}
    {/if}
</main>

<style>
    main {
        min-height: 0; /* Necesario para que flex-grow funcione correctamente en Firefox */
        scrollbar-width: thin;
        scrollbar-color: #F3B105 transparent; /* Scrollbar color amarillo CUL */
    }
</style>