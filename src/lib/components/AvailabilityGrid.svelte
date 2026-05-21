<script lang="ts">
    // ============================================================
    // AvailabilityGrid.svelte — Grid interactivo de disponibilidad
    // ============================================================
    // Muestra una tabla de días × bloques horarios donde el docente
    // puede marcar su disponibilidad haciendo clic o arrastrando.
    //
    // Estados visuales de cada celda:
    //   Blanco  → no disponible (sin marcar)
    //   Amarillo → disponible (marcado por el docente)
    //   Verde   → tiene clase asignada por el coordinador (no editable)
    //
    // Props:
    //   seleccion      — Set<string> bindable con las claves "Día-bloque"
    //                    de los bloques que el docente marcó como disponibles.
    //   bloquesAsignados — Set<string> opcional con las claves "Día-bloque"
    //                    de los bloques que ya tienen una clase asignada.
    //                    Estos bloques se muestran en verde y no se pueden editar.
    // ============================================================

    // $bindable permite que el padre lea y escriba 'seleccion' directamente.
    // bloquesAsignados es de solo lectura: el padre lo pasa, aquí no se modifica.
    let { seleccion = $bindable(), bloquesAsignados = new Set<string>() } = $props<{
        seleccion: Set<string>;
        bloquesAsignados?: Set<string>;
    }>();

    // Columnas del grid: días hábiles de la semana
    const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    // Filas del grid: bloques horarios de 2 horas cada uno (modelo CUL)
    const bloques = [
        '06:00 - 08:00', '08:00 - 10:00', '10:00 - 12:00',
        '14:00 - 16:00', '16:00 - 18:00', '18:00 - 20:00', '20:00 - 22:00'
    ];

    // Rastrea si el botón del mouse está presionado para permitir selección por arrastre
    let isMouseDown = false;

    // Al presionar el mouse sobre una celda: activa el modo arrastre y alterna esa celda
    function handleMouseDown(id: string) {
        isMouseDown = true;
        toggleBloque(id);
    }

    // Al entrar a una celda mientras el mouse está presionado: la alterna (efecto arrastre)
    function handleMouseEnter(id: string) {
        if (isMouseDown) toggleBloque(id);
    }

    // Al soltar el mouse (capturado en svelte:window): desactiva el modo arrastre
    function handleMouseUp() {
        isMouseDown = false;
    }

    // Alterna el estado de un bloque entre seleccionado y no seleccionado.
    // Si el bloque ya tiene clase asignada, no hace nada (protegido).
    // Reasigna el Set para que Svelte 5 detecte el cambio reactivo.
    function toggleBloque(id: string) {
        if (bloquesAsignados.has(id)) return; // Bloque con clase: no editable
        if (seleccion.has(id)) {
            seleccion.delete(id);
        } else {
            seleccion.add(id);
        }
        // Svelte 5 no detecta mutaciones internas de Set; reasignar fuerza la reactividad
        seleccion = new Set(seleccion);
    }
</script>

<!--
    svelte:window captura el evento mouseup globalmente.
    Esto es necesario porque si el usuario suelta el mouse fuera de la tabla,
    el evento no llegaría a ninguna celda y isMouseDown quedaría en true,
    haciendo que el siguiente hover siga alternando celdas sin querer.
-->
<svelte:window onmouseup={handleMouseUp} />

<!-- Contenedor con scroll horizontal para pantallas pequeñas -->
<div class="table-responsive-container shadow-sm border rounded">
    <!--
        .unselectable evita que el texto de las celdas se seleccione
        mientras el usuario arrastra el mouse para marcar bloques.
    -->
    <table class="table table-bordered text-center align-middle mb-0 unselectable">

        <!-- Encabezado: primera celda fija (Hora / Día) + un th por cada día -->
        <thead class="table-dark">
            <tr>
                <th class="hora-col">Hora / Día</th>
                {#each dias as dia}
                    <th>{dia}</th>
                {/each}
            </tr>
        </thead>

        <tbody>
            <!-- Una fila por cada bloque horario -->
            {#each bloques as bloque}
                <tr>
                    <!-- Celda fija con la etiqueta del bloque horario -->
                    <td class="fw-bold bg-light small">{bloque}</td>

                    <!-- Una celda por cada día dentro del bloque actual -->
                    {#each dias as dia}
                        <!--
                            La clave 'id' identifica unívocamente esta celda.
                            Formato: "Día-bloque" → ej. "Lunes-06:00 - 08:00"
                            Es el mismo formato que usan los Sets seleccion y bloquesAsignados.
                        -->
                        {@const id = `${dia}-${bloque}`}
                        <td
                            class="celda-disponibilidad"
                            class:seleccionada={seleccion.has(id) && !bloquesAsignados.has(id)}
                            class:asignada={bloquesAsignados.has(id)}
                            onmousedown={() => handleMouseDown(id)}
                            onmouseenter={() => handleMouseEnter(id)}
                            role="gridcell"
                            aria-selected={seleccion.has(id)}
                        >
                            <!--
                                Prioridad de badges:
                                1. "Con clase" (verde) si el coordinador asignó una clase aquí
                                2. "Disponible" (amarillo) si el docente marcó este bloque
                                3. Sin badge si la celda está vacía
                            -->
                            {#if bloquesAsignados.has(id)}
                                <span class="badge text-white">Con clase</span>
                            {:else if seleccion.has(id)}
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
    /* Impide selección de texto al arrastrar el mouse sobre las celdas */
    .unselectable {
        user-select: none;
    }

    /* Permite scroll horizontal en pantallas pequeñas sin romper el layout */
    .table-responsive-container {
        width: 100%;
        overflow-x: auto;
        background-color: white;
    }

    /* Ancho mínimo para que la tabla no colapse en pantallas angostas */
    table {
        min-width: 850px;
        border-collapse: separate;
        border-spacing: 0;
    }

    /* Celda de encabezado de hora: color institucional CUL */
    .hora-col {
        width: 150px;
        background-color: #222F56 !important;
        color: white;
    }

    /* Estado base de cada celda del grid: blanco, cursor pointer */
    .celda-disponibilidad {
        height: 60px;
        cursor: pointer;
        transition: background-color 0.15s ease;
        background-color: #ffffff;
        border: 1px solid #dee2e6;
    }

    /* Hover suave en celdas no marcadas para indicar que son interactivas */
    .celda-disponibilidad:hover {
        background-color: #fff3cd;
    }

    /* Bloque marcado como disponible por el docente — amarillo institucional CUL */
    .seleccionada {
        background-color: #F3B105 !important;
        border-color: #d99e04 !important;
    }

    /* Bloque con clase asignada por el coordinador — verde, cursor bloqueado */
    .asignada {
        background-color: #198754 !important;
        border-color: #146c43 !important;
        cursor: not-allowed; /* Indica visualmente que la celda no es editable */
    }

    /* Hover del bloque asignado: verde más oscuro para mantener la coherencia visual */
    .asignada:hover {
        background-color: #157347 !important;
    }

    /* Badge pequeño dentro de la celda que indica su estado con texto */
    .badge {
        font-size: 0.65rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
</style>