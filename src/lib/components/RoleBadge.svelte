<script lang="ts">
    let { roleId } = $props();
    
    // Mapeo para los roles
    const config: Record<number, {label: string, icon: string, color: string}> = {
        1: { label: 'Admin', icon: 'bi-shield-lock', color: 'text-dark bg-light' },
        2: { label: 'Coordinación', icon: 'bi-person-badge', color: 'text-primary bg-primary-subtle' },
        3: { label: 'Docente', icon: 'bi-person-workspace', color: 'text-secondary bg-secondary-subtle' },
        4: { label: 'Estudiante', icon: 'bi-mortarboard', color: 'text-success bg-success-subtle' }
    };

    // Fallback por si llega un ID no definido
    let current = $derived(config[roleId] || { label: 'Invitado', icon: 'bi-person', color: 'bg-light text-muted' });
</script>

<span class="badge {current.color} border d-inline-flex align-items-center">
    <i class="bi {current.icon} me-1"></i> {current.label}
</span>

<style>
    .badge {
        font-weight: 600;
        padding: 0.4em 0.7em;
        letter-spacing: 0.3px;
    }
</style>