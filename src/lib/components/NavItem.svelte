<script lang="ts">
    let { item } = $props();
</script>

<!-- [source: 11] Ajuste en NavItem.svelte -->
<li class="nav-item w-100">
    <a class="nav-link text-white d-flex align-items-center py-3 ps-3" href={item.href}>
        <i class={item.icon + " me-3 fs-5"}></i>
        <span class="fw-medium">{item.label}</span>
    </a>
</li>