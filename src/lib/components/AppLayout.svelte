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
        "teacher": "Docente", "student": "Estudiante"
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

<div class="d-flex vh-100 overflow-hidden">
    <Sidebar {items} onLogout={logout} />

    <div class="flex-grow-1 d-flex flex-column">
        <Header currentLabel={currentLabel()} {displayRole} userName={name} />

        <MainContent>
            {@render children()}
        </MainContent>
    </div>
</div>

<MobileSidebar {items} onLogout={logout} />