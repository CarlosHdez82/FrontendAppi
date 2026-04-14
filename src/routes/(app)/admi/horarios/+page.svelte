<script lang="ts">
    import { onMount } from 'svelte';
    import PageHeader from "$lib/components/PageHeader.svelte";
    import DataTable from "$lib/components/DataTable.svelte";
    import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
    import TableAction from "$lib/components/TableAction.svelte";
    import FormModal from "$lib/components/FormModal.svelte";
    import ConfirmDeleteModal from "$lib/components/ConfirmDeleteModal.svelte";

    // --- ESTADOS ---
    let horarios = $state([]);
    let docentes = $state([]);
    let materias = $state([]);
    let periodos = $state([]);
    let cargando = $state(true);
    let editando = $state(false);
    let idSeleccionado = $state(null);
    let itemAEliminar = $state("");

    const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

    let formulario = $state({
        teacher_id: "",
        subject_id: "",
        period_id: "",
        day_of_week: "",
        start_time: "07:00",
        end_time: "09:00",
        is_active: true
    });

    const headers = [
        { label: "Horario", class: "ps-4" },
        { label: "Docente" },
        { label: "Materia" },
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
            const [rH, rD, rM, rP] = await Promise.all([
                fetch("https://gestion-de-horarios-final.onrender.com/get_schedules", { headers: getHeaders() }),
                fetch("https://gestion-de-horarios-final.onrender.com/get_teachers", { headers: getHeaders() }),
                fetch("https://gestion-de-horarios-final.onrender.com/get_subjects", { headers: getHeaders() }),
                fetch("https://gestion-de-horarios-final.onrender.com/get_periods", { headers: getHeaders() })
            ]);
            if (rH.ok) horarios = await rH.json();
            if (rD.ok) docentes = await rD.json();
            if (rM.ok) materias = await rM.json();
            if (rP.ok) periodos = await rP.json();
        } catch (e) {
            console.error("Error de conexión CUL");
        } finally {
            cargando = false;
        }
    }

    function prepararNuevo() {
        editando = false;
        idSeleccionado = null;
        formulario = {
            teacher_id: "", subject_id: "", period_id: "",
            day_of_week: "", start_time: "07:00", end_time: "09:00",
            is_active: true
        };
    }

    function prepararEdicion(h: any) {
        editando = true;
        idSeleccionado = h.id;
        formulario = { 
            ...h,
            // Limpieza de segundos para compatibilidad con input type="time"
            start_time: h.start_time.substring(0,5),
            end_time: h.end_time.substring(0,5)
        };
    }

    async function guardar() {
        const url = editando 
            ? `https://gestion-de-horarios-final.onrender.com/update_schedule/${idSeleccionado}` 
            : "https://gestion-de-horarios-final.onrender.com/create_schedule";
        
        const res = await fetch(url, {
            method: editando ? "PUT" : "POST",
            headers: getHeaders(),
            body: JSON.stringify(formulario)
        });

        if (res.ok) await cargarDatos();
    }

    async function eliminar() {
        const res = await fetch(`https://gestion-de-horarios-final.onrender.com/delete_schedule/${idSeleccionado}`, {
            method: "DELETE",
            headers: getHeaders()
        });
        if (res.ok) await cargarDatos();
    }

    onMount(cargarDatos);
</script>

<PageHeader 
    title="Horarios Docentes" 
    subtitle="Sistema de Gestión - Universidad CUL" 
    buttonText="Nuevo Horario" 
    onButtonClick={prepararNuevo} 
/>

{#if cargando}
    <LoadingSpinner />
{:else}
    <DataTable {headers}>
        {#each horarios as h}
            <tr>
                <td class="ps-4">
                    <span class="fw-bold d-block">{h.day_of_week}</span>
                    <span class="badge bg-light text-primary border">{h.start_time} - {h.end_time}</span>
                </td>
                <td class="fw-medium text-secondary">{h.teacher_name}</td>
                <td class="fw-semibold text-dark">{h.subject_name}</td>
                <td class="text-muted small">{h.period_name}</td>
                <td class="text-end pe-4">
                    <TableAction 
                        itemName={`Horario de ${h.subject_name}`}
                        onEdit={() => prepararEdicion(h)}
                        onDelete={() => { idSeleccionado = h.id; itemAEliminar = `${h.subject_name} (${h.teacher_name})`; }}
                    />
                </td>
            </tr>
        {/each}
    </DataTable>
{/if}

<FormModal id="modalPrincipal" title="Horario" isEdit={editando} onSave={guardar}>
    <div class="row g-3 text-start">
        <div class="col-12">
            <label for="teacher_id" class="form-label small fw-bold text-muted">DOCENTE</label>
            <select id="teacher_id" class="form-select" bind:value={formulario.teacher_id} required>
                <option value="" disabled>Seleccione un docente...</option>
                {#each docentes as d}
                    <option value={d.id}>{d.first_name} {d.last_name}</option>
                {/each}
            </select>
        </div>

        <div class="col-md-6">
            <label for="subject_id" class="form-label small fw-bold text-muted">ASIGNATURA</label>
            <select id="subject_id" class="form-select" bind:value={formulario.subject_id} required>
                <option value="" disabled>Seleccione materia...</option>
                {#each materias as m}
                    <option value={m.id}>{m.name}</option>
                {/each}
            </select>
        </div>

        <div class="col-md-6">
            <label for="period_id" class="form-label small fw-bold text-muted">PERIODO</label>
            <select id="period_id" class="form-select" bind:value={formulario.period_id} required>
                <option value="" disabled>Seleccione periodo...</option>
                {#each periodos as p}
                    <option value={p.id}>{p.name}</option>
                {/each}
            </select>
        </div>

        <div class="col-md-4">
            <label for="day_of_week" class="form-label small fw-bold text-muted">DÍA</label>
            <select id="day_of_week" class="form-select" bind:value={formulario.day_of_week} required>
                <option value="" disabled>Seleccione día...</option>
                {#each diasSemana as dia}
                    <option value={dia}>{dia}</option>
                {/each}
            </select>
        </div>

        <div class="col-md-4">
            <label for="start_time" class="form-label small fw-bold text-muted">HORA INICIO</label>
            <input type="time" id="start_time" class="form-control" bind:value={formulario.start_time} required>
        </div>

        <div class="col-md-4">
            <label for="end_time" class="form-label small fw-bold text-muted">HORA FIN</label>
            <input type="time" id="end_time" class="form-control" bind:value={formulario.end_time} required>
        </div>
    </div>
</FormModal>

<ConfirmDeleteModal 
    id="modalEliminar" 
    itemName={`el horario de ${itemAEliminar}`} 
    onDelete={eliminar} 
/>