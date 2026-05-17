<script lang="ts">
    // ============================================================
    // RoleBadge.svelte — Indicador visual de rol de usuario
    // ============================================================
    // Muestra un badge con el nombre e ícono del rol según el
    // role_id numérico del usuario. Se usa en la tabla de usuarios.
    //
    // Mapeo de IDs:
    //   1 → Administrador
    //   2 → Coordinador (faculty)
    //   3 → Docente (teacher)
    // ============================================================
    let { roleId } = $props();

    // Configuración visual por role_id
    const config: Record<number, {label: string, icon: string, color: string}> = {
        1: { label: 'Admin',        icon: 'bi-shield-lock',      color: 'text-dark bg-light' },
        2: { label: 'Coordinación', icon: 'bi-person-badge',     color: 'text-primary bg-primary-subtle' },
        3: { label: 'Docente',      icon: 'bi-person-workspace', color: 'text-secondary bg-secondary-subtle' }
    };

    // Si el role_id no está en el mapa, muestra "Invitado" como fallback
    let current = $derived(config[roleId] || { label: 'Invitado', icon: 'bi-person', color: 'bg-light text-muted' });
</script>

<span class="badge {current.color} border d-inline-flex align-items-center">
    <i class="bi {current.icon} me-1"></i> {current.label}
</span>

<style>
    .badge { font-weight: 600; padding: 0.4em 0.7em; letter-spacing: 0.3px; }
</style>