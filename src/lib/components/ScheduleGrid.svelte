<script lang="ts">
    // Definimos qué datos recibe el horario
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
</script>

<div class="table-responsive shadow-sm rounded-3 border overflow-hidden">
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
                                    class="h-100 rounded-3 d-flex flex-column align-items-center justify-content-center p-2 text-white shadow-sm border-start border-4 border-white-50"
                                    style="background-color: {asignacion.color}; transition: all 0.2s;"
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

<style>
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

    td {
        background-color: #ffffff;
    }

    /* Efecto sutil al pasar el mouse sobre una clase */
    .h-100:hover {
        filter: brightness(1.1);
        transform: scale(1.02);
    }
</style>