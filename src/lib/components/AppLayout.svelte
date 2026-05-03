<script lang="ts">
    import Sidebar from './Sidebar.svelte';
    import Header from './Header.svelte';
    import MobileSidebar from './MobileSidebar.svelte';
    import MainContent from './MainContent.svelte';
    import { userRole, userName } from "$lib/stores/user";
    import { menus } from "$lib/menus";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";

    let { children } = $props();

    // Lógica de roles
    const roleLabels: Record<string, string> = {
        "admi": "Administrador", "faculty": "Coordinador",
        "teacher": "Docente"
    };

    let role = $derived($userRole);
    let name = $derived($userName);
    let items = $derived(role ? (menus[role] || []) : []);
    let displayRole = $derived(role ? (roleLabels[role] || role) : "Invitado");

    let currentLabel = $derived(() => {
        const active = items.find(i => i.href === $page.url.pathname);
        return active ? active.label : "Dashboard";
    });

    const logout = async () => {
        await goto("/", { invalidateAll: true });
        userRole.set(null);
        localStorage.clear();
    };
</script>

<!-- Estructura principal con corrección de scroll -->
<div class="d-flex vh-100 overflow-hidden">
    <!-- Sidebar Escritorio -->
    <Sidebar {items} onLogout={logout} />

    <!-- 
        Agregamos style="width: 0;" o min-width: 0; 
        Esto permite que los hijos (como las tablas) manejen su propio overflow horizontal.
    -->
    <div class="flex-grow-1 d-flex flex-column min-w-0" style="width: 0;">
        <Header currentLabel={currentLabel()} {displayRole} userName={name} />

        <!-- El MainContent debe permitir el scroll vertical del contenido general -->
        <MainContent>
            {@render children()}
        </MainContent>
    </div>
</div>

<MobileSidebar {items} onLogout={logout} />