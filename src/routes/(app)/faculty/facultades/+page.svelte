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
    let facultades = $state<any[]>([]);
    let cargando = $state(true);
    let error = $state("");
    let editando = $state(false);
    let idSeleccionado = $state<number | null>(null);
    let nombreBorrar = $state("");

    let formulario = $state({
        name: "",
        is_active: true
    });

    const headers = [
        { label: "ID", class: "ps-4" },
        { label: "Nombre de la Facultad" },
        { label: "Estado" },
        { label: "Acciones", class: "text-center" }
    ];

    // --- FUNCIONES DE APOYO ---
    function prepararNuevo() {
        editando = false;
        idSeleccionado = null;
        formulario = { name: "", is_active: true };
    }

    function prepararEdicion(f: any) {
        editando = true;
        idSeleccionado = f.faculties_id;
        formulario = {
            name: f.name,
            is_active: f.is_active
        };
    }

    // --- LÓGICA API ---
    async function cargar() {
        try {
            const res = await fetch("https://gestion-de-horarios-final.onrender.com/get_faculties", {
                headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            facultades = Array.isArray(data) ? data : [];
        } catch (err) {
            error = "Error al conectar con el servidor";
        } finally {
            cargando = false;
        }
    }

    async function guardar() {
        const url = editando 
            ? `https://gestion-de-horarios-final.onrender.com/update_faculty/${idSeleccionado}` 
            : "https://gestion-de-horarios-final.onrender.com/create_faculty";
        
        const res = await fetch(url, {
            method: editando ? "PUT" : "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formulario)
        });

        if (res.ok) await cargar();
    }

    async function eliminar() {
        const res = await fetch(`https://gestion-de-horarios-final.onrender.com/delete_faculty/${idSeleccionado}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) await cargar();
    }

    onMount(cargar);
</script>

<PageHeader 
    title="Gestión de Facultades" 
    subtitle="Unidades Académicas Universidad CUL" 
    buttonText="Nueva Facultad" 
    onButtonClick={prepararNuevo} 
/>

{#if cargando}
    <LoadingSpinner />
{:else if error}
    <div class="alert alert-danger border-0 shadow-sm">{error}</div>
{:else}
    <DataTable {headers}>
        {#each facultades as f}
            <tr>
                <td class="ps-4 text-muted">#{f.faculties_id}</td>
                <td>
                    <div class="fw-bold">{f.name}</div>
                    <small class="text-muted">CUL - Sede Principal</small>
                </td>
                <td><StatusBadge active={f.is_active} /></td>
                <td class="text-center">
                    <TableAction 
                        itemName={f.name}
                        onEdit={() => prepararEdicion(f)}
                        onDelete={() => { idSeleccionado = f.faculties_id; nombreBorrar = f.name; }}
                    />
                </td>
            </tr>
        {/each}
    </DataTable>
{/if}

<FormModal id="modalPrincipal" title="Facultad" isEdit={editando} onSave={guardar}>
    <div class="row g-3 text-start">
        <div class="col-12">
            <label for="fac_name" class="form-label small fw-bold">Nombre de la Facultad</label>
            <input 
                id="fac_name"
                type="text" 
                class="form-control form-control-lg" 
                placeholder="Ej: Ingeniería de Sistemas"
                bind:value={formulario.name} 
                required
            >
        </div>
        <div class="col-12">
            <div class="form-check form-switch mt-2">
                <input 
                    id="fac_active"
                    class="form-check-input" 
                    type="checkbox" 
                    bind:checked={formulario.is_active}
                >
                <label class="form-check-label" for="fac_active">Facultad Activa</label>
            </div>
        </div>
    </div>
</FormModal>

<ConfirmDeleteModal id="modalEliminar" itemName={nombreBorrar} onDelete={eliminar} />