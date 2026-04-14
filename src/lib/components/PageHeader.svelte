<script lang="ts">
    let { title, subtitle, buttonText, onButtonClick } = $props();
</script>

<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h2 class="fw-bold mb-0">{title}</h2>
        <span class="text-muted">{subtitle}</span>
    </div>
    {#if buttonText}
        <button 
            class="btn btn-primary shadow-sm"
            data-bs-toggle="modal" 
            data-bs-target="#modalPrincipal"
            onclick={onButtonClick}
        >
            <i class="bi bi-plus-circle-fill me-2"></i>{buttonText}
        </button>
    {/if}
</div>