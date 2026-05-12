<script lang="ts">
    import { goto } from '$app/navigation';
    import { userRole, userName } from '$lib/stores/user';

    let { currentLabel, displayRole, userName: userNameProp } = $props<{
        currentLabel: string;
        displayRole: string;
        userName: string | null;
    }>();

    const logout = async () => {
        await goto("/", { invalidateAll: true });
        userRole.set(null);
        userName.set(null);
        localStorage.clear();
    };
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

        <!-- Dropdown de usuario -->
        <div class="dropdown">
            <button class="btn d-flex align-items-center gap-2 py-1 px-2 rounded-3 border-0"
                    style="background: transparent;"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false">
                <div class="text-end d-none d-sm-block" style="max-width: 150px;">
                    <div class="fw-bold small text-truncate">{userNameProp || "Usuario"}</div>
                    <small class="text-muted d-block">{displayRole}</small>
                </div>
                <div class="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                     style="width: 38px; height: 38px; background-color: #222F56; font-size: 0.9rem; flex-shrink: 0;">
                    {(userNameProp ?? 'U')[0].toUpperCase()}
                </div>
                <i class="bi bi-chevron-down small text-muted"></i>
            </button>

            <ul class="dropdown-menu dropdown-menu-end shadow border-0 mt-1" style="min-width: 200px;">
                <li class="px-3 py-2 border-bottom">
                    <div class="fw-bold small">{userNameProp || 'Usuario'}</div>
                    <small class="text-muted">{displayRole}</small>
                </li>
                <li>
                    <a class="dropdown-item py-2" href="/perfil">
                        <i class="bi bi-person-gear me-2 text-secondary"></i>Mi Perfil
                    </a>
                </li>
                <li><hr class="dropdown-divider my-1"></li>
                <li>
                    <button class="dropdown-item py-2 text-danger" onclick={logout}>
                        <i class="bi bi-box-arrow-right me-2"></i>Cerrar Sesión
                    </button>
                </li>
            </ul>
        </div>
    </div>
</nav>