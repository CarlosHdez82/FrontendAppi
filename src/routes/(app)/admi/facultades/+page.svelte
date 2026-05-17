<script lang="ts">
    // ============================================================
    // admi/facultades/+page.svelte — Gestión de Facultades
    // ============================================================
    // CRUD completo de facultades para el Administrador.
    // Permite crear, listar, editar y eliminar facultades.
    // getHeaders() centraliza los headers de autorización JWT
    // para no repetirlos en cada fetch.
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
    let facultades = $state<any[]>([]);
    let cargando = $state(true);
    let error = $state("");
    let editando = $state(false);                    // true = modo edición, false = modo creación
    let idSeleccionado = $state<number | null>(null); // ID del registro activo en el modal
    let nombreBorrar = $state("");                   // Nombre a mostrar en el modal de eliminación

    let formulario = $state({ name: "", is_active: true });

    const headers = [
        { label: "Nombre de la Facultad" },
        { label: "Estado" },
        { label: "Acciones", class: "text-center" }
    ];

    // Genera los headers HTTP con el token JWT del localStorage
    const getHeaders = () => ({
        "Authorization": `Bearer ${localStorage.getItem('token')}`,
        "Content-Type": "application/json"
    });

    // ------------------------------------------------------------
    // Prepara el formulario para crear una nueva facultad
    // Resetea todos los campos y desactiva el modo edición
    // ------------------------------------------------------------
    function prepararNuevo() {
        editando = false;
        idSeleccionado = null;
        formulario = { name: "", is_active: true };
    }

    // Carga los datos del registro seleccionado en el formulario para editar
    function prepararEdicion(f: any) {
        editando = true;
        idSeleccionado = f.id;
        formulario = { name: f.name, is_active: f.is_active };
    }

    // ------------------------------------------------------------
    // GET /faculties/ — Carga la lista completa de facultades
    // ------------------------------------------------------------
    async function cargar() {
        cargando = true;
        try {
            const res = await fetch(`${API}/faculties/`, { headers: getHeaders() });
            const data = await res.json();
            facultades = Array.isArray(data) ? data : [];
        } catch (err) {
            error = "Error al conectar con el servidor";
        } finally {
            cargando = false;
        }
    }

    // ------------------------------------------------------------
    // POST /faculties/ o PUT /faculties/{id}
    // Crea o actualiza según el modo del formulario (editando)
    // ------------------------------------------------------------
    async function guardar() {
        const url = editando ? `${API}/faculties/${idSeleccionado}` : `${API}/faculties/`;
        const res = await fetch(url, {
            method: editando ? "PUT" : "POST",
            headers: getHeaders(),
            body: JSON.stringify(formulario)
        });
        if (res.ok) await cargar(); // Recarga la tabla tras guardar
    }

    // DELETE /faculties/{id} — Elimina la facultad seleccionada
    async function eliminar() {
        const res = await fetch(`${API}/faculties/${idSeleccionado}`, {
            method: "DELETE", headers: getHeaders()
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
    <DataTable {headers} data={facultades}>
        {#snippet rowTemplate(f)}
            <tr>
                <td>
                    <div class="fw-bold">{f.name}</div>
                    <small class="text-muted">CUL - Sede Principal</small>
                </td>
                <td><StatusBadge active={f.is_active} /></td>
                <td class="text-center">
                    <TableAction
                        itemName={f.name}
                        onEdit={() => prepararEdicion(f)}
                        onDelete={() => { idSeleccionado = f.id; nombreBorrar = f.name; }}
                    />
                </td>
            </tr>
        {/snippet}
    </DataTable>
{/if}

<!-- Modal de creación/edición -->
<FormModal id="modalPrincipal" title="Facultad" isEdit={editando} onSave={guardar}>
    <div class="row g-3 text-start">
        <div class="col-12">
            <label for="fac_name" class="form-label small fw-bold">Nombre de la Facultad</label>
            <input id="fac_name" type="text" class="form-control form-control-lg"
                placeholder="Ej: Ingeniería de Sistemas" bind:value={formulario.name} required>
        </div>
        <div class="col-12">
            <div class="form-check form-switch mt-2">
                <input id="fac_active" class="form-check-input" type="checkbox" bind:checked={formulario.is_active}>
                <label class="form-check-label" for="fac_active">Facultad Activa</label>
            </div>
        </div>
    </div>
</FormModal>

<!-- Modal de confirmación de eliminación -->
<ConfirmDeleteModal id="modalEliminar" itemName={nombreBorrar} onDelete={eliminar} />