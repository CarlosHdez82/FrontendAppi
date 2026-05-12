<script lang="ts">
    import { onMount } from 'svelte';
    import { userName, userRole } from '$lib/stores/user';

    const API = "https://gestion-de-horarios-1.onrender.com";

    const roleLabels: Record<string, string> = {
        "admi": "Administrador", "faculty": "Coordinador", "teacher": "Docente"
    };

    let name = $derived($userName);
    let role = $derived($userRole);
    let roleLabel = $derived(role ? (roleLabels[role] || role) : '');

    // --- Estado del formulario ---
    let currentPassword = $state('');
    let newPassword = $state('');
    let confirmPassword = $state('');
    let guardando = $state(false);
    let mensaje = $state<{ tipo: string; texto: string } | null>(null);
    let showCurrent = $state(false);
    let showNew = $state(false);
    let showConfirm = $state(false);

    // Validaciones reactivas
    let minLength = $derived(newPassword.length >= 8);
    let hasUpper = $derived(/[A-Z]/.test(newPassword));
    let hasNumber = $derived(/[0-9]/.test(newPassword));
    let passwordsMatch = $derived(newPassword === confirmPassword && confirmPassword !== '');
    let formValid = $derived(
        currentPassword.length > 0 && minLength && hasUpper && hasNumber && passwordsMatch
    );

    async function cambiarContrasena() {
        if (!formValid) return;
        guardando = true;
        mensaje = null;
        const userId = localStorage.getItem('user_id');
        try {
            const res = await fetch(`${API}/users/change-password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    user_id: Number(userId),
                    current_password: currentPassword,
                    new_password: newPassword
                })
            });
            const data = await res.json();
            if (res.ok) {
                mensaje = { tipo: 'success', texto: '✅ Contraseña actualizada correctamente.' };
                currentPassword = '';
                newPassword = '';
                confirmPassword = '';
            } else {
                mensaje = { tipo: 'danger', texto: data.detail || 'Error al cambiar la contraseña.' };
            }
        } catch (e) {
            mensaje = { tipo: 'danger', texto: 'Error de conexión. Intenta nuevamente.' };
        } finally {
            guardando = false;
        }
    }
</script>

<div class="container py-4" style="max-width: 640px;">

    <!-- Tarjeta de perfil -->
    <div class="card border-0 shadow-sm mb-4">
        <div class="card-body p-4">
            <div class="d-flex align-items-center gap-4">
                <div class="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold fs-3 shadow"
                     style="width: 72px; height: 72px; background-color: #222F56; flex-shrink: 0;">
                    {(name ?? 'U')[0].toUpperCase()}
                </div>
                <div>
                    <h5 class="fw-bold mb-1">{name ?? 'Usuario'}</h5>
                    <span class="badge px-3 py-2" style="background-color: #F3B105; color: #222;">
                        <i class="bi bi-shield-check me-1"></i>{roleLabel}
                    </span>
                </div>
            </div>
        </div>
    </div>

    <!-- Formulario cambio de contraseña -->
    <div class="card border-0 shadow-sm">
        <div class="card-header bg-white border-0 pt-4 pb-0 px-4">
            <h5 class="fw-bold mb-0">
                <i class="bi bi-lock me-2" style="color: #222F56;"></i>Cambiar Contraseña
            </h5>
            <p class="text-muted small mt-1 mb-0">
                Usa una contraseña segura que no hayas usado antes.
            </p>
        </div>
        <div class="card-body p-4">

            {#if mensaje}
                <div class="alert alert-{mensaje.tipo} border-0 shadow-sm py-2 mb-4">
                    {mensaje.texto}
                </div>
            {/if}

            <div class="row g-3">
                <!-- Contraseña actual -->
                <div class="col-12">
                    <label class="form-label small fw-bold text-muted">CONTRASEÑA ACTUAL</label>
                    <div class="input-group">
                        <input
                            type={showCurrent ? 'text' : 'password'}
                            class="form-control"
                            placeholder="Ingresa tu contraseña actual"
                            bind:value={currentPassword}
                        />
                        <button class="btn btn-outline-secondary" type="button"
                                onclick={() => showCurrent = !showCurrent}>
                            <i class="bi bi-eye{showCurrent ? '-slash' : ''}"></i>
                        </button>
                    </div>
                </div>

                <!-- Nueva contraseña -->
                <div class="col-12">
                    <label class="form-label small fw-bold text-muted">NUEVA CONTRASEÑA</label>
                    <div class="input-group">
                        <input
                            type={showNew ? 'text' : 'password'}
                            class="form-control"
                            placeholder="Mínimo 8 caracteres"
                            bind:value={newPassword}
                        />
                        <button class="btn btn-outline-secondary" type="button"
                                onclick={() => showNew = !showNew}>
                            <i class="bi bi-eye{showNew ? '-slash' : ''}"></i>
                        </button>
                    </div>
                    <!-- Indicadores de seguridad -->
                    {#if newPassword.length > 0}
                        <div class="mt-2 d-flex flex-wrap gap-2">
                            <span class="badge {minLength ? 'bg-success' : 'bg-light text-muted border'}">
                                <i class="bi bi-{minLength ? 'check' : 'x'} me-1"></i>8 caracteres
                            </span>
                            <span class="badge {hasUpper ? 'bg-success' : 'bg-light text-muted border'}">
                                <i class="bi bi-{hasUpper ? 'check' : 'x'} me-1"></i>Mayúscula
                            </span>
                            <span class="badge {hasNumber ? 'bg-success' : 'bg-light text-muted border'}">
                                <i class="bi bi-{hasNumber ? 'check' : 'x'} me-1"></i>Número
                            </span>
                        </div>
                    {/if}
                </div>

                <!-- Confirmar nueva contraseña -->
                <div class="col-12">
                    <label class="form-label small fw-bold text-muted">CONFIRMAR NUEVA CONTRASEÑA</label>
                    <div class="input-group">
                        <input
                            type={showConfirm ? 'text' : 'password'}
                            class="form-control"
                            class:is-valid={passwordsMatch}
                            class:is-invalid={confirmPassword.length > 0 && !passwordsMatch}
                            placeholder="Repite la nueva contraseña"
                            bind:value={confirmPassword}
                        />
                        <button class="btn btn-outline-secondary" type="button"
                                onclick={() => showConfirm = !showConfirm}>
                            <i class="bi bi-eye{showConfirm ? '-slash' : ''}"></i>
                        </button>
                    </div>
                    {#if confirmPassword.length > 0 && !passwordsMatch}
                        <div class="invalid-feedback d-block small">Las contraseñas no coinciden</div>
                    {/if}
                </div>

                <!-- Botón -->
                <div class="col-12 mt-2">
                    <button
                        class="btn w-100 text-white fw-bold py-2"
                        style="background-color: #222F56;"
                        onclick={cambiarContrasena}
                        disabled={!formValid || guardando}
                    >
                        {#if guardando}
                            <span class="spinner-border spinner-border-sm me-2"></span>Guardando...
                        {:else}
                            <i class="bi bi-shield-lock me-2"></i>Actualizar Contraseña
                        {/if}
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
