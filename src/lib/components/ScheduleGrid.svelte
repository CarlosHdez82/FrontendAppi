<script lang="ts">
    // ============================================================
    // ScheduleGrid.svelte — Grilla visual de horarios
    // ============================================================
    // Muestra los horarios asignados en formato de tabla (escritorio)
    // o tarjetas por día (móvil). Recibe un objeto 'horario' donde
    // cada clave es "Dia-Bloque" y el valor contiene los datos
    // de la clase asignada.
    //
    // Ejemplo de estructura del prop horario:
    // {
    //   "Lunes-06:00 - 08:00": { materia: "Cálculo", color: "#e74c3c", grupo: "A" },
    //   "Martes-14:00 - 16:00": { materia: "Bases de Datos", color: "#3498db", grupo: "CN" }
    // }
    // ============================================================

    // Tipo que representa una clase asignada en una celda del grid
    interface Clase {
        materia: string; // Nombre de la materia
        color: string;   // Color hexadecimal para identificar visualmente la materia
        grupo: string;   // Código del grupo (ej: "A", "CN", "AN")
    }

    // horario: objeto indexado por "Dia-Bloque" con los datos de cada clase
    let { horario = {} } = $props<{ horario: Record<string, Clase> }>();

    // ------------------------------------------------------------
    // Definición de días y bloques horarios disponibles
    // Estos arrays determinan las filas y columnas de la tabla
    // ------------------------------------------------------------
    const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const bloques = [
        '06:00 - 08:00', '08:00 - 10:00', '10:00 - 12:00',
        '14:00 - 16:00', '16:00 - 18:00', '18:00 - 20:00', '20:00 - 22:00'
    ];

    // ------------------------------------------------------------
    // Vista móvil: agrupa las clases por día filtrando celdas vacías
    // Resultado: [{ dia: "Lunes", clases: [{ bloque, clase }, ...] }]
    // Se filtran días sin clases para no mostrar secciones vacías
    // ------------------------------------------------------------
    const horarioPorDia = dias.map(dia => ({
        dia,
        clases: bloques
            .map(bloque => ({ bloque, clase: horario[`${dia}-${bloque}`] ?? null }))
            .filter(b => b.clase !== null)  // Solo bloques con clase asignada
    })).filter(d => d.clases.length > 0);  // Solo días con al menos una clase
</script>

<!-- ===== VISTA ESCRITORIO: tabla completa (oculta en móvil) ===== -->
<!--
    Dos divs separados para resolver el conflicto entre scroll y esquinas redondeadas:
    - Externo: aplica el borde, sombra y overflow:hidden para recortar las esquinas
    - Interno: table-responsive agrega overflow-x:auto para el scroll horizontal
    Si ambas clases estuvieran en el mismo div, overflow-hidden cancelaría el scroll.
-->
<div class="d-none d-md-block shadow-sm rounded-3 border" style="overflow: hidden;">
    <div class="table-responsive">
    <table class="table table-bordered align-middle mb-0 text-center">
        <thead class="table-dark">
            <tr>
                <!-- Columna de bloques horarios con color azul CUL -->
                <th style="width: 160px; background-color: #222F56;">Bloque</th>
                {#each dias as dia}
                    <th>{dia}</th>
                {/each}
            </tr>
        </thead>
        <tbody>
            {#each bloques as bloque}
                <tr>
                    <!-- Celda de la franja horaria -->
                    <td class="bg-light fw-bold small text-muted py-3">{bloque}</td>
                    {#each dias as dia}
                        <!-- Construye la clave "Dia-Bloque" para buscar en el objeto horario -->
                        {@const asignacion = horario[`${dia}-${bloque}`]}
                        <td class="p-1" style="height: 90px; min-width: 140px;">
                            {#if asignacion}
                                <!-- Celda con clase: fondo de color de la materia -->
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
                                <!-- Celda vacía: guión con opacidad reducida -->
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
</div>

<!-- ===== VISTA MÓVIL: tarjetas agrupadas por día (oculta en escritorio) ===== -->
<div class="d-md-none">
    {#if horarioPorDia.length === 0}
        <!-- Estado vacío: no hay clases asignadas -->
        <div class="text-center text-muted py-4">
            <i class="bi bi-calendar-x fs-2 opacity-50"></i>
            <p class="mt-2 small">Sin clases asignadas</p>
        </div>
    {:else}
        {#each horarioPorDia as { dia, clases }}
            <div class="mb-3">
                <!-- Encabezado del día con color azul CUL -->
                <div class="px-3 py-2 fw-bold text-white rounded-top-3 small text-uppercase"
                     style="background-color: #222F56; letter-spacing: 0.5px;">
                    <i class="bi bi-calendar3 me-2"></i>{dia}
                </div>
                <!-- Lista de clases del día -->
                <div class="border border-top-0 rounded-bottom-3 overflow-hidden">
                    {#each clases as { bloque, clase }, i}
                        <div class="d-flex align-items-stretch"
                            class:border-top={i > 0}
                            style="min-height: 70px;">
                            <!-- Separador entre clases del mismo día: border-top se aplica desde el segundo elemento -->
                            <!-- Columna de franja horaria -->
                            <div class="d-flex align-items-center justify-content-center px-2 bg-light border-end"
                                 style="min-width: 110px; font-size: 0.72rem; font-weight: 600; color: #666;">
                                <i class="bi bi-clock me-1"></i>{bloque}
                            </div>
                            <!-- Tarjeta de la materia con borde izquierdo del color de la materia -->
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
    /* Ancho mínimo para que la tabla no se comprima en pantallas medianas */
    table {
        min-width: 900px;
        border-collapse: separate;
        border-spacing: 0;
    }

    /* Encabezados en mayúsculas con espaciado entre letras */
    th {
        font-weight: 600;
        text-transform: uppercase;
        font-size: 0.85rem;
        letter-spacing: 0.5px;
        padding: 1rem !important;
    }

    td { background-color: #ffffff; }

    /* Efecto de zoom al pasar el cursor sobre una celda con clase */
    .h-100:hover {
        filter: brightness(1.1);
        transform: scale(1.02);
    }
</style>