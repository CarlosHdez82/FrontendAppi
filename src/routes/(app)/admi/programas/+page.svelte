<script lang="ts">
    // ============================================================
    // admi/programas/+page.svelte — Gestión de Programas Académicos
    // ============================================================
    // CRUD completo de programas para el Administrador.
    // Carga programas y facultades en paralelo con Promise.all
    // para poblar tanto la tabla como el select del formulario.
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

    // --- ESTADOS REACTIVOS ---
    let programas = $state<any[]>([]);
    let facultades = $state<any[]>([]); // Para poblar el select del formulario
    let cargando = $state(true);
    let editando = $state(false);
    let idSeleccionado = $state<number | null>(null);
    let nombreBorrar = $state("");

    let formulario = $state({ name: "", faculty_id: "", is_active: true });

    const headers = [
        { label: "Nombre de la Carrera", class: "ps-4" },
        { label: "Facultad" },
        { label: "Estado", class: "text-center" },
        { label: "Acciones", class: "text-end pe-4" }
    ];

    const getHeaders = () => ({
        "Authorization": `Bearer ${localStorage.getItem('token')}`,
        "Content-Type": "application/json"
    });

    // ------------------------------------------------------------
    // Carga programas y facultades en paralelo con Promise.all
    // Más eficiente que dos fetch secuenciales
    // ------------------------------------------------------------
    async function cargarDatos() {
        cargando = true;
        try {
            const [resP, resF] = await Promise.all([
                fetch(`${API}/programs/`, { headers: getHeaders() }),
                fetch(`${API}/faculties/`, { headers: getHeaders() })
            ]);
            if (resP.ok) programas = await resP.json();
            if (resF.ok) facultades = await resF.json();
        } catch (e) {
            console.error("Error al conectar con la API de la CUL");
        } finally {
            cargando = false;
        }
    }

    function prepararNuevo() {
        editando = false;
        idSeleccionado = null;
        formulario = { name: "", faculty_id: "", is_active: true };
    }

    function prepararEdicion(p: any) {
        editando = true;
        idSeleccionado = p.id;
        formulario = { name: p.name, faculty_id: p.faculty_id, is_active: p.is_active };
    }

    async function guardar() {
        const url = editando ? `${API}/programs/${idSeleccionado}` : `${API}/programs/`;
        const res = await fetch(url, {
            method: editando ? "PUT" : "POST",
            headers: getHeaders(),
            body: JSON.stringify(formulario)
        });
        if (res.ok) await cargarDatos();
    }

    async function eliminar() {
        const res = await fetch(`${API}/programs/${idSeleccionado}`, {
            method: "DELETE", headers: getHeaders()
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
    <DataTable {headers} data={programas}>
        {#snippet rowTemplate(p)}
            <tr>
                <td class="ps-4 fw-bold text-dark">{p.name}</td>
                <td>
                    <!-- Badge con el nombre de la facultad obtenido por JOIN en la API -->
                    <span class="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2">
                        <i class="bi bi-building me-1"></i> {p.faculty_name}
                    </span>
                </td>
                <td class="text-center"><StatusBadge active={p.is_active} /></td>
                <td class="text-end pe-4">
                    <TableAction
                        itemName={p.name}
                        onEdit={() => prepararEdicion(p)}
                        onDelete={() => { idSeleccionado = p.id; nombreBorrar = p.name; }}
                    />
                </td>
            </tr>
        {/snippet}
    </DataTable>
{/if}

<FormModal id="modalPrincipal" title="Programa" isEdit={editando} onSave={guardar}>
    <div class="row g-3 text-start">
        <div class="col-12">
            <label for="prog_name" class="form-label small fw-bold text-muted">NOMBRE DEL PROGRAMA</label>
            <input id="prog_name" type="text" class="form-control form-control-lg border-2"
                bind:value={formulario.name} placeholder="Ej: Ingeniería de Sistemas" required />
        </div>
        <div class="col-12">
            <label for="faculty_id" class="form-label small fw-bold text-muted">FACULTAD PERTENECIENTE</label>
            <!-- Select poblado dinámicamente con las facultades cargadas de la API -->
            <select id="faculty_id" class="form-select border-2" bind:value={formulario.faculty_id} required>
                <option value="" disabled>Seleccione la facultad...</option>
                {#each facultades as f}
                    <option value={f.id}>{f.name}</option>
                {/each}
            </select>
        </div>
        <div class="col-12">
            <div class="form-check form-switch p-3 bg-light rounded border border-dashed shadow-sm">
                <input class="form-check-input ms-0 me-2" type="checkbox" id="is_active_prog" bind:checked={formulario.is_active}>
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