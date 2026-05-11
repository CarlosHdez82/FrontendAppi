<script lang="ts">
    let { 
        disponibilidad = new Set<string>(), 
        bloqueSeleccionado = "", 
        bloquesAsignados = new Set<string>(),
        onBloqueClick = null 
    } = $props<{
        disponibilidad: Set<string>;
        bloqueSeleccionado?: string;
        bloquesAsignados?: Set<string>;
        onBloqueClick?: ((bloqueId: string) => void) | null;
    }>();

    const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const bloques = [
        '06:00 - 08:00', '08:00 - 10:00', '10:00 - 12:00',
        '14:00 - 16:00', '16:00 - 18:00', '18:00 - 20:00', '20:00 - 22:00'
    ];

    function handleClick(id: string) {
        if (onBloqueClick && disponibilidad.has(id) && !bloquesAsignados.has(id)) {
            onBloqueClick(id);
        }
    }
</script>

<div class="table-responsive-container border rounded shadow-sm">
    <table class="table table-bordered text-center align-middle mb-0 unselectable">
        <thead>
            <tr>
                <th class="hora-col">Hora / Día</th>
                {#each dias as dia}
                    <th class="small">{dia}</th>
                {/each}
            </tr>
        </thead>
        <tbody>
            {#each bloques as bloque}
                <tr>
                    <td class="fw-bold bg-light small text-muted">{bloque}</td>
                    {#each dias as dia}
                        {@const id = `${dia}-${bloque}`}
                        {@const esDisponible = disponibilidad.has(id)}
                        {@const esSeleccionado = bloqueSeleccionado === id}
                        {@const esAsignado = bloquesAsignados.has(id)}
                        <td
                            class="celda"
                            class:disponible={esDisponible && !esAsignado && !esSeleccionado}
                            class:seleccionado={esSeleccionado}
                            class:asignado={esAsignado && !esSeleccionado}
                            class:ocupado={!esDisponible && !esAsignado}
                            class:clickable={esDisponible && !esAsignado && onBloqueClick}
                            onclick={() => handleClick(id)}
                            role="gridcell"
                            aria-selected={esSeleccionado}
                        >
                            {#if esSeleccionado}
                                <span class="badge text-white small" style="background-color:#222F56;">
                                    <i class="bi bi-check2"></i> Asignado
                                </span>
                            {:else if esAsignado}
                                <span class="badge small" style="background-color:#198754; color:white;">
                                    <i class="bi bi-lock-fill me-1"></i>Ocupado
                                </span>
                            {:else if esDisponible}
                                <span class="badge text-dark small" style="background-color:#F3B105;">
                                    Libre
                                </span>
                            {/if}
                        </td>
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<div class="d-flex gap-3 mt-2 small text-muted flex-wrap">
    <span><span class="badge me-1" style="background-color:#F3B105; color:#000;">Libre</span> Disponible para asignar</span>
    <span><span class="badge me-1" style="background-color:#222F56;">Asignado</span> Bloque en formulario</span>
    <span><span class="badge me-1" style="background-color:#198754;">Ocupado</span> Ya tiene clase</span>
    <span><span class="badge bg-light border me-1 text-muted">—</span> No disponible</span>
</div>

<style>
    .unselectable { user-select: none; }

    .table-responsive-container {
        width: 100%;
        overflow-x: auto;
        background-color: white;
    }

    table {
        min-width: 650px;
        border-collapse: separate;
        border-spacing: 0;
    }

    .hora-col {
        width: 120px;
        background-color: #222F56 !important;
        color: white;
        font-size: 0.75rem;
    }

    th {
        background-color: #2d3a60;
        color: white;
        font-size: 0.75rem;
        font-weight: 600;
        padding: 0.5rem !important;
    }

    .celda {
        height: 50px;
        transition: background-color 0.1s ease;
    }

    .asignado {
        background-color: #d1e7dd !important;
        border-color: #198754 !important;
        cursor: not-allowed;
    }

    .clickable {
        cursor: pointer;
    }

    .clickable:hover {
        background-color: #ffe066 !important;
        border-color: #d4a800 !important;
        transform: scale(1.03);
        transition: transform 0.1s ease;
    }

    .disponible {
        background-color: #fffbea;
        border-color: #F3B105 !important;
    }

    .seleccionado {
        background-color: #e8eaf6 !important;
        border-color: #222F56 !important;
    }

    .ocupado {
        background-color: #f8f9fa;
    }
</style>
