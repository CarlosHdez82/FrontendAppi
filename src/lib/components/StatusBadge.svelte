<script lang="ts">
    let { active = true } = $props();
</script>

<span class="badge {active ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'} border px-2 py-1">
    <i class="bi {active ? 'bi-check-circle-fill' : 'bi-x-circle-fill'} me-1"></i>
    {active ? 'Activo' : 'Inactivo'}
</span>

<style>
    .badge { font-weight: 600; font-size: 0.75rem; }
</style>