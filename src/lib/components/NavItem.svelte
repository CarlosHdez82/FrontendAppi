<script lang="ts">
    let { item } = $props();
</script>

<li class="nav-item d-flex align-items-center">
    <i class={item.icon + " me-2"}></i>
    <a class="nav-link text-white p-0" href={item.href}>{item.label}</a>
</li>