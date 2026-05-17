<script lang="ts">
    // ============================================================
    // Header.svelte — Barra de navegación superior
    // ============================================================
    // Muestra el título de la página activa, el botón hamburguesa
    // para abrir el sidebar en móvil, y el menú desplegable del
    // usuario con acceso al perfil y cierre de sesión.
    // ============================================================
    import { goto } from '$app/navigation';
    import { userRole, userName } from '$lib/stores/user';

    let { currentLabel, displayRole, userName: userNameProp } = $props<{
        currentLabel: string;    // Título de la página activa
        displayRole: string;     // Nombre legible del rol (ej: "Administrador")
        userName: string | null; // Nombre completo del usuario
    }>();

    // Controla si el menú desplegable del usuario está abierto
    let menuAbierto = $state(false);

    // ------------------------------------------------------------
    // Cierra sesión: limpia stores y localStorage, redirige al login
    // ------------------------------------------------------------
    const logout = async () => {
        menuAbierto = false;
        await goto("/", { invalidateAll: true });
        userRole.set(null);
        userName.set(null);
        localStorage.clear();
    };

    // Navega al perfil y cierra el menú desplegable
    function irAPerfil() {
        menuAbierto = false;
        goto("/perfil");
    }

    // ------------------------------------------------------------
    // Cierra el menú al hacer clic fuera del componente
    // Verifica si el clic fue dentro del contenedor .user-menu-wrapper
    // ------------------------------------------------------------
    function cerrarAlClickAfuera(e: MouseEvent) {
        const target = e.target as HTMLElement;
        if (!target.closest('.user-menu-wrapper')) {
            menuAbierto = false;
        }
    }
</script>

<!-- Escucha clics en toda la ventana para cerrar el menú -->
<svelte:window onclick={cerrarAlClickAfuera} />

<nav class="navbar bg-white border-bottom w-100 shadow-sm">
    <div class="container-fluid">
        <div class="d-flex align-items-center">
            <!-- Botón hamburguesa: visible solo en móvil (d-md-none) -->
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
            <!-- Título de la sección activa obtenido del menú -->
            <span class="navbar-brand mb-0 h1 text-secondary fs-6">{currentLabel}</span>
        </div>

        <!-- Menú desplegable del usuario (dropdown nativo Svelte, sin Bootstrap JS) -->
        <div class="user-menu-wrapper position-relative">
            <button
                class="btn d-flex align-items-center gap-2 py-1 px-2 rounded-3 border-0"
                style="background: transparent;"
                onclick={(e) => { e.stopPropagation(); menuAbierto = !menuAbierto; }}
            >
                <!-- Nombre y rol: ocultos en pantallas muy pequeñas -->
                <div class="text-end d-none d-sm-block" style="max-width: 150px;">
                    <div class="fw-bold small text-truncate">{userNameProp || "Usuario"}</div>
                    <small class="text-muted d-block">{displayRole}</small>
                </div>
                <!-- Avatar circular con la inicial del nombre -->
                <div class="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                     style="width: 38px; height: 38px; background-color: #222F56; font-size: 0.9rem; flex-shrink: 0;">
                    {(userNameProp ?? 'U')[0].toUpperCase()}
                </div>
                <!-- Ícono de flecha que indica si el menú está abierto -->
                <i class="bi bi-chevron-{menuAbierto ? 'up' : 'down'} small text-muted"></i>
            </button>

            <!-- Dropdown: se muestra solo cuando menuAbierto es true -->
            {#if menuAbierto}
                <div class="position-absolute end-0 mt-1 bg-white rounded-3 shadow border-0 py-1"
                     style="min-width: 210px; z-index: 9999; top: 100%;">
                    <!-- Cabecera con nombre y rol del usuario -->
                    <div class="px-3 py-2 border-bottom">
                        <div class="fw-bold small">{userNameProp || 'Usuario'}</div>
                        <small class="text-muted">{displayRole}</small>
                    </div>
                    <!-- Opción: ir al perfil y cambiar contraseña -->
                    <button class="w-100 text-start px-3 py-2 border-0 bg-transparent d-flex align-items-center gap-2 menu-item"
                            onclick={irAPerfil}>
                        <i class="bi bi-person-gear text-secondary"></i>
                        <span class="small">Mi Perfil / Cambiar contraseña</span>
                    </button>
                    <hr class="my-1">
                    <!-- Opción: cerrar sesión -->
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
    /* Efecto hover en las opciones del menú desplegable */
    .menu-item:hover {
        background-color: #f8f9fa;
        cursor: pointer;
    }
</style>