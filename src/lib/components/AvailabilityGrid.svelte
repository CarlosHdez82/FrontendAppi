<script lang="ts">
    // Recibimos la selección actual para que sea reactiva con el padre
    let { seleccion = $bindable() } = $props<{ seleccion: Set<string> }>();

    const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const bloques = [
        '06:00 - 08:00', '08:00 - 10:00', '10:00 - 12:00',
        '14:00 - 16:00', '16:00 - 18:00', '18:00 - 20:00', '20:00 - 22:00'
    ];

    let isMouseDown = false;

    function handleMouseDown(id: string) {
        isMouseDown = true;
        toggleBloque(id);
    }

    function handleMouseEnter(id: string) {
        if (isMouseDown) toggleBloque(id);
    }

    function handleMouseUp() {
        isMouseDown = false;
    }

    function toggleBloque(id: string) {
        if (seleccion.has(id)) {
            seleccion.delete(id);
        } else {
            seleccion.add(id);
        }
        // Forzamos la actualización en Svelte 5 para el Set
        seleccion = new Set(seleccion);
    }
</script>

<svelte:window onmouseup={handleMouseUp} />

<div class="table-responsive-container shadow-sm border rounded">
    <table class="table table-bordered text-center align-middle mb-0 unselectable">
        <thead class="table-dark">
            <tr>
                <th class="hora-col">Hora / Día</th>
                {#each dias as dia}
                    <th>{dia}</th>
                {/each}
            </tr>
        </thead>
        <tbody>
            {#each bloques as bloque}
                <tr>
                    <td class="fw-bold bg-light small">{bloque}</td>
                    {#each dias as dia}
                        {@const id = `${dia}-${bloque}`}
                        <td 
                            class="celda-disponibilidad"
                            class:seleccionada={seleccion.has(id)}
                            onmousedown={() => handleMouseDown(id)}
                            onmouseenter={() => handleMouseEnter(id)}
                            role="gridcell"
                            aria-selected={seleccion.has(id)}
                        >
                            {#if seleccion.has(id)}
                                <span class="badge text-dark">Disponible</span>
                            {/if}
                        </td>
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<style>
    .unselectable {
        user-select: none; /* Evita que se seleccione texto al arrastrar el mouse */
    }

    .table-responsive-container {
        width: 100%;
        overflow-x: auto;
        background-color: white;
    }

    table {
        min-width: 850px;
        border-collapse: separate;
        border-spacing: 0;
    }

    .hora-col {
        width: 150px;
        background-color: #222F56 !important;
        color: white;
    }

    .celda-disponibilidad {
        height: 60px;
        cursor: pointer;
        transition: background-color 0.15s ease;
        background-color: #ffffff;
        border: 1px solid #dee2e6;
    }

    .celda-disponibilidad:hover {
        background-color: #fff3cd;
    }

    .seleccionada {
        background-color: #F3B105 !important; /* Amarillo CUL */
        border-color: #d99e04 !important;
    }

    .badge {
        font-size: 0.65rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
</style>