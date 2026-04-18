<script lang="ts">
    let { headers, children } = $props();
</script>

<div class="card border-0 shadow-sm overflow-hidden mt-3">
    <div class="table-responsive">
        <table class="table table-hover align-middle mb-0" style="min-width: 600px;">
            <thead class="bg-light">
                <tr>
                    {#each headers as header}
                        <th class={header.class || ""}>{header.label}</th>
                    {/each}
                </tr>
            </thead>
            <tbody>
                {#if children}
                    {@render children()}
                {/if}
            </tbody>
        </table>
    </div>
</div>

<style>
    thead th { 
        font-size: 0.8rem; 
        text-transform: uppercase; 
        letter-spacing: 0.5px;
        padding: 0.75rem 1rem;
    }
</style>