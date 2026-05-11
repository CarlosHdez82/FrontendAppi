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
    let lista = $state<any[]>([]);
    let docentes = $state<any[]>([]);
    let periodos = $state<any[]>([]);
    let cargando = $state(true);
    let editando = $state(false);
    let idSeleccionado = $state<number | null>(null);
    let nombreDocenteBorrar = $state("");

    const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

    let formulario = $state({
        teacher_id: "",
        period_id: "",
        day_of_week: "Lunes",
        block_label: ""
    });

    const headers = [
        { label: "Docente", class: "ps-4" },
        { label: "Día" },
        { label: "Bloque / Horario" },
        { label: "Periodo" },
        { label: "Acciones", class: "text-end pe-4" }
    ];

    const getHeaders = () => ({
        "Authorization": `Bearer ${localStorage.getItem('token')}`,
        "Content-Type": "application/json"
    });

    async function cargarDatos() {
        cargando = true;
        try {
            const [resLista, resDocentes, resPeriodos] = await Promise.all([
                fetch(`${API}/availability/`, { headers: getHeaders() }),
                fetch(`${API}/users/teachers`, { headers: getHeaders() }),
                fetch(`${API}/academic-periods/`, { headers: getHeaders() })
            ]);

            if (resLista.ok) lista = await resLista.json();
            if (resDocentes.ok) docentes = await resDocentes.json();
            if (resPeriodos.ok) periodos = await resPeriodos.json();
        } catch (e) {
            console.error("Error de conexión:", e);
        } finally {
            cargando = false;
        }
    }

    function prepararNuevo() {
        editando = false;
        idSeleccionado = null;
        formulario = { teacher_id: "", period_id: "", day_of_week: "Lunes", block_label: "" };
    }

    function prepararEdicion(item: any) {
        editando = true;
        idSeleccionado = item.id;
        formulario = {
            teacher_id: item.teacher_id,
            period_id: item.period_id,
            day_of_week: item.day_of_week,
            block_label: item.block_label
        };
    }

    async function guardar() {
        const url = editando
            ? `${API}/availability/${idSeleccionado}`
            : `${API}/availability/`;

        const res = await fetch(url, {
            method: editando ? "PUT" : "POST",
            headers: getHeaders(),
            body: JSON.stringify(formulario)
        });

        if (res.ok) await cargarDatos();
    }

    async function eliminar() {
        const res = await fetch(`${API}/availability/${idSeleccionado}`, {
            method: "DELETE",
            headers: getHeaders()
        });
        if (res.ok) await cargarDatos();
    }

    onMount(cargarDatos);
</script>

<PageHeader 
    title="Disponibilidad Docente" 
    subtitle="Panel Administrativo - Universidad CUL" 
    buttonText="Agregar Disponibilidad" 
    onButtonClick={prepararNuevo} 
/>

{#if cargando}
    <LoadingSpinner />
{:else}
    <DataTable {headers} data={lista}>
        {#snippet rowTemplate(item)}
            <tr>
                <td class="ps-4">
                    <div class="fw-bold text-dark">{item.teacher_name || 'N/A'}</div>
                </td>
                <td>
                    <span class="badge bg-primary-subtle text-primary border border-primary-subtle px-3">
                        {item.day_of_week}
                    </span>
                </td>
                <td>
                    <span class="text-muted">
                        <i class="bi bi-clock me-1"></i>
                        {item.block_label || 'Sin horario'}
                    </span>
                </td>
                <td>
                    <small class="fw-medium text-secondary">{item.period_name || 'N/A'}</small>
                </td>
                <td class="text-end pe-4">
                    <TableAction 
                        itemName={`Franja de ${item.teacher_name || 'docente'}`}
                        onEdit={() => prepararEdicion(item)}
                        onDelete={() => { 
                            idSeleccionado = item.id;
                            nombreDocenteBorrar = item.teacher_name || 'docente';
                        }}
                    />
                </td>
            </tr>
        {/snippet}
    </DataTable>
{/if}

<FormModal id="modalPrincipal" title="Disponibilidad" isEdit={editando} onSave={guardar}>
    <div class="row g-3 text-start">
        <div class="col-12">
            <label for="f_teacher" class="form-label small fw-bold">DOCENTE</label>
            <select id="f_teacher" class="form-select" bind:value={formulario.teacher_id} required>
                <option value="" disabled>Seleccione un docente...</option>
                {#each docentes as d}
                    <option value={d.id}>{d.first_name} {d.last_name}</option>
                {/each}
            </select>
        </div>

        <div class="col-12">
            <label for="f_period" class="form-label small fw-bold">PERIODO ACADÉMICO</label>
            <select id="f_period" class="form-select" bind:value={formulario.period_id} required>
                <option value="" disabled>Seleccione periodo...</option>
                {#each periodos as p}
                    <option value={p.id}>{p.name}</option>
                {/each}
            </select>
        </div>

        <div class="col-12">
            <label for="f_day" class="form-label small fw-bold">DÍA DE LA SEMANA</label>
            <select id="f_day" class="form-select" bind:value={formulario.day_of_week} required>
                {#each dias as dia}
                    <option value={dia}>{dia}</option>
                {/each}
            </select>
        </div>

        <div class="col-12">
            <label for="f_block" class="form-label small fw-bold">ETIQUETA DE BLOQUE (EJ. 07:00-08:30)</label>
            <input type="text" id="f_block" class="form-control"
                   bind:value={formulario.block_label}
                   placeholder="Ej: 07:00-08:30" required />
        </div>
    </div>
</FormModal>

<ConfirmDeleteModal 
    id="modalEliminar" 
    itemName={`la disponibilidad de ${nombreDocenteBorrar}`} 
    onDelete={eliminar} 
/>
