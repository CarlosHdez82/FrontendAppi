<script>
    import AppLayout from '$lib/components/AppLayout.svelte';
    import MainContent from '$lib/components/MainContent.svelte';
    import { onMount } from 'svelte';
    
    let { children } = $props();

    onMount(async () => {
        // Esto carga el JS de Bootstrap solo en el cliente
        // @ts-ignore
        await import('bootstrap/dist/js/bootstrap.bundle.min.js');
    });
</script>

<svelte:head>
    <link rel="icon" href="/logo.png" />
    <title>Universidad CUL - Gestión de Horarios</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
</svelte:head>

<AppLayout>
    <MainContent>
        {@render children()}
    </MainContent>
</AppLayout>