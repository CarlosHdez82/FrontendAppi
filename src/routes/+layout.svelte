<script>
    // ============================================================
    // +layout.svelte — Layout raíz de la aplicación
    // ============================================================
    // Es el layout base que envuelve TODAS las páginas del proyecto,
    // tanto las de autenticación como las protegidas.
    //
    // Responsabilidades:
    // - Cargar Bootstrap JS dinámicamente solo en el cliente
    // - Configurar el ícono, título y estilos globales en el <head>
    // - Renderizar las páginas hijas mediante {@render children()}
    //
    // Bootstrap se importa con onMount para evitar errores de SSR,
    // ya que el objeto 'window' no existe en el servidor.
    // @ts-ignore suprime el error de TypeScript por la importación dinámica.
    // ============================================================
    import { onMount } from 'svelte';
    let { children } = $props();

    onMount(async () => {
        // Carga Bootstrap JS solo en el navegador (no en el servidor)
        // @ts-ignore
        await import('bootstrap/dist/js/bootstrap.bundle.min.js');
    });
</script>

<svelte:head>
    <!-- Ícono de la pestaña del navegador -->
    <link rel="icon" href="/logo.png" />
    <!-- Título que aparece en la pestaña del navegador -->
    <title>Universidad CUL - Gestión de Horarios</title>
    <!-- Bootstrap Icons cargado desde CDN -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
</svelte:head>

{@render children()}