<!-- ============================================================
     LoadingSpinner.svelte — Indicador de carga
     ============================================================
     Muestra un spinner centrado mientras se cargan datos desde
     la API. Se usa en todas las páginas con fetch asíncrono.
     visually-hidden oculta el texto para lectores de pantalla
     pero mantiene la accesibilidad (aria).
     ============================================================ -->
<div class="d-flex justify-content-center align-items-center" style="height: 300px;">
    <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
    </div>
</div>