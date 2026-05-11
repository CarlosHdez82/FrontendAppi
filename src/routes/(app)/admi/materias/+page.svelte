<script lang="ts">
    import { onMount } from 'svelte';
    import PageHeader from "$lib/components/PageHeader.svelte";
    import DataTable from "$lib/components/DataTable.svelte";
    import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
    import TableAction from "$lib/components/TableAction.svelte";
    import FormModal from "$lib/components/FormModal.svelte";
    import ConfirmDeleteModal from "$lib/components/ConfirmDeleteModal.svelte";

    const API = "https://gestion-de-horarios-1.onrender.com";

    // --- ESTADOS ---
    let materias = $state([]);
    let programas = $state([]);
    let cargando = $state(true);
    let editando = $state(false);
    let idSeleccionado = $state(null);
    let nombreBorrar = $state("");

    let formulario = $state({
        name: "",
        credits: 1,
        program_id: 0
    });

    const headers = [
        { label: "Materia", class: "ps-4" },
        { label: "Créditos" },
        { label: "Programa" },
        { label: "Acciones", class: "text-center" }
    ];

    const getHeaders = () => ({
        "Authorization": `Bearer ${localStorage.getItem('token')}`,
        "Content-Type": "application/json"
    });

    async function cargarTodo() {
        cargando = true;
        try {
            const [rM, rP] = await Promise.all([
                fetch(`${API}/subjects/`, { headers: getHeaders() }),
                fetch(`${API}/programs/`, { headers: getHeaders() })
            ]);
            if (rM.ok) materias = await rM.json();
            if (rP.ok) programas = await rP.json();
        } catch (e) {
            console.error("Error CUL Materias");
        } finally {
            cargando = false;
        }
    }

    function prepararNuevo() {
        editando = false;
        idSeleccionado = null;
        formulario = { name: "", credits: 1, program_id: 0 };
    }

    function prepararEdicion(m: any) {
        editando = true;
        idSeleccionado = m.id;
        formulario = { name: m.name, credits: m.credits, program_id: m.program_id };
    }

    async function guardar() {
        const url = editando
            ? `${API}/subjects/${idSeleccionado}`
            : `${API}/subjects/`;

        const res = await fetch(url, {
            method: editando ? "PUT" : "POST",
            headers: getHeaders(),
            body: JSON.stringify(formulario)
        });
        if (res.ok) await cargarTodo();
    }

    async function eliminar() {
        const res = await fetch(`${API}/subjects/${idSeleccionado}`, {
            method: "DELETE",
            headers: getHeaders()
        });
        if (res.ok) await cargarTodo();
    }

    onMount(cargarTodo);
</script>

<PageHeader 
    title="Materias CUL" 
    subtitle="Catálogo de Asignaturas" 
    buttonText="Nueva Materia" 
    onButtonClick={prepararNuevo} 
/>

{#if cargando}
    <LoadingSpinner />
{:else}
    <DataTable {headers} data={materias}>
        {#snippet rowTemplate(m)}
            <tr>
                <td class="ps-4 fw-bold text-primary">{m.name}</td>
                <td><span class="badge bg-secondary">{m.credits} Créditos</span></td>
                <td>{m.program_name}</td>
                <td class="text-center">
                    <TableAction 
                        itemName={m.name}
                        onEdit={() => prepararEdicion(m)}
                        onDelete={() => { idSeleccionado = m.id; nombreBorrar = m.name; }}
                    />
                </td>
            </tr>
        {/snippet}
    </DataTable>
{/if}

<FormModal id="modalPrincipal" title="Materia" isEdit={editando} onSave={guardar}>
    <div class="row g-3 text-start">
        <div class="col-12">
            <label for="sub_name" class="form-label small fw-bold">Nombre de la Materia</label>
            <input id="sub_name" type="text" class="form-control" bind:value={formulario.name} required>
        </div>
        <div class="col-6">
            <label for="sub_credits" class="form-label small fw-bold">Créditos</label>
            <input id="sub_credits" type="number" class="form-control" min="1" max="10" bind:value={formulario.credits} required>
        </div>
        <div class="col-6">
            <label for="sub_prog" class="form-label small fw-bold">Programa</label>
            <select id="sub_prog" class="form-select" bind:value={formulario.program_id} required>
                <option value={0} disabled>Seleccionar...</option>
                {#each programas as p}
                    <option value={p.id}>{p.name}</option>
                {/each}
            </select>
        </div>
    </div>
</FormModal>

<ConfirmDeleteModal id="modalEliminar" itemName={nombreBorrar} onDelete={eliminar} />
