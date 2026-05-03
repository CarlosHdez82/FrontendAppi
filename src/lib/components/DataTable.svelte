<script lang="ts">
    import type { Snippet } from 'svelte';

    let { 
        headers, 
        data = [], 
        // Recibimos un snippet que define cómo se ve una fila
        rowTemplate 
    } = $props<{
        headers: { label: string; class?: string }[];
        data: any[];
        rowTemplate: Snippet<[any]>;
    }>();

    // Estado local para el buscador
    let terminoBusqueda = $state('');

    // Lógica del Data Table: Filtra los datos reactivamente
    let datosFiltrados = $derived(
        terminoBusqueda === '' 
            ? data 
            : data.filter(item => 
                // Busca en todos los valores de cada registro
                Object.values(item).some(val => 
                    String(val).toLowerCase().includes(terminoBusqueda.toLowerCase())
                )
            )
    );
</script>

<!-- Controles del Data Table (Buscador y Contador) -->
<div class="d-flex justify-content-between align-items-center mt-3 mb-3">
    <div class="input-group shadow-sm" style="max-width: 300px;">
        <span class="input-group-text bg-white border-end-0"><i class="bi bi-search"></i></span>
        <input 
            type="text" 
            class="form-control border-start-0" 
            placeholder="Buscar..."
            bind:value={terminoBusqueda}
        >
    </div>
    <span class="text-muted small">
        Mostrando {datosFiltrados.length} registro(s)
    </span>
</div>

<!-- Estructura de tu Tabla -->
<div class="card border-0 shadow-sm overflow-hidden">
    <div class="table-responsive">
        <table class="table table-hover align-middle mb-0" style="min-width: 600px;">
            <thead class="table-light">
                <tr>
                    {#each headers as header}
                        <th class={header.class || ""}>{header.label}</th>
                    {/each}
                </tr>
            </thead>
            <tbody>
                {#if datosFiltrados.length > 0}
                    {#each datosFiltrados as fila}
                        <!-- Aquí ejecutamos el snippet pasándole la información de la fila -->
                        {@render rowTemplate(fila)}
                    {/each}
                {:else}
                    <tr>
                        <td colspan={headers.length} class="text-center py-4 text-muted">
                            No se encontraron coincidencias.
                        </td>
                    </tr>
                {/if}
            </tbody>
        </table>
    </div>
</div>

<style>
    /* 1. Definimos una altura máxima para el contenedor de la tabla */
    .table-responsive {
        max-height: 500px; /* Ajusta esta altura según prefieras */
        overflow-y: auto;  /* Permite el scroll vertical solo aquí */
    }

    /* 2. Hacemos que el encabezado se quede pegado arriba */
    thead th { 
        position: sticky;
        top: 0;
        z-index: 10; /* Asegura que el título pase por encima del contenido */
        background-color: #f8f9fa !important; /* Color de fondo para que no sea transparente */
        font-size: 0.8rem; 
        text-transform: uppercase; 
        letter-spacing: 0.5px;
        padding: 0.75rem 1rem;
        color: #6c757d;
        border-bottom: 2px solid #dee2e6;
    }
</style>