<script lang="ts">
    // ============================================================
    // NavLogo.svelte — Logo institucional de la CUL
    // ============================================================
    // Componente reutilizable para mostrar el logo de la universidad.
    // Acepta props opcionales para personalizar tamaño y clase CSS.
    // Se usa en Sidebar, MobileSidebar y la página de login.
    // ============================================================

    // Props con valores por defecto
    let { width = 100, height = 40, className = "d-block mx-auto mb-1" } = $props();
</script>

<div class="nav-logo mb-2">
    <img src="/logo.png" alt="Logo CUL" {width} {height} class={className} />
</div>