<script lang="ts">
    interface Clase {
        materia: string;
        color: string;
        grupo: string;
    }

    let { horario = {} } = $props<{ horario: Record<string, Clase> }>();

    const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const bloques = [
        '06:00 - 08:00', '08:00 - 10:00', '10:00 - 12:00',
        '14:00 - 16:00', '16:00 - 18:00', '18:00 - 20:00', '20:00 - 22:00'
    ];

    // Construir vista por día para móvil: { Lunes: [{bloque, clase}, ...], ... }
    const horarioPorDia = dias.map(dia => ({
        dia,
        clases: bloques
            .map(bloque => ({ bloque, clase: horario[`${dia}-${bloque}`] ?? null }))
            .filter(b => b.clase !== null)
    })).filter(d => d.clases.length > 0);
</script>

<!-- ===== VISTA ESCRITORIO: tabla completa ===== -->
<div class="d-none d-md-block table-responsive shadow-sm rounded-3 border overflow-hidden">
    <table class="table table-bordered align-middle mb-0 text-center">
        <thead class="table-dark">
            <tr>
                <th style="width: 160px; background-color: #222F56;">Bloque</th>
                {#each dias as dia}
                    <th>{dia}</th>
                {/each}
            </tr>
        </thead>
        <tbody>
            {#each bloques as bloque}
                <tr>
                    <td class="bg-light fw-bold small text-muted py-3">{bloque}</td>
                    {#each dias as dia}
                        {@const asignacion = horario[`${dia}-${bloque}`]}
                        <td class="p-1" style="height: 90px; min-width: 140px;">
                            {#if asignacion}
                                <div 
                                    class="h-100 rounded-3 d-flex flex-column align-items-center justify-content-center p-2 text-white shadow-sm"
                                    style="background-color: {asignacion.color};"
                                >
                                    <strong style="font-size: 0.8rem; line-height: 1.1;">{asignacion.materia}</strong>
                                    <span class="badge bg-white text-dark mt-2" style="font-size: 0.65rem;">
                                        Grupo: {asignacion.grupo}
                                    </span>
                                </div>
                            {:else}
                                <div class="h-100 d-flex align-items-center justify-content-center opacity-25">
                                    <i class="bi bi-dash-lg"></i>
                                </div>
                            {/if}
                        </td>
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<!-- ===== VISTA MÓVIL: tarjetas por día ===== -->
<div class="d-md-none">
    {#if horarioPorDia.length === 0}
        <div class="text-center text-muted py-4">
            <i class="bi bi-calendar-x fs-2 opacity-50"></i>
            <p class="mt-2 small">Sin clases asignadas</p>
        </div>
    {:else}
        {#each horarioPorDia as { dia, clases }}
            <div class="mb-3">
                <!-- Encabezado del día -->
                <div class="px-3 py-2 fw-bold text-white rounded-top-3 small text-uppercase"
                     style="background-color: #222F56; letter-spacing: 0.5px;">
                    <i class="bi bi-calendar3 me-2"></i>{dia}
                </div>
                <!-- Clases del día -->
                <div class="border border-top-0 rounded-bottom-3 overflow-hidden">
                    {#each clases as { bloque, clase }, i}
                        <div class="d-flex align-items-stretch"
                             class:border-top={i > 0}
                             style="min-height: 70px;">
                            <!-- Franja horaria -->
                            <div class="d-flex align-items-center justify-content-center px-2 bg-light border-end"
                                 style="min-width: 110px; font-size: 0.72rem; font-weight: 600; color: #666;">
                                <i class="bi bi-clock me-1"></i>{bloque}
                            </div>
                            <!-- Tarjeta de la materia -->
                            <div class="flex-grow-1 d-flex align-items-center p-2"
                                 style="background-color: {clase.color}10; border-left: 4px solid {clase.color};">
                                <div>
                                    <div class="fw-bold" style="color: {clase.color}; font-size: 0.85rem;">
                                        {clase.materia}
                                    </div>
                                    <span class="badge mt-1" style="background-color: {clase.color}; font-size: 0.65rem;">
                                        Grupo {clase.grupo}
                                    </span>
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        {/each}
    {/if}
</div>

<style>
    /* Escritorio */
    table {
        min-width: 900px;
        border-collapse: separate;
        border-spacing: 0;
    }

    th {
        font-weight: 600;
        text-transform: uppercase;
        font-size: 0.85rem;
        letter-spacing: 0.5px;
        padding: 1rem !important;
    }

    td { background-color: #ffffff; }

    .h-100:hover {
        filter: brightness(1.1);
        transform: scale(1.02);
    }
</style>