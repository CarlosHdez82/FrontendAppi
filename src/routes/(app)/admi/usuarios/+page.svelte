<script lang="ts">
    import { onMount } from 'svelte';
    import PageHeader from "$lib/components/PageHeader.svelte";
    import DataTable from "$lib/components/DataTable.svelte";
    import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
    import TableAction from "$lib/components/TableAction.svelte";
    import StatusBadge from "$lib/components/StatusBadge.svelte";
    import RoleBadge from "$lib/components/RoleBadge.svelte";
    import FormModal from "$lib/components/FormModal.svelte";
    import ConfirmDeleteModal from "$lib/components/ConfirmDeleteModal.svelte";

    // --- ESTADOS ---
    let usuarios = $state<any[]>([]);
    let cargando = $state(true);
    let editando = $state(false);
    let idSeleccionado = $state<number | null>(null);
    let nombreBorrar = $state("");

    // Estado inicial del formulario
    let formulario = $state({ 
        first_name: "", 
        last_name: "", 
        email: "", 
        password: "", 
        role_id: 3, 
        is_active: true 
    });

    const headers = [
        { label: "Usuario", class: "ps-4" }, 
        { label: "Email" }, 
        { label: "Rol" }, 
        { label: "Estado" }, 
        { label: "Acciones", class: "text-center" }
    ];

    // --- FUNCIONES DE APOYO (Limpieza) ---
    function prepararNuevo() {
        editando = false;
        idSeleccionado = null;
        formulario = { 
            first_name: "", 
            last_name: "", 
            email: "", 
            password: "", 
            role_id: 3, 
            is_active: true 
        };
    }

    function prepararEdicion(u: any) {
        editando = true;
        idSeleccionado = u.user_id;
        // Clonamos el objeto para no editar la tabla directamente
        formulario = { 
            first_name: u.first_name, 
            last_name: u.last_name, 
            email: u.email, 
            password: "", 
            role_id: u.role_id, 
            is_active: u.is_active 
        };
    }

    // --- LÓGICA API ---
    async function cargar() {
        try {
            const res = await fetch("https://gestion-de-horarios-final.onrender.com/get_users", {
                headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            usuarios = Array.isArray(data) ? data : (data.resultado || []);
        } catch (e) {
            console.error("Error:", e);
        } finally {
            cargando = false;
        }
    }

    async function guardar() {
        const url = editando 
            ? `https://gestion-de-horarios-final.onrender.com/update_user/${idSeleccionado}` 
            : "https://gestion-de-horarios-final.onrender.com/create_user";
        
        const res = await fetch(url, {
            method: editando ? "PUT" : "POST",
            headers: { 
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${localStorage.getItem('token')}` 
            },
            body: JSON.stringify(formulario)
        });
        
        if (res.ok) await cargar();
    }

    async function eliminar() {
        const res = await fetch(`https://gestion-de-horarios-final.onrender.com/delete_user/${idSeleccionado}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) await cargar();
    }

    onMount(cargar);
</script>

<PageHeader 
    title="Gestión de Usuarios" 
    subtitle="Universidad CUL" 
    buttonText="Nuevo Usuario" 
    onButtonClick={prepararNuevo} 
/>

{#if cargando}
    <LoadingSpinner />
{:else}
    <DataTable {headers}>
        {#each usuarios as u}
            <tr>
                <td class="ps-4"><strong>{u.first_name} {u.last_name}</strong></td>
                <td>{u.email}</td>
                <td><RoleBadge roleId={u.role_id} /></td>
                <td><StatusBadge active={u.is_active} /></td>
                <td class="text-center">
                    <TableAction 
                        itemName={u.first_name} 
                        onEdit={() => prepararEdicion(u)} 
                        onDelete={() => { idSeleccionado = u.user_id; nombreBorrar = u.first_name; }} 
                    />
                </td>
            </tr>
        {/each}
    </DataTable>
{/if}

<FormModal id="modalPrincipal" title="Usuario" isEdit={editando} onSave={guardar}>
    <div class="row g-3 text-start">
        <div class="col-md-6">
            <label for="u_nombre" class="form-label small fw-bold">Nombre</label>
            <input id="u_nombre" type="text" class="form-control" bind:value={formulario.first_name} required>
        </div>
        <div class="col-md-6">
            <label for="u_apellido" class="form-label small fw-bold">Apellido</label>
            <input id="u_apellido" type="text" class="form-control" bind:value={formulario.last_name} required>
        </div>
        <div class="col-12">
            <label for="u_email" class="form-label small fw-bold">Email</label>
            <input id="u_email" type="email" class="form-control" bind:value={formulario.email} required>
        </div>
        {#if !editando}
            <div class="col-12">
                <label for="u_pass" class="form-label small fw-bold">Contraseña</label>
                <input id="u_pass" type="password" class="form-control" bind:value={formulario.password} required>
            </div>
        {/if}
        <div class="col-12">
            <label for="u_rol" class="form-label small fw-bold">Rol</label>
            <select id="u_rol" class="form-select" bind:value={formulario.role_id}>
                <option value={1}>Admin</option>
                <option value={2}>Coordinación</option>
                <option value={3}>Docente</option>
                <option value={4}>Estudiante</option>
            </select>
        </div>
    </div>
</FormModal>

<ConfirmDeleteModal id="modalEliminar" itemName={nombreBorrar} onDelete={eliminar} />