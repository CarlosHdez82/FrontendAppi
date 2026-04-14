<script lang="ts">
    import { onMount } from 'svelte';
    import PageHeader from "$lib/components/PageHeader.svelte";
    import DataTable from "$lib/components/DataTable.svelte";
    import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
    import TableAction from "$lib/components/TableAction.svelte";
    import FormModal from "$lib/components/FormModal.svelte";
    import ConfirmDeleteModal from "$lib/components/ConfirmDeleteModal.svelte";

    // --- ESTADOS ---
    let lista = $state([]);
    let docentes = $state([]);
    let periodos = $state([]);
    let cargando = $state(true);
    let editando = $state(false);
    let idSeleccionado = $state(null);
    let nombreDocenteBorrar = $state("");

    const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

    let formulario = $state({
        teacher_id: "", 
        period_id: "", 
        day_of_week: "Lunes",
        start_time: "07:00", 
        end_time: "12:00"
    });

    const headers = [
        { label: "Docente", class: "ps-4" },
        { label: "Día" },
        { label: "Horario (Inicio - Fin)" },
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
            const [resA, resD, resP] = await Promise.all([
                fetch("https://gestion-de-horarios-final.onrender.com/get_availabilities", { headers: getHeaders() }),
                fetch("https://gestion-de-horarios-final.onrender.com/get_teachers", { headers: getHeaders() }),
                fetch("https://gestion-de-horarios-final.onrender.com/get_periods", { headers: getHeaders() })
            ]);
            if (resA.ok) lista = await resA.json();
            if (resD.ok) docentes = await resD.json();
            if (resP.ok) periodos = await resP.json();
        } catch (e) { console.error("Error CUL Availability"); }
        finally { cargando = false; }
    }

    function prepararNuevo() {
        editando = false; idSeleccionado = null;
        formulario = { teacher_id: "", period_id: "", day_of_week: "Lunes", start_time: "07:00", end_time: "12:00" };
    }

    function prepararEdicion(item: any) {
        editando = true; idSeleccionado = item.id;
        formulario = {
            teacher_id: item.teacher_id,
            period_id: item.period_id,
            day_of_week: item.day_of_week,
            start_time: item.start_time.substring(0,5),
            end_time: item.end_time.substring(0,5)
        };
    }

    async function guardar() {
        const url = editando ? `https://gestion-de-horarios-final.onrender.com/update_availability/${idSeleccionado}` : "https://gestion-de-horarios-final.onrender.com/create_availability";
        const res = await fetch(url, {
            method: editando ? "PUT" : "POST",
            headers: getHeaders(),
            body: JSON.stringify(formulario)
        });
        if (res.ok) await cargarDatos();
    }

    async function eliminar() {
        const res = await fetch(`https://gestion-de-horarios-final.onrender.com/delete_availability/${idSeleccionado}`, {
            method: "DELETE",
            headers: getHeaders()
        });
        if (res.ok) await cargarDatos();
    }

    onMount(cargarDatos);
</script>

<PageHeader 
    title="Disponibilidad Docente" 
    subtitle="Gestión de tiempos académicos - Universidad CUL" 
    buttonText="Agregar Disponibilidad" 
    onButtonClick={prepararNuevo} 
/>

{#if cargando}
    <LoadingSpinner />
{:else}
    <DataTable {headers}>
        {#each lista as item}
            <tr>
                <td class="ps-4">
                    <div class="fw-bold text-dark">{item.teacher_name}</div>
                </td>
                <td>
                    <span class="badge bg-primary-subtle text-primary border border-primary-subtle px-3">
                        {item.day_of_week}
                    </span>
                </td>
                <td>
                    <span class="text-muted"><i class="bi bi-clock me-1"></i> {item.start_time} - {item.end_time}</span>
                </td>
                <td><small class="fw-medium text-secondary">{item.period_name}</small></td>
                <td class="text-end pe-4">
                    <TableAction 
                        itemName={`Franja de ${item.teacher_name}`}
                        onEdit={() => prepararEdicion(item)}
                        onDelete={() => { idSeleccionado = item.id; nombreDocenteBorrar = item.teacher_name; }}
                    />
                </td>
            </tr>
        {/each}
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

        <div class="col-6">
            <label for="f_start" class="form-label small fw-bold">HORA INICIO</label>
            <input type="time" id="f_start" class="form-control" bind:value={formulario.start_time} required />
        </div>
        <div class="col-6">
            <label for="f_end" class="form-label small fw-bold">HORA FIN</label>
            <input type="time" id="f_end" class="form-control" bind:value={formulario.end_time} required />
        </div>
    </div>
</FormModal>

<ConfirmDeleteModal 
    id="modalEliminar" 
    itemName={`la disponibilidad de ${nombreDocenteBorrar}`} 
    onDelete={eliminar} 
/>