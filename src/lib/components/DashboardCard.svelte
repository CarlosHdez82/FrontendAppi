<script lang="ts">
    // ============================================================
    // DashboardCard.svelte — Tarjeta de métrica del Dashboard
    // ============================================================
    // Muestra una estadística con título, valor numérico, ícono
    // y enlace de acceso rápido al módulo correspondiente.
    // El color se aplica a través de las clases utilitarias de
    // Bootstrap (ej: "primary", "success", "warning").
    // ============================================================
    // colClass: clases Bootstrap de columna. El padre define cuántas tarjetas caben por fila
    // según el número total de tarjetas del rol. Por defecto: 2 por fila en md, 4 en lg.
    let { title, value, icon, color, link, linkText, colClass = 'col-12 col-sm-6 col-lg-3' } = $props();
</script>

<div class="{colClass}">
    <!-- border-start con color dinámico como indicador visual -->
    <div class="card border-0 shadow-sm border-start border-{color} border-4 h-100">
        <div class="card-body d-flex justify-content-between align-items-center">
            <div>
                <h6 class="text-muted text-uppercase small fw-bold">{title}</h6>
                <h2 class="fw-bold mb-0">{value}</h2> <!-- Valor numérico destacado -->
                <!-- Enlace de acceso rápido al módulo -->
                <a href={link} class="btn btn-sm btn-link p-0 mt-2 text-decoration-none text-{color}">
                    {linkText} →
                </a>
            </div>
            <!-- Ícono decorativo con opacidad reducida -->
            <i class="bi {icon} text-{color} fs-1 opacity-50"></i>
        </div>
    </div>
</div>