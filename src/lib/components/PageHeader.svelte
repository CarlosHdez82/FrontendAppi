<script lang="ts">
    // ============================================================
    // PageHeader.svelte — Encabezado estándar de página
    // ============================================================
    // Muestra el título, subtítulo y botón de acción principal
    // de cada página (ej: "Nueva Facultad", "Nuevo Docente").
    // El botón abre el modal Bootstrap con id="modalPrincipal".
    // Si buttonText está vacío, el botón no se renderiza.
    // ============================================================
    let { title, subtitle, buttonText, onButtonClick } = $props();
</script>

<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h2 class="fw-bold mb-0">{title}</h2>
        <span class="text-muted">{subtitle}</span>
    </div>
    <!-- El botón solo se muestra si buttonText tiene contenido -->
    {#if buttonText}
        <button
            class="btn shadow-sm"
            data-bs-toggle="modal"
            data-bs-target="#modalPrincipal"
            onclick={onButtonClick}
        >
            <i class="bi bi-plus-circle-fill me-2"></i>{buttonText}
        </button>
    {/if}
</div>

<style>
    .btn {
        background-color: #222F56; /* Azul institucional CUL */
        color: white;
    }
</style>