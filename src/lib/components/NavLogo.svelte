<script lang="ts">
    let { width = 100, height = 40, className = "d-block mx-auto mb-1" } = $props();
</script>

<a href="/" aria-label="Ir al inicio de Universidad CUL">
    <img src="/logo.png" alt="Logo CUL" {width} {height} class={className} />
</a>