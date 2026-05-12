<script lang="ts">
    import { goto } from '$app/navigation';
    import { userRole, userName } from '$lib/stores/user';

    let { currentLabel, displayRole, userName: userNameProp } = $props<{
        currentLabel: string;
        displayRole: string;
        userName: string | null;
    }>();

    let menuAbierto = $state(false);

    const logout = async () => {
        menuAbierto = false;
        await goto("/", { invalidateAll: true });
        userRole.set(null);
        userName.set(null);
        localStorage.clear();
    };

    function irAPerfil() {
        menuAbierto = false;
        goto("/perfil");
    }

    function cerrarAlClickAfuera(e: MouseEvent) {
        const target = e.target as HTMLElement;
        if (!target.closest('.user-menu-wrapper')) {
            menuAbierto = false;
        }
    }
</script>

<svelte:window onclick={cerrarAlClickAfuera} />

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
            <span class="navbar-brand mb-0 h1 text-secondary fs-6">{currentLabel}</span>
        </div>

        <!-- Menú de usuario con dropdown nativo Svelte -->
        <div class="user-menu-wrapper position-relative">
            <button
                class="btn d-flex align-items-center gap-2 py-1 px-2 rounded-3 border-0"
                style="background: transparent;"
                onclick={(e) => { e.stopPropagation(); menuAbierto = !menuAbierto; }}
            >
                <div class="text-end d-none d-sm-block" style="max-width: 150px;">
                    <div class="fw-bold small text-truncate">{userNameProp || "Usuario"}</div>
                    <small class="text-muted d-block">{displayRole}</small>
                </div>
                <div class="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                     style="width: 38px; height: 38px; background-color: #222F56; font-size: 0.9rem; flex-shrink: 0;">
                    {(userNameProp ?? 'U')[0].toUpperCase()}
                </div>
                <i class="bi bi-chevron-{menuAbierto ? 'up' : 'down'} small text-muted"></i>
            </button>

            {#if menuAbierto}
                <div class="position-absolute end-0 mt-1 bg-white rounded-3 shadow border-0 py-1"
                     style="min-width: 210px; z-index: 9999; top: 100%;">
                    <!-- Cabecera del menú -->
                    <div class="px-3 py-2 border-bottom">
                        <div class="fw-bold small">{userNameProp || 'Usuario'}</div>
                        <small class="text-muted">{displayRole}</small>
                    </div>
                    <!-- Mi Perfil -->
                    <button class="w-100 text-start px-3 py-2 border-0 bg-transparent d-flex align-items-center gap-2 menu-item"
                            onclick={irAPerfil}>
                        <i class="bi bi-person-gear text-secondary"></i>
                        <span class="small">Mi Perfil / Cambiar contraseña</span>
                    </button>
                    <hr class="my-1">
                    <!-- Cerrar sesión -->
                    <button class="w-100 text-start px-3 py-2 border-0 bg-transparent d-flex align-items-center gap-2 menu-item text-danger"
                            onclick={logout}>
                        <i class="bi bi-box-arrow-right"></i>
                        <span class="small">Cerrar Sesión</span>
                    </button>
                </div>
            {/if}
        </div>
    </div>
</nav>

<style>
    .menu-item:hover {
        background-color: #f8f9fa;
        cursor: pointer;
    }
</style>