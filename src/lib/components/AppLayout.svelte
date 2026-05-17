<script lang="ts">
    // ============================================================
    // AppLayout.svelte — Layout principal de la aplicación
    // ============================================================
    // Componente raíz que envuelve todas las páginas protegidas.
    // Ensambla el Sidebar, Header y área de contenido principal.
    // Determina el menú y rol a mostrar según el usuario autenticado.
    // ============================================================
    import Sidebar from './Sidebar.svelte';
    import Header from './Header.svelte';
    import MobileSidebar from './MobileSidebar.svelte';
    import MainContent from './MainContent.svelte';
    import { userRole, userName } from "$lib/stores/user";
    import { menus, type Menus } from "$lib/menus";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";

    // children representa las páginas hijas renderizadas dentro del layout
    let { children } = $props();

    // ------------------------------------------------------------
    // Mapa de roles a etiquetas legibles para mostrar en la UI
    // ------------------------------------------------------------
    const roleLabels: Record<string, string> = {
        "admi": "Administrador", "faculty": "Coordinador",
        "teacher": "Docente"
    };

    // ------------------------------------------------------------
    // Estados derivados del store global de usuario
    // $derived actualiza automáticamente cuando el store cambia
    // ------------------------------------------------------------
    let role = $derived($userRole);
    let name = $derived($userName);

    // Obtiene los ítems del menú según el rol del usuario
    // keyof Menus garantiza que role sea una clave válida del objeto menus
    let items = $derived(role ? (menus[role as keyof Menus] || []) : []);

    // Etiqueta legible del rol para mostrar en el Header
    let displayRole = $derived(role ? (roleLabels[role] || role) : "Invitado");

    // Título de la página activa buscando en los ítems del menú
    // Se compara la URL actual con el href de cada ítem
    let currentLabel = $derived(() => {
        const active = items.find(i => i.href === $page.url.pathname);
        return active ? active.label : "Dashboard";
    });

    // ------------------------------------------------------------
    // Función de cierre de sesión
    // 1. Redirige a la raíz (página de login)
    // 2. Limpia el store de rol
    // 3. Elimina todos los datos del localStorage
    // ------------------------------------------------------------
    const logout = async () => {
        await goto("/", { invalidateAll: true });
        userRole.set(null);
        localStorage.clear();
    };
</script>

<!-- Estructura principal: ocupa toda la pantalla sin scroll externo -->
<div class="d-flex vh-100 overflow-hidden">
    <!-- Sidebar visible solo en escritorio (d-none d-md-flex) -->
    <Sidebar {items} onLogout={logout} />

    <!--
        width: 0 + flex-grow-1 permiten que el contenido interno
        maneje su propio overflow horizontal sin deformar el layout.
        Sin esto, las tablas anchas romperían el diseño general.
    -->
    <div class="flex-grow-1 d-flex flex-column min-w-0" style="width: 0;">
        <Header currentLabel={currentLabel()} {displayRole} userName={name} />

        <!-- MainContent maneja el scroll vertical del contenido -->
        <MainContent>
            {@render children()}
        </MainContent>
    </div>
</div>

<!-- Sidebar móvil: se muestra como offcanvas en pantallas pequeñas -->
<MobileSidebar {items} onLogout={logout} />