<script>
    // ============================================================
    // (app)/+layout.svelte — Layout del grupo de páginas protegidas
    // ============================================================
    // Layout que envuelve todas las páginas que requieren
    // autenticación. Monta el AppLayout con Sidebar y Header,
    // y carga Bootstrap JS en el cliente.
    //
    // El grupo (app) agrupa todas las rutas protegidas:
    // /admi/*, /faculty/*, /teacher/*, /perfil
    //
    // Nota: Bootstrap se importa aquí además del layout raíz
    // para garantizar que los modales y offcanvas funcionen
    // correctamente en las páginas protegidas.
    // ============================================================
    import AppLayout from '$lib/components/AppLayout.svelte';
    import MainContent from '$lib/components/MainContent.svelte';
    import { onMount } from 'svelte';

    let { children } = $props();

    onMount(async () => {
        // Carga Bootstrap JS solo en el navegador (no en el servidor)
        // @ts-ignore
        await import('bootstrap/dist/js/bootstrap.bundle.min.js');
    });
</script>

<svelte:head>
    <link rel="icon" href="/logo.png" />
    <title>Universidad CUL - Gestión de Horarios</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
</svelte:head>

<!-- AppLayout ensambla Sidebar + Header + área de contenido -->
<AppLayout>
    <MainContent>
        {@render children()}
    </MainContent>
</AppLayout>