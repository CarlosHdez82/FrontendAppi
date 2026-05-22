<script lang="ts">
    // ============================================================
    // admi/reportes/+page.svelte — Reportes Power BI (PDF)
    // ============================================================
    // Incrusta el reporte exportado desde Power BI como PDF.
    // El archivo debe estar en la carpeta /static del proyecto.
    // Para actualizar el reporte, reemplaza el archivo PDF en /static.
    // ============================================================
    import PageHeader from "$lib/components/PageHeader.svelte";

    // Ruta del PDF dentro de la carpeta /static
    const PDF_SRC = "/dashboard_reporte.pdf";

    // Controla el spinner de carga mientras el iframe inicializa
    let cargando = $state(true);

    // Abre el PDF en una pestaña nueva para mejor visualización
    function abrirPantallaCompleta(_e: MouseEvent) {
        window.open(PDF_SRC, "_blank", "noopener,noreferrer");
    }
</script>

<PageHeader
    title="Reportes Power BI"
    subtitle="Análisis y estadísticas — Universidad CUL"
/>

<!-- Barra de acciones -->
<div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
    <span class="badge rounded-pill px-3 py-2" style="background-color: #222F56;">
        <i class="bi bi-file-earmark-bar-graph-fill me-1"></i>
        Reporte Power BI
    </span>
    <button
        class="btn btn-sm btn-outline-secondary shadow-sm"
        onclick={abrirPantallaCompleta}
        title="Abrir en pestaña nueva"
    >
        <i class="bi bi-fullscreen me-1"></i>Pantalla completa
    </button>
</div>

<!-- Contenedor del PDF con spinner superpuesto mientras carga -->
<div class="reporte-wrapper card border-0 shadow-sm rounded-3">

    <!-- Spinner visible mientras cargando === true -->
    {#if cargando}
        <div class="reporte-loading d-flex flex-column align-items-center justify-content-center gap-3">
            <div class="spinner-border text-warning" style="width: 3rem; height: 3rem;" role="status">
                <span class="visually-hidden">Cargando reporte...</span>
            </div>
            <p class="text-muted small mb-0">Cargando reporte...</p>
        </div>
    {/if}

    <!-- iframe del PDF: ocupa todo el contenedor -->
    <iframe
        src={PDF_SRC}
        title="Reporte Power BI — Universidad CUL"
        class="reporte-iframe rounded-3"
        class:invisible={cargando}
        onload={() => { cargando = false; }}
        allowfullscreen
    ></iframe>
</div>

<style>
    /* Contenedor principal: ocupa el alto disponible de la página */
    .reporte-wrapper {
        position: relative;
        height: calc(100vh - 220px);
        min-height: 400px;
        overflow: hidden;
    }

    /* Spinner centrado sobre el iframe mientras carga */
    .reporte-loading {
        position: absolute;
        inset: 0;
        background-color: #f8f9fa;
        z-index: 10;
        border-radius: inherit;
    }

    /* iframe ocupa todo el espacio del contenedor, sin borde */
    .reporte-iframe {
        width: 100%;
        height: 100%;
        border: none;
        display: block;
    }
</style>
