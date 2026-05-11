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
    // Importante: Usar $state para que Svelte 5 rastree el arreglo
    let usuarios = $state<any[]>([]);
    let cargando = $state(true);
    let editando = $state(false);
    let idSeleccionado = $state<number | null>(null);
    let nombreBorrar = $state("");

    const API = "https://gestion-de-horarios-1.onrender.com";

    let formulario = $state({ 
        first_name: "", 
        last_name: "", 
        email: "", 
        password_hash: "", 
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

    function prepararNuevo() {
        editando = false;
        idSeleccionado = null;
        formulario = { first_name: "", last_name: "", email: "", password_hash: "", role_id: 3, is_active: true };
    }

    function prepararEdicion(u: any) {
        editando = true;
        // OJO: Verifica si tu API devuelve 'user_id' o solo 'id'
        idSeleccionado = u.user_id || u.id; 
        formulario = { 
            first_name: u.first_name, 
            last_name: u.last_name, 
            email: u.email, 
            password_hash: "", 
            role_id: u.role_id, 
            is_active: u.is_active 
        };
    }

    async function cargar() {
        cargando = true;
        try {
            const res = await fetch(`${API}/users/`, {
                headers: { 
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                    "Content-Type": "application/json"
                }
            });

            if (!res.ok) {
                console.error("Respuesta fallida del servidor:", res.status);
                return;
            }

            const data = await res.json();
            
            // LOG DE CONTROL: Mira en la consola (F12) qué sale aquí
            console.log("Datos recibidos de la API:", data);

            // Verificamos todas las posibles estructuras que puede enviar FastAPI
            if (Array.isArray(data)) {
                usuarios = data;
            } else if (data.resultado && Array.isArray(data.resultado)) {
                usuarios = data.resultado;
            } else if (data.users && Array.isArray(data.users)) {
                usuarios = data.users;
            } else {
                usuarios = [];
            }
            
        } catch (e) {
            console.error("Error crítico de conexión:", e);
        } finally {
            cargando = false;
        }
    }

    async function guardar() {
        const url = editando 
            ? `${API}/users/${idSeleccionado}` 
            : `${API}/users/`;
        
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
        const res = await fetch(`${API}/users/${idSeleccionado}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) await cargar();
    }

    onMount(cargar);
</script>

<PageHeader 
    title="Gestión de Usuarios" 
    subtitle="Administración de cuentas - Universidad CUL" 
    buttonText="Nuevo Usuario" 
    onButtonClick={prepararNuevo} 
/>

{#if cargando}
    <LoadingSpinner />
{:else}
    {#key usuarios}
        {#if usuarios.length > 0}
            <DataTable {headers} data={usuarios}>
                {#snippet rowTemplate(u)}
                    <tr>
                        <td class="ps-4">
                            <div class="d-flex flex-column">
                                <span class="fw-bold text-dark">{u.first_name} {u.last_name}</span>
                            </div>
                        </td>
                        <td>{u.email}</td>
                        <td><RoleBadge roleId={u.role_id} /></td>
                        <td><StatusBadge active={u.is_active} /></td>
                        <td class="text-center">
                            <TableAction 
                                itemName={`${u.first_name} ${u.last_name}`} 
                                onEdit={() => prepararEdicion(u)} 
                                onDelete={() => { 
                                    idSeleccionado = u.user_id || u.id; 
                                    nombreBorrar = `${u.first_name} ${u.last_name}`; 
                                }} 
                            />
                        </td>
                    </tr>
                {/snippet}
            </DataTable>
        {:else}
            <div class="alert alert-info text-center mt-4">
                No se encontraron usuarios registrados.
            </div>
        {/if}
    {/key}
{/if}

<FormModal id="modalPrincipal" title={editando ? "Editar Usuario" : "Nuevo Usuario"} isEdit={editando} onSave={guardar}>
    <div class="row g-3 text-start">
        <div class="col-md-6">
            <label for="u_nombre" class="form-label small fw-bold text-secondary">NOMBRE</label>
            <input id="u_nombre" type="text" class="form-control" bind:value={formulario.first_name} required>
        </div>
        <div class="col-md-6">
            <label for="u_apellido" class="form-label small fw-bold text-secondary">APELLIDO</label>
            <input id="u_apellido" type="text" class="form-control" bind:value={formulario.last_name} required>
        </div>
        <div class="col-12">
            <label for="u_email" class="form-label small fw-bold text-secondary">EMAIL INSTITUCIONAL</label>
            <input id="u_email" type="email" class="form-control" bind:value={formulario.email} required>
        </div>
        
        {#if !editando}
            <div class="col-12">
                <label for="u_pass" class="form-label small fw-bold text-secondary">CONTRASEÑA</label>
                <input id="u_pass" type="password" class="form-control" bind:value={formulario.password_hash} required>
            </div>
        {/if}
        
        <div class="col-12">
            <label for="u_rol" class="form-label small fw-bold text-secondary">ROL ASIGNADO</label>
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