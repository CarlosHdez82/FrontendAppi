<script lang="ts">
    // ============================================================
    // SubjectsCard.svelte — Tarjeta de materia para el Docente
    // ============================================================
    // Muestra la información detallada de una materia asignada
    // al docente: nombre, código, programa, intensidad y grupo.
    // Incluye botones de acción (Ver Estudiantes, Material de Apoyo)
    // para futuras funcionalidades del módulo docente.
    // ============================================================
    let { materia } = $props<{
        materia: {
            nombre: string;     // Nombre de la materia
            codigo: string;     // Código (ej: "SIS-01")
            programa: string;   // Nombre del programa al que pertenece
            intensidad: number; // Horas semanales
            grupo: string;      // Código del grupo (ej: "A", "CN")
        }
    }>();
</script>

<div class="card h-100 border-0 shadow-sm card-materia">
    <div class="card-body p-4">
        <!-- Encabezado: código + grupo y marcador estrella -->
        <div class="d-flex justify-content-between align-items-start mb-3">
            <span class="badge bg-soft-blue text-primary px-3 py-2">
                {materia.codigo} - {materia.grupo}
            </span>
            <div class="text-warning fs-5">
                <i class="bi bi-bookmark-star-fill"></i>
            </div>
        </div>

        <h4 class="fw-bold text-dark mb-2">{materia.nombre}</h4>
        <p class="text-muted small mb-4">
            <i class="bi bi-mortarboard-fill me-2"></i>{materia.programa}
        </p>

        <!-- Indicador de intensidad horaria semanal -->
        <div class="d-flex align-items-center gap-3 mb-4 p-3 bg-light rounded-3">
            <div class="text-center border-end pe-3">
                <span class="d-block fw-bold text-dark">{materia.intensidad}</span>
                <span class="small text-muted">Horas</span>
            </div>
            <div class="ps-1">
                <span class="d-block small text-muted">Intensidad Semanal</span>
            </div>
        </div>

        <!-- Botones de acción para futuras funcionalidades -->
        <div class="d-grid gap-2">
            <button class="btn btn-primary shadow-sm rounded-pill">
                <i class="bi bi-people me-2"></i>Ver Estudiantes
            </button>
            <button class="btn btn-outline-secondary btn-sm rounded-pill">
                <i class="bi bi-folder2-open me-2"></i>Material de Apoyo
            </button>
        </div>
    </div>
</div>

<style>
    /* Efecto de elevación al pasar el cursor */
    .card-materia {
        transition: transform 0.2s, box-shadow 0.2s;
        border-radius: 16px;
        background: white;
    }
    .card-materia:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
    }
    .bg-soft-blue { background-color: #e7f1ff; }
    .btn-primary { background-color: #222F56; border: none; } /* Azul CUL */
    .btn-primary:hover { background-color: #1a2544; }
</style>