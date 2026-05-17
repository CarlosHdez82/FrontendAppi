<script lang="ts">
    import type { Snippet } from 'svelte';

    let { 
        headers, 
        data = [], 
        rowTemplate 
    } = $props<{
        headers: { label: string; class?: string }[];
        data: any[];
        rowTemplate: Snippet<[any]>;
    }>();

    let terminoBusqueda = $state('');

    let datosFiltrados = $derived(
        terminoBusqueda === '' 
            ? data 
            : data.filter((item: any) => 
                Object.values(item).some((val: any) => 
                    String(val).toLowerCase().includes(terminoBusqueda.toLowerCase())
                )
            )
    );
</script>

<!-- Controles del Data Table: Adaptables para móvil -->
<div class="d-flex flex-wrap justify-content-between align-items-center mt-3 mb-3 gap-2">
    <div class="input-group shadow-sm buscador-personalizado">
        <span class="input-group-text bg-white border-end-0"><i class="bi bi-search"></i></span>
        <input 
            type="text" 
            class="form-control border-start-0" 
            placeholder="Buscar..."
            bind:value={terminoBusqueda}
        >
    </div>
    <span class="text-muted small bg-light px-3 py-2 rounded-pill border">
        Mostrando <strong>{datosFiltrados.length}</strong> registro(s)
    </span>
</div>

<!-- Contenedor Principal con Sombra y Bordes Redondeados[cite: 1] -->
<div class="card border-0 shadow-sm custom-card">
    <!-- Contenedor de Scroll: La clave del funcionamiento móvil -->
    <div class="table-responsive-container">
        <table class="table table-hover align-middle mb-0">
            <thead>
                <tr>
                    {#each headers as header}
                        <th class={header.class || ""}>{header.label}</th>
                    {/each}
                </tr>
            </thead>
            <tbody>
                {#if datosFiltrados.length > 0}
                    {#each datosFiltrados as fila}
                        {@render rowTemplate(fila)}
                    {/each}
                {:else}
                    <tr>
                        <td colspan={headers.length} class="text-center py-5 text-muted">
                            <i class="bi bi-info-circle me-2"></i>
                            No se encontraron coincidencias.
                        </td>
                    </tr>
                {/if}
            </tbody>
        </table>
    </div>
</div>

<style>
    /* 1. Contenedor de la Tabla: Permite el scroll en ambos ejes */
    .table-responsive-container {
        width: 100%;
        display: block;
        overflow-x: auto !important; /* Scroll horizontal obligatorio */
        overflow-y: auto;           /* Scroll vertical para el sticky header[cite: 4] */
        max-height: 600px;          /* Altura máxima antes de hacer scroll vertical */
        -webkit-overflow-scrolling: touch; /* Suavidad en dispositivos móviles */
        position: relative;
    }

    /* 2. Configuración de la Tabla: Forzamos ancho mínimo[cite: 4] */
    table {
        min-width: 900px !important; /* Obliga al scroll horizontal en pantallas pequeñas[cite: 4] */
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
    }

    /* 3. Encabezado Fijo (Sticky)[cite: 4] */
    thead th { 
        position: sticky;
        top: 0;
        z-index: 10; 
        background-color: #f8f9fa !important; 
        font-size: 0.75rem; 
        text-transform: uppercase; 
        letter-spacing: 0.5px;
        padding: 1rem !important;
        color: #495057;
        border-bottom: 2px solid #dee2e6;
        white-space: nowrap; /* Evita que los títulos se corten o amontonen[cite: 4] */
    }

    /* 4. Estilo de las Celdas */
    :global(.table td) {
        padding: 0.75rem 1rem !important;
        white-space: nowrap; /* Evita que el contenido largo deforme la fila hacia abajo[cite: 4] */
    }

    /* 5. Personalización de la Barra de Desplazamiento (Estilo CUL)[cite: 1] */
    .table-responsive-container::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }
    .table-responsive-container::-webkit-scrollbar-track {
        background: transparent;
    }
    .table-responsive-container::-webkit-scrollbar-thumb {
        background: #F3B105; /* Amarillo institucional[cite: 10] */
        border-radius: 10px;
    }

    /* 6. Ajustes de Responsividad Extra[cite: 10] */
    .buscador-personalizado {
        min-width: 280px;
        max-width: 400px;
    }

    @media (max-width: 768px) {
        .buscador-personalizado {
            max-width: 100%; /* El buscador ocupa todo el ancho en móviles muy pequeños */
        }
    }

    .custom-card {
        border-radius: 12px;
        overflow: hidden;
    }
</style>