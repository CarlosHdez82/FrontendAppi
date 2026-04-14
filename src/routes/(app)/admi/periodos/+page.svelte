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
    let lista = $state([]);
    let cargando = $state(true);
    let editando = $state(false);
    let idSeleccionado = $state(null);
    let nombreBorrar = $state("");

    let formulario = $state({
        name: "",
        start_date: "",
        end_date: "",
        is_active: true
    });

    const headers = [
        { label: "Nombre", class: "ps-4" },
        { label: "Fecha Inicio" },
        { label: "Fecha Fin" },
        { label: "Estado", class: "text-center" },
        { label: "Acciones", class: "text-end pe-4" }
    ];

    const getHeaders = () => ({
        "Authorization": `Bearer ${localStorage.getItem('token')}`,
        "Content-Type": "application/json"
    });

    async function cargarPeriodos() {
        cargando = true;
        try {
            const res = await fetch("https://gestion-de-horarios-final.onrender.com/get_periods", { headers: getHeaders() });
            if (res.ok) lista = await res.json();
        } catch (e) { console.error("Error CUL Periods"); }
        finally { cargando = false; }
    }

    function prepararNuevo() {
        editando = false; idSeleccionado = null;
        formulario = { name: "", start_date: "", end_date: "", is_active: true };
    }

    function prepararEdicion(p: any) {
        editando = true; idSeleccionado = p.id;
        formulario = { ...p };
    }

    async function guardar() {
        const url = editando ? `https://gestion-de-horarios-final.onrender.com/update_period/${idSeleccionado}` : "https://gestion-de-horarios-final.onrender.com/create_period";
        const res = await fetch(url, {
            method: editando ? "PUT" : "POST",
            headers: getHeaders(),
            body: JSON.stringify(formulario)
        });
        if (res.ok) await cargarPeriodos();
    }

    async function eliminar() {
        const res = await fetch(`https://gestion-de-horarios-final.onrender.com/delete_period/${idSeleccionado}`, {
            method: "DELETE",
            headers: getHeaders()
        });
        if (res.ok) await cargarPeriodos();
    }

    onMount(cargarPeriodos);
</script>

<PageHeader 
    title="Periodos Académicos" 
    subtitle="Configuración de semestres y fechas límite" 
    buttonText="Nuevo Periodo" 
    onButtonClick={prepararNuevo} 
/>

{#if cargando}
    <LoadingSpinner />
{:else}
    <DataTable {headers}>
        {#each lista as p}
            <tr>
                <td class="ps-4 fw-bold text-dark">{p.name}</td>
                <td><i class="bi bi-calendar-event me-2"></i>{p.start_date}</td>
                <td><i class="bi bi-calendar-check me-2"></i>{p.end_date}</td>
                <td class="text-center">
                    <StatusBadge active={p.is_active} />
                </td>
                <td class="text-end pe-4">
                    <TableAction 
                        itemName={p.name}
                        onEdit={() => prepararEdicion(p)}
                        onDelete={() => { idSeleccionado = p.id; nombreBorrar = p.name; }}
                    />
                </td>
            </tr>
        {/each}
    </DataTable>
{/if}

<FormModal id="modalPrincipal" title="Periodo" isEdit={editando} onSave={guardar}>
    <div class="row g-3 text-start">
        <div class="col-12">
            <label for="p_name" class="form-label small fw-bold">Nombre del Periodo</label>
            <input id="p_name" type="text" class="form-control" placeholder="Ej: 2026-1" bind:value={formulario.name} required>
        </div>
        <div class="col-6">
            <label for="p_start" class="form-label small fw-bold">Fecha Inicio</label>
            <input id="p_start" type="date" class="form-control" bind:value={formulario.start_date} required>
        </div>
        <div class="col-6">
            <label for="p_end" class="form-label small fw-bold">Fecha Fin</label>
            <input id="p_end" type="date" class="form-control" bind:value={formulario.end_date} required>
        </div>
        <div class="col-12 mt-3">
            <div class="form-check form-switch bg-light p-2 rounded border">
                <input class="form-check-input ms-0 me-2" type="checkbox" id="p_active" bind:checked={formulario.is_active}>
                <label class="form-check-label small fw-bold" for="p_active">PERIODO ACTIVO PARA REGISTRO</label>
            </div>
        </div>
    </div>
</FormModal>

<ConfirmDeleteModal id="modalEliminar" itemName={nombreBorrar} onDelete={eliminar} />