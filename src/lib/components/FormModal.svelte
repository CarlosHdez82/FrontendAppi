<script lang="ts">
    let { id = "modalGenForm", title = "", isEdit = false, onSave, children } = $props();
</script>

<div class="modal fade" {id} tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg">
            <div class="modal-header {isEdit ? 'bg-warning' : 'bg-success text-white'}">
                <h5 class="modal-title fw-bold">
                    <i class="bi {isEdit ? 'bi-pencil-square' : 'bi-plus-circle-fill'} me-2"></i>
                    {isEdit ? `Editar ${title}` : `Nuevo ${title}`}
                </h5>
                <button type="button" class="btn-close {isEdit ? '' : 'btn-close-white'}" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form onsubmit={(e) => { e.preventDefault(); onSave(); }}>
                <div class="modal-body p-4"> {@render children()} </div>
                <div class="modal-footer border-0 p-4 pt-0">
                    <button type="submit" class="btn {isEdit ? 'btn-warning' : 'btn-success'} w-100 py-2 fw-bold" data-bs-dismiss="modal">
                        {isEdit ? 'Guardar Cambios' : 'Registrar'}
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>