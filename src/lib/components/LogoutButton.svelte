<script lang="ts">
    let { action } = $props();
</script>

<div class="w-100 mb-3 mt-auto border-top pt-3 d-flex justify-content-center">
    <button 
        class="nav-link text-white border-0 bg-transparent d-flex align-items-center" 
        onclick={action}
        aria-label="Cerrar sesión"
    >
        <i class="bi bi-box-arrow-right me-2"></i> Cerrar Sesión
    </button>
</div>