<script lang="ts">
    // ============================================================
    // TableAction.svelte — Botones de acción en tablas
    // ============================================================
    // Renderiza los botones Editar y Eliminar para cada fila
    // de una tabla. Abre los modales correspondientes mediante
    // los atributos data-bs-toggle de Bootstrap.
    //
    // onEdit:   abre el FormModal con datos del registro
    // onDelete: abre el ConfirmDeleteModal con el nombre del ítem
    // ============================================================
    let { onEdit, onDelete, itemName = "" } = $props();
</script>

<div class="btn-group flex-nowrap" role="group">
    <!-- Botón Editar: abre #modalPrincipal con los datos del registro -->
    <button
        class="btn btn-sm btn-light text-primary border shadow-sm px-2"
        onclick={onEdit}
        data-bs-toggle="modal"
        data-bs-target="#modalPrincipal"
        title="Editar {itemName}"
        aria-label="Editar {itemName}"
    >
        <i class="bi bi-pencil-square"></i>
    </button>
    <!-- Botón Eliminar: abre #modalEliminar para confirmar la acción -->
    <button
        class="btn btn-sm btn-light text-danger border shadow-sm"
        onclick={onDelete}
        data-bs-toggle="modal"
        data-bs-target="#modalEliminar"
        title="Eliminar {itemName}"
        aria-label="Eliminar {itemName}"
    >
        <i class="bi bi-trash3"></i>
    </button>
</div>