<script lang="ts">
    // ============================================================
    // NavItem.svelte — Ítem individual del menú de navegación
    // ============================================================
    // Renderiza un enlace de navegación con ícono y etiqueta.
    // Recibe un objeto MenuItem definido en menus.ts.
    // Se usa tanto en Sidebar como en MobileSidebar.
    // ============================================================
    let { item } = $props(); // item: { icon, label, href }
</script>

<li class="nav-item w-100">
    <!-- href navega a la ruta definida en el objeto MenuItem -->
    <a class="nav-link text-white d-flex align-items-center py-3 ps-3" href={item.href}>
        <i class={item.icon + " me-3 fs-5"}></i> <!-- Ícono Bootstrap Icons -->
        <span class="fw-medium">{item.label}</span>
    </a>
</li>