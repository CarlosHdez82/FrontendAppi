<script>
    import { onMount } from 'svelte';
    let { children } = $props();

    onMount(async () => {
        // @ts-ignore
        await import('bootstrap/dist/js/bootstrap.bundle.min.js');
    });
</script>

<svelte:head>
    <link rel="icon" href="/logo.png" />
    <title>Universidad CUL - Gestión de Horarios</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
</svelte:head>

{@render children()}