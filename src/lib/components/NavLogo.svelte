<script lang="ts">
    let { width = 100, height = 40, className = "d-block mx-auto mb-1" } = $props();
</script>

<div class="nav-logo mb-2">
    <img src="/logo.png" alt="Logo CUL" {width} {height} class={className} />
</div>