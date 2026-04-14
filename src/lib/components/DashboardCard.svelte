<script lang="ts">
    let { title, value, icon, color, link, linkText } = $props();
</script>

<div class="col-12 col-md-6 col-lg-3">
    <div class="card border-0 shadow-sm border-start border-{color} border-4 h-100">
        <div class="card-body d-flex justify-content-between align-items-center">
            <div>
                <h6 class="text-muted text-uppercase small fw-bold">{title}</h6>
                <h2 class="fw-bold mb-0">{value}</h2>
                <a href={link} class="btn btn-sm btn-link p-0 mt-2 text-decoration-none text-{color}">
                    {linkText} →
                </a>
            </div>
            <i class="bi {icon} text-{color} fs-1 opacity-50"></i>
        </div>
    </div>
</div>