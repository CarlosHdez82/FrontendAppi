<script lang="ts">
    // ============================================================
    // ConfirmDeleteModal.svelte — Modal de confirmación de eliminación
    // ============================================================
    // Modal de confirmación antes de eliminar un registro.
    // Muestra el nombre del ítem a eliminar y dos botones:
    //   - "No"         → cierra el modal sin hacer nada
    //   - "Sí, eliminar" → ejecuta onDelete y cierra el modal
    // ============================================================
    let { id = "modalGenDelete", itemName = "", onDelete } = $props();
</script>

<!-- modal-sm: tamaño pequeño para una confirmación simple -->
<div class="modal fade" {id} tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-sm modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg">
            <div class="modal-body text-center p-4">
                <i class="bi bi-exclamation-triangle text-danger display-4 mb-3"></i>
                <h5 class="fw-bold">¿Eliminar registro?</h5>
                <!-- Muestra el nombre exacto del registro a eliminar -->
                <p class="text-muted small">Confirmas eliminar a: <br><strong>{itemName}</strong></p>
                <div class="d-flex gap-2 mt-4">
                    <!-- data-bs-dismiss cierra el modal sin ejecutar ninguna acción -->
                    <button class="btn btn-light w-100 border" data-bs-dismiss="modal">No</button>
                    <!-- onDelete ejecuta la eliminación y data-bs-dismiss cierra el modal -->
                    <button class="btn btn-danger w-100" data-bs-dismiss="modal" onclick={onDelete}>Sí, eliminar</button>
                </div>
            </div>
        </div>
    </div>
</div>