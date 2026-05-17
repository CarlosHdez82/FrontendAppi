<script lang="ts">
    // ============================================================
    // StatusBadge.svelte — Indicador de estado activo/inactivo
    // ============================================================
    // Muestra un badge verde (Activo) o rojo (Inactivo) según
    // el valor booleano de la prop 'active'.
    // Se usa en tablas de facultades, programas, materias, etc.
    // ============================================================
    let { active = true } = $props(); // Por defecto muestra Activo
</script>

<!-- Color y texto cambian dinámicamente según el valor de active -->
<span class="badge {active ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'} border px-2 py-1">
    <i class="bi {active ? 'bi-check-circle-fill' : 'bi-x-circle-fill'} me-1"></i>
    {active ? 'Activo' : 'Inactivo'}
</span>

<style>
    .badge { font-weight: 600; font-size: 0.75rem; }
</style>