<script lang="ts">
    let { id = "modalGenDelete", itemName = "", onDelete } = $props();
</script>

<div class="modal fade" {id} tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-sm modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg">
            <div class="modal-body text-center p-4">
                <i class="bi bi-exclamation-triangle text-danger display-4 mb-3"></i>
                <h5 class="fw-bold">¿Eliminar registro?</h5>
                <p class="text-muted small">Confirmas eliminar a: <br><strong>{itemName}</strong></p>
                <div class="d-flex gap-2 mt-4">
                    <button class="btn btn-light w-100 border" data-bs-dismiss="modal">No</button>
                    <button class="btn btn-danger w-100" data-bs-dismiss="modal" onclick={onDelete}>Sí, eliminar</button>
                </div>
            </div>
        </div>
    </div>
</div>