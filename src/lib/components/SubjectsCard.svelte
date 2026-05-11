<script lang="ts">
    // Definimos las propiedades que recibe la tarjeta
    let { materia } = $props<{
        materia: {
            nombre: string;
            codigo: string;
            programa: string;
            intensidad: number;
            grupo: string;
        }
    }>();
</script>

<div class="card h-100 border-0 shadow-sm card-materia">
    <div class="card-body p-4">
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

        <div class="d-flex align-items-center gap-3 mb-4 p-3 bg-light rounded-3">
            <div class="text-center border-end pe-3">
                <span class="d-block fw-bold text-dark">{materia.intensidad}</span>
                <span class="small text-muted">Horas</span>
            </div>
            <div class="ps-1">
                <span class="d-block small text-muted">Intensidad Semanal</span>
            </div>
        </div>

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
    .card-materia {
        transition: transform 0.2s, box-shadow 0.2s;
        border-radius: 16px;
        background: white;
    }

    .card-materia:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
    }

    .bg-soft-blue {
        background-color: #e7f1ff;
    }

    .btn-primary {
        background-color: #222F56; /* Azul CUL */
        border: none;
    }

    .btn-primary:hover {
        background-color: #1a2544;
    }
</style>