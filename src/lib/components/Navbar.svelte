<script lang="ts">
    let { children } = $props();
    import { menus } from "$lib/menus";
    import { userRole } from "$lib/stores/user";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation"; // Importamos la función para navegar

    // rol actual (mantiene el valor interno: 'admi', 'faculty', etc.)
    let role = $derived($userRole);

    // Mapeo visual para mostrar nombres elegantes en la interfaz
    const roleLabels: Record<string, string> = {
        "admi": "Administrador",
        "faculty": "Coordinador",
        "teacher": "Docente",
        "student": "Estudiante"
    };

    // Nombre visual derivado (si no existe el rol, muestra 'Invitado')
    let displayRole = $derived(role ? (roleLabels[role] || role) : "Invitado");

    // menú correspondiente
    let items = $derived(role ? (menus[role] || []) : []);

    // label seleccionado según la ruta activa
    let currentLabel = $derived(() => {
        const active = items.find(i => i.href === $page.url.pathname);
        return active ? active.label : "Dashboard";
    });

    // Función para cerrar sesión
    const logout = async () => {
    // 1. Primero navegamos hacia afuera
    await goto("/", { invalidateAll: true }); 
    
    // 2. Una vez que la navegación inició o terminó, limpiamos los datos
    userRole.set(null);
    localStorage.removeItem('user_role');
    localStorage.clear();
    };
</script>

<div class="d-flex">
    <!-- Sidebar visible solo en pantallas grandes -->
    <nav class="navbar navbar-light bg-primary text-white flex-column vh-100 d-none d-md-flex d-lg-flex" style="width: 200px;">
        <img src="/logo.png" alt="Logo" width="100" height="40" class="d-block mx-auto mb-1" />
        <hr class="border-light w-100" />
        <ul class="navbar-nav flex-column w-100 d-flex justify-content-start mb-auto gap-4 ps-3">
            {#each items as item}
            <li class="nav-item d-flex align-items-center">
                <i class={item.icon + " me-2"}></i>
                <a class="nav-link text-white p-0" href={item.href}>{item.label}</a>
            </li>
            {/each}
        </ul>
        <div class="w-100 mb-3 mt-auto border-top pt-3 d-flex justify-content-center">
            <button class="nav-link text-white border-0 bg-transparent d-flex align-items-center" onclick={logout}>
                <i class="bi bi-box-arrow-right me-2"></i> Cerrar Sesión
            </button>
        </div>
    </nav>

     <!-- Contenido principal -->
    <div class="flex-grow-1 d-flex flex-column vh-100">
        <!-- Header con botón hamburguesa dentro de un nav -->
        <div>
            <nav class="navbar navbar-light bg-body-primary d-sm-block d-md-none p-0">
                <button class="navbar-toggler me-3" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasSidebar"
                    aria-controls="offcanvasSidebar" aria-label="Abrir menú">
                    <span class="navbar-toggler-icon"></span>
                </button>
            </nav>

            <!-- Header fijo arriba -->
            <nav class="navbar bg-white border-bottom">
                <div class="container-fluid">
                    <!-- label del menú activo -->
                    <span class="navbar-brand mb-0 h1 text-secondary">{currentLabel()}</span>
                    <!-- rol del usuario -->
                    <span class="navbar-brand mb-0 h1 text-secondary">{displayRole}<i class="bi bi-person-circle ps-2"></i></span>
                </div>
            </nav>
        </div>

        <div class="container-fluid bg-body-tertiary flex-grow-1 p-3 overflow-auto">
            <!-- <div class="mb-4">
                <p class="lead">Bienvenido al panel de {displayRole}</p>
            </div> -->

            {#if children}
                {@render children()}
            {/if}
        </div>
    </div>
</div>

<!-- Offcanvas que aparece en móviles -->
<div class="offcanvas offcanvas-start bg-primary text-white" tabindex="-1" id="offcanvasSidebar" aria-labelledby="offcanvasSidebarLabel" style="width: 200px;">
    <div class="offcanvas-body d-flex flex-column align-items-center vh-100">
        <img src="/logo.png" alt="Logo" width="100" height="40" class="d-block mx-auto mb-3" />
        <hr class="color-secondary w-100" />
        <ul class="navbar-nav flex-column w-100 d-flex justify-content-around ps-3 align-items-left flex-grow-1">
            {#each items as item}
            <li class="nav-item d-flex align-items-center">
                <i class={item.icon + " me-2"}></i>
                <a class="nav-link active" href={item.href}>{item.label}</a>
            </li>
            {/each}
        </ul>
        <div class="w-100 ps-3 mb-3 mt-auto border-top pt-2">
            <button class="nav-link text-white border-0 bg-transparent p-0" onclick={logout}>
                <i class="bi bi-box-arrow-right me-2"></i> Cerrar Sesión
            </button>
        </div>
    </div>
</div>