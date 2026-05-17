<script>
    // ============================================================
    // (auth)/+layout.svelte — Layout del grupo de autenticación
    // ============================================================
    // Layout minimalista para las páginas de autenticación.
    // El grupo (auth) agrupa las rutas públicas (login, registro).
    // No incluye Sidebar ni Header ya que el usuario aún no
    // ha iniciado sesión.
    //
    // Los paréntesis en el nombre de la carpeta "(auth)" indican
    // que es un grupo de rutas en SvelteKit: no afecta la URL
    // pero permite compartir este layout entre sus páginas.
    // ============================================================
    let { children } = $props();
</script>

{@render children()}