<script lang="ts">
    // Definimos los tipos de las props que recibe el componente
    let { currentLabel, displayRole, userName } = $props<{
        currentLabel: string;
        displayRole: string;
        userName: string | null;
    }>();
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
            <div class="text-end me-2" style="max-width: 150px;">
                <div class="fw-bold small text-truncate">{userName || "Usuario"}</div>
                <small class="text-muted d-block small">{displayRole}</small>
            </div>
            <i class="bi bi-person-circle fs-3 text-secondary"></i>
        </div>
    </div>
</nav>