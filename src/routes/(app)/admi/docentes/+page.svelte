<script lang="ts">
    import { onMount } from 'svelte';
    import PageHeader from "$lib/components/PageHeader.svelte";
    import DataTable from "$lib/components/DataTable.svelte";
    import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
    import TableAction from "$lib/components/TableAction.svelte";
    import StatusBadge from "$lib/components/StatusBadge.svelte";
    import FormModal from "$lib/components/FormModal.svelte";
    import ConfirmDeleteModal from "$lib/components/ConfirmDeleteModal.svelte";

    // --- ESTADOS ---
    let docentes = $state([]);
    let facultades = $state([]);
    let programas = $state([]);
    let niveles = $state([]);
    let roles = $state([]);
    let cargando = $state(true);
    let editando = $state(false);
    let idSeleccionado = $state(null);
    let nombreBorrar = $state("");

    let formulario = $state({
        first_name: "", last_name: "", email: "", phone: "",
        hire_date: new Date().toISOString().split('T')[0],
        faculty_id: 0, program_id: 0, level_id: 0, role_id: 0, is_active: true
    });

    const headers = [
        { label: "Docente", class: "ps-4" },
        { label: "Ubicación" },
        { label: "Nivel" },
        { label: "Estado" },
        { label: "Acciones", class: "text-center" }
    ];

        async function cargarTodo() {
            const token = localStorage.getItem('token');
            const h = { "Authorization": `Bearer ${token}` };
            try {
                const [rD, rF, rP, rL, rR] = await Promise.all([
                    fetch("https://gestion-de-horarios-final.onrender.com/get_teachers", { headers: h }),
                    fetch("https://gestion-de-horarios-final.onrender.com/get_faculties", { headers: h }),
                    fetch("https://gestion-de-horarios-final.onrender.com/get_programs", { headers: h }),
                    fetch("https://gestion-de-horarios-final.onrender.com/get_teacherlevels", { headers: h }),
                    fetch("https://gestion-de-horarios-final.onrender.com/get_roles", { headers: h })
                ]);
                if (rD.ok) docentes = await rD.json();
                if (rF.ok) facultades = await rF.json();
                if (rP.ok) programas = await rP.json();
                if (rL.ok) niveles = await rL.json();
                if (rR.ok) roles = await rR.json();
            } catch (e) { console.error("Error CUL API"); }
            finally { cargando = false; }
        }

    function prepararNuevo() {
        editando = false; idSeleccionado = null;
        formulario = { 
            first_name: "", last_name: "", email: "", phone: "", 
            hire_date: new Date().toISOString().split('T')[0],
            faculty_id: 0, program_id: 0, level_id: 0, role_id: 0, is_active: true 
        };
    }

    function prepararEdicion(d: any) {
        editando = true; idSeleccionado = d.teacher_id;
        formulario = { ...d };
    }

    async function guardar() {
        const url = editando ? `https://gestion-de-horarios-final.onrender.com/update_teacher/${idSeleccionado}` : "https://gestion-de-horarios-final.onrender.com/create_teacher";
        const res = await fetch(url, {
            method: editando ? "PUT" : "POST",
            headers: { "Authorization": `Bearer ${localStorage.getItem('token')}`, "Content-Type": "application/json" },
            body: JSON.stringify(formulario)
        });
        if (res.ok) await cargarTodo();
    }

    async function eliminar() {
        const res = await fetch(`https://gestion-de-horarios-final.onrender.com/delete_teacher/${idSeleccionado}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) await cargarTodo();
    }

    onMount(cargarTodo);
</script>

<PageHeader 
    title="Docentes CUL" 
    subtitle="Gestión de Personal Académico" 
    buttonText="Nuevo Docente" 
    onButtonClick={prepararNuevo} 
/>

{#if cargando}
    <LoadingSpinner />
{:else}
    <DataTable {headers}>
        {#each docentes as d}
            <tr>
                <td class="ps-4">
                    <div class="fw-bold">{d.first_name} {d.last_name}</div>
                    <div class="small text-muted">{d.email}</div>
                </td>
                <td>
                    <span class="badge bg-primary-subtle text-primary border mb-1">{d.faculty_name}</span>
                    <div class="small fw-bold">{d.program_name}</div>
                </td>
                <td>
                    <div class="small fw-bold text-secondary text-uppercase">
                        <i class="bi bi-mortarboard-fill me-1 text-primary"></i>
                        {d.level_name || 'N/A'}
                    </div>
                </td>
                <td><StatusBadge active={d.is_active} /></td>
                <td class="text-center">
                    <TableAction 
                        itemName={`${d.first_name} ${d.last_name}`}
                        onEdit={() => prepararEdicion(d)}
                        onDelete={() => { idSeleccionado = d.teacher_id; nombreBorrar = `${d.first_name} ${d.last_name}`; }}
                    />
                </td>
            </tr>
        {/each}
    </DataTable>
{/if}

<FormModal id="modalPrincipal" title="Docente" isEdit={editando} onSave={guardar}>
    <div class="row g-2 text-start">
        
        <div class="col-12">
            <label for="doc_nombres" class="form-label small fw-bold mb-1">Nombre Completo</label>
            <div class="input-group input-group-sm">
                <input id="doc_nombres" type="text" class="form-control" placeholder="Nombres" bind:value={formulario.first_name} required>
                <input id="doc_apellidos" type="text" class="form-control" placeholder="Apellidos" aria-label="Apellidos" bind:value={formulario.last_name} required>
            </div>
        </div>

        <div class="col-12">
            <label for="doc_email" class="form-label small fw-bold mb-1">Contacto</label>
            <input id="doc_email" type="email" class="form-control form-control-sm mb-2" placeholder="Correo institucional" bind:value={formulario.email} required>
            <label for="doc_phone" class="visually-hidden">Teléfono</label>
            <input id="doc_phone" type="text" class="form-control form-control-sm" placeholder="Teléfono" bind:value={formulario.phone}>
        </div>

        <div class="col-12">
            <label for="doc_faculty" class="form-label small fw-bold mb-1">Ubicación Académica</label>
            <select id="doc_faculty" class="form-select form-select-sm mb-2" bind:value={formulario.faculty_id} required>
                <option value={0}>Seleccionar Facultad...</option>
                {#each facultades as f} <option value={f.id}>{f.name}</option> {/each}
            </select>
            <label for="doc_program" class="visually-hidden">Programa</label>
            <select id="doc_program" class="form-select form-select-sm" bind:value={formulario.program_id} required>
                <option value={0}>Seleccionar Programa...</option>
                {#each programas as p} <option value={p.id}>{p.name}</option> {/each}
            </select>
        </div>

        <div class="col-6">
            <label for="doc_level" class="form-label small fw-bold mb-1">Nivel</label>
            <select id="doc_level" class="form-select form-select-sm" bind:value={formulario.level_id} required>
                <option value={0}>Seleccionar Nivel...</option>
                {#each niveles as n} <option value={n.teacherlevel_id}>{n.name}</option> {/each}
            </select>
        </div>

        <div class="col-6">
            <label for="doc_role" class="form-label small fw-bold mb-1">Rol</label>
            <select id="doc_role" class="form-select form-select-sm" bind:value={formulario.role_id} required>
                <option value={0}>Seleccionar Rol...</option>
                {#each roles as r} <option value={r.role_id}>{r.name}</option> {/each}
            </select>
        </div>

        <div class="col-12 mt-3">
            <div class="form-check form-switch bg-light p-2 rounded border">
                <input class="form-check-input ms-0 me-2" type="checkbox" id="ia_doc" bind:checked={formulario.is_active}>
                <label class="form-check-label small fw-bold" for="ia_doc">DOCENTE ACTIVO</label>
            </div>
        </div>
    </div>
</FormModal>

<ConfirmDeleteModal id="modalEliminar" itemName={nombreBorrar} onDelete={eliminar} />