<script lang="ts">
    // ============================================================
    // admi/docentes/+page.svelte — Gestión de Docentes
    // ============================================================
    // CRUD completo de docentes para el Administrador.
    // Carga docentes, facultades, programas y roles en paralelo
    // con Promise.all para poblar los selects del formulario.
    // Al editar, la contraseña se vacía por seguridad.
    // ============================================================
    import { onMount } from 'svelte';
    import PageHeader from "$lib/components/PageHeader.svelte";
    import DataTable from "$lib/components/DataTable.svelte";
    import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
    import TableAction from "$lib/components/TableAction.svelte";
    import StatusBadge from "$lib/components/StatusBadge.svelte";
    import FormModal from "$lib/components/FormModal.svelte";
    import ConfirmDeleteModal from "$lib/components/ConfirmDeleteModal.svelte";

    const API = "https://gestion-de-horarios-1.onrender.com";

    let docentes = $state<any[]>([]);
    let facultades = $state<any[]>([]);
    let programas = $state<any[]>([]);
    let roles = $state<any[]>([]);    // Para poblar el select de roles
    let cargando = $state(true);
    let editando = $state(false);
    let idSeleccionado = $state<number | null>(null);
    let nombreBorrar = $state("");

    let formulario = $state({
        first_name: "", last_name: "", email: "",
        password_hash: "", role_id: 0, program_id: 0, is_active: true
    });

    const headers = [
        { label: "Docente", class: "ps-4" },
        { label: "Programa / Facultad" },
        { label: "Estado" },
        { label: "Acciones", class: "text-center" }
    ];

    const getHeaders = () => ({
        "Authorization": `Bearer ${localStorage.getItem('token')}`,
        "Content-Type": "application/json"
    });

    // Carga los 4 recursos en paralelo para mayor eficiencia
    async function cargarDatos() {
        cargando = true;
        try {
            const [rD, rF, rP, rR] = await Promise.all([
                fetch(`${API}/users/teachers`, { headers: getHeaders() }),
                fetch(`${API}/faculties/`, { headers: getHeaders() }),
                fetch(`${API}/programs/`, { headers: getHeaders() }),
                fetch(`${API}/roles/`, { headers: getHeaders() })
            ]);
            if (rD.ok) docentes = await rD.json();
            if (rF.ok) facultades = await rF.json();
            if (rP.ok) programas = await rP.json();
            if (rR.ok) roles = await rR.json();
        } catch (e) {
            console.error("Error CUL API:", e);
        } finally {
            cargando = false;
        }
    }

    function prepararNuevo() {
        editando = false;
        idSeleccionado = null;
        formulario = { first_name: "", last_name: "", email: "", password_hash: "", role_id: 0, program_id: 0, is_active: true };
    }

    function prepararEdicion(u: any) {
        editando = true;
        idSeleccionado = u.id;
        formulario = {
            first_name: u.first_name, last_name: u.last_name, email: u.email,
            password_hash: "", // Vacío por seguridad al editar
            role_id: u.role_id, program_id: u.program_id, is_active: u.is_active
        };
    }

    async function guardar() {
        const url = editando ? `${API}/users/${idSeleccionado}` : `${API}/users/`;
        const res = await fetch(url, {
            method: editando ? "PUT" : "POST",
            headers: getHeaders(),
            body: JSON.stringify(formulario)
        });
        if (res.ok) await cargarDatos();
    }

    async function eliminar() {
        if (!idSeleccionado) return;
        const res = await fetch(`${API}/users/${idSeleccionado}`, {
            method: "DELETE", headers: getHeaders()
        });
        if (res.ok) await cargarDatos();
    }

    onMount(cargarDatos);
</script>

<PageHeader
    title="Docentes CUL"
    subtitle="Administración de docentes - Universidad CUL"
    buttonText="Nuevo Docente"
    onButtonClick={prepararNuevo}
/>

{#if cargando}
    <LoadingSpinner />
{:else}
    <DataTable {headers} data={docentes}>
        {#snippet rowTemplate(u)}
            <tr>
                <td class="ps-4">
                    <div class="fw-bold">{u.first_name} {u.last_name}</div>
                    <div class="small text-muted">{u.email}</div>
                </td>
                <td>
                    <!-- program_name y faculty_name obtenidos por JOIN triple en la API -->
                    <div class="fw-semibold text-primary">{u.program_name || 'N/A'}</div>
                    <div class="small text-muted">{u.faculty_name || 'N/A'}</div>
                </td>
                <td><StatusBadge active={u.is_active} /></td>
                <td class="text-center">
                    <TableAction
                        itemName={`${u.first_name} ${u.last_name}`}
                        onEdit={() => prepararEdicion(u)}
                        onDelete={() => { idSeleccionado = u.id; nombreBorrar = `${u.first_name} ${u.last_name}`; }}
                    />
                </td>
            </tr>
        {/snippet}
    </DataTable>
{/if}

<FormModal id="modalPrincipal" title={editando ? "Editar Docente" : "Nuevo Docente"} isEdit={editando} onSave={guardar}>
    <div class="row g-3 text-start">
        <div class="col-md-6">
            <label for="first_name" class="form-label small fw-bold">Nombres</label>
            <input id="first_name" type="text" class="form-control" bind:value={formulario.first_name} placeholder="Ej: Carlos" required>
        </div>
        <div class="col-md-6">
            <label for="last_name" class="form-label small fw-bold">Apellidos</label>
            <input id="last_name" type="text" class="form-control" bind:value={formulario.last_name} placeholder="Ej: Hernández" required>
        </div>
        <div class="col-12">
            <label for="email" class="form-label small fw-bold">Correo Institucional</label>
            <input id="email" type="email" class="form-control" bind:value={formulario.email} placeholder="usuario@cul.edu.co" required>
        </div>
        <!-- Contraseña: solo visible al crear, oculta al editar -->
        {#if !editando}
            <div class="col-12">
                <label for="password_hash" class="form-label small fw-bold">Contraseña</label>
                <input id="password_hash" type="password" class="form-control" bind:value={formulario.password_hash} required>
            </div>
        {/if}
        <div class="col-md-6">
            <label for="role_id" class="form-label small fw-bold">Rol</label>
            <select id="role_id" class="form-select" bind:value={formulario.role_id} required>
                <option value={0} disabled>Seleccione un rol...</option>
                {#each roles as r (r.id)}
                    <option value={r.id}>{r.name}</option>
                {/each}
            </select>
        </div>
        <div class="col-md-6">
            <label for="program_id" class="form-label small fw-bold">Programa Académico</label>
            <select id="program_id" class="form-select" bind:value={formulario.program_id} required>
                <option value={0} disabled>Seleccione un programa...</option>
                {#each programas as p (p.id)}
                    <option value={p.id}>{p.name}</option>
                {/each}
            </select>
        </div>
        <div class="col-12 mt-3">
            <div class="form-check form-switch bg-light p-2 rounded border">
                <input class="form-check-input ms-1" type="checkbox" id="user_active" bind:checked={formulario.is_active}>
                <label class="form-check-label ms-2 fw-bold" for="user_active">
                    {formulario.is_active ? 'Usuario Activo' : 'Usuario Inactivo'}
                </label>
            </div>
        </div>
    </div>
</FormModal>

<ConfirmDeleteModal id="modalEliminar" itemName={nombreBorrar} onDelete={eliminar} />