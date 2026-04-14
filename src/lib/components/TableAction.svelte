<script lang="ts">
    let { onEdit, onDelete, itemName = "" } = $props();
</script>

<div class="btn-group">
    <button 
        class="btn btn-sm btn-light text-primary border shadow-sm" 
        onclick={onEdit}
        data-bs-toggle="modal" 
        data-bs-target="#modalPrincipal" 
        title="Editar {itemName}"
        aria-label="Editar {itemName}"
    >
        <i class="bi bi-pencil-square"></i>
    </button>
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