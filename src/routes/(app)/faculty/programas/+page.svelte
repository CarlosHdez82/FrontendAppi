<script lang="ts">
    import { onMount } from 'svelte';
    import PageHeader from "$lib/components/PageHeader.svelte";
    import DataTable from "$lib/components/DataTable.svelte";
    import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
    import TableAction from "$lib/components/TableAction.svelte";
    import StatusBadge from "$lib/components/StatusBadge.svelte";
    import FormModal from "$lib/components/FormModal.svelte";
    import ConfirmDeleteModal from "$lib/components/ConfirmDeleteModal.svelte";

    // --- ESTADOS REACTIVOS ---
    let programas = $state<any[]>([]);
    let facultades = $state<any[]>([]);
    let cargando = $state(true);
    let editando = $state(false);
    let idSeleccionado = $state<number | null>(null);
    let nombreBorrar = $state("");

    let formulario = $state({
        name: "",
        faculty_id: "",
        is_active: true
    });

    const headers = [
        { label: "Nombre de la Carrera", class: "ps-4" },
        { label: "Facultad" },
        { label: "Estado", class: "text-center" },
        { label: "Acciones", class: "text-end pe-4" }
    ];

    // --- FUNCIONES DE CARGA ---
    async function cargarDatos() {
        const token = localStorage.getItem('token');
        const h = { "Authorization": `Bearer ${token}` };
        try {
            const [resP, resF] = await Promise.all([
                fetch("https://gestion-de-horarios-final.onrender.com/get_programs", { headers: h }),
                fetch("https://gestion-de-horarios-final.onrender.com/get_faculties", { headers: h })
            ]);

            if (resP.ok) programas = await resP.json();
            if (resF.ok) facultades = await resF.json();
        } catch (e) {
            console.error("Error al conectar con la API");
        } finally {
            cargando = false;
        }
    }

    // --- ACCIONES ---
    function prepararNuevo() {
        editando = false;
        idSeleccionado = null;
        formulario = { name: "", faculty_id: "", is_active: true };
    }

    function prepararEdicion(p: any) {
        editando = true;
        idSeleccionado = p.program_id;
        formulario = {
            name: p.name,
            faculty_id: p.faculty_id,
            is_active: p.is_active
        };
    }

    async function guardar() {
        const url = editando 
            ? `https://gestion-de-horarios-final.onrender.com/update_program/${idSeleccionado}` 
            : "https://gestion-de-horarios-final.onrender.com/create_program";
        
        const res = await fetch(url, {
            method: editando ? "PUT" : "POST",
            headers: { 
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
                "Content-Type": "application/json" 
            },
            body: JSON.stringify(formulario)
        });

        if (res.ok) await cargarDatos();
    }

    async function eliminar() {
        const res = await fetch(`https://gestion-de-horarios-final.onrender.com/delete_program/${idSeleccionado}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) await cargarDatos();
    }

    onMount(cargarDatos);
</script>

<PageHeader 
    title="Programas Académicos" 
    subtitle="Configuración de carreras por facultad - Universidad CUL" 
    buttonText="Nuevo Programa" 
    onButtonClick={prepararNuevo} 
/>

{#if cargando}
    <LoadingSpinner />
{:else}
    <DataTable {headers}>
        {#each programas as p}
            <tr>
                <td class="ps-4 fw-bold text-dark">{p.name}</td>
                <td>
                    <span class="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2">
                        <i class="bi bi-building me-1"></i> {p.faculty_name}
                    </span>
                </td>
                <td class="text-center">
                    <StatusBadge active={p.is_active} />
                </td>
                <td class="text-end pe-4">
                    <TableAction 
                        itemName={p.name}
                        onEdit={() => prepararEdicion(p)}
                        onDelete={() => { idSeleccionado = p.program_id; nombreBorrar = p.name; }}
                    />
                </td>
            </tr>
        {/each}
    </DataTable>
{/if}

<FormModal id="modalPrincipal" title="Programa" isEdit={editando} onSave={guardar}>
    <div class="row g-3 text-start">
        <div class="col-12">
            <label for="prog_name" class="form-label small fw-bold">Nombre del Programa</label>
            <input 
                id="prog_name"
                type="text" 
                class="form-control form-control-lg border-2" 
                bind:value={formulario.name} 
                placeholder="Ej: Ingeniería de Sistemas" 
                required 
            />
        </div>

        <div class="col-12">
            <label for="faculty_id" class="form-label small fw-bold">Facultad Perteneciente</label>
            <select id="faculty_id" class="form-select border-2" bind:value={formulario.faculty_id} required>
                <option value="" disabled selected>Seleccione la facultad...</option>
                {#each facultades as f}
                    <option value={f.faculties_id || f.id}>{f.name}</option>
                {/each}
            </select>
        </div>

        <div class="col-12">
            <div class="form-check form-switch p-3 bg-light rounded border border-dashed">
                <input 
                    class="form-check-input ms-0 me-2" 
                    type="checkbox" 
                    id="is_active_prog" 
                    bind:checked={formulario.is_active}
                >
                <label class="form-check-label small fw-bold text-dark" for="is_active_prog">
                    PROGRAMA HABILITADO / ACTIVO
                </label>
            </div>
        </div>
    </div>
</FormModal>

<ConfirmDeleteModal id="modalEliminar" itemName={nombreBorrar} onDelete={eliminar} />

<style>
    .border-dashed { border-style: dashed !important; }
</style>