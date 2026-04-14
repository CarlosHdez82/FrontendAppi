<script lang="ts">
    let { currentLabel, displayRole } = $props();
</script>

<nav class="navbar bg-white border-bottom w-100 shadow-sm">
    <div class="container-fluid">
        <div class="d-flex align-items-center">
            <button 
                class="btn btn-light d-md-none me-2" 
                type="button" 
                data-bs-toggle="offcanvas" 
                data-bs-target="#offcanvasSidebar"
                aria-controls="offcanvasSidebar"
                aria-label="Abrir menú lateral"
            >
                <i class="bi bi-list fs-4"></i>
            </button>
            
            <span class="navbar-brand mb-0 h1 text-secondary fs-6 fs-md-5">{currentLabel}</span>
        </div>

        <div class="d-flex align-items-center">
            <span class="text-muted small d-none d-sm-inline me-2">{displayRole}</span>
            <i class="bi bi-person-circle fs-4 text-secondary"></i>
        </div>
    </div>
</nav>