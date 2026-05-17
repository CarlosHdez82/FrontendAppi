<script lang="ts">
    // ============================================================
    // (auth)/+page.svelte — Página de Login
    // ============================================================
    // Página principal de acceso al sistema. Permite a los usuarios
    // autenticarse con email y contraseña contra la API de Render.
    //
    // Flujo de autenticación:
    // 1. El usuario ingresa email y contraseña
    // 2. Se hace POST a /users/login en la API
    // 3. Si es exitoso, se guardan token, nombre, rol e ID
    //    tanto en los stores de Svelte como en localStorage
    // 4. Se redirige al dashboard según el rol del usuario
    // 5. Si falla, se muestra el mensaje de error correspondiente
    // ============================================================
    import { userRole, userName, userId } from "$lib/stores/user";
    import { goto } from "$app/navigation";

    let email = $state("");
    let password = $state("");
    let error = $state("");

    // ------------------------------------------------------------
    // Mapa de redirección por rol
    // Cubre todas las variantes posibles que puede retornar la BD
    // para evitar que un nombre inesperado bloquee el acceso.
    // ------------------------------------------------------------
    const routes: Record<string, string> = {
        // Administrador
        "admi": "/admi/dashboard", "admin": "/admi/dashboard",
        "Admi": "/admi/dashboard", "Admin": "/admi/dashboard",
        "Administrador": "/admi/dashboard", "administrador": "/admi/dashboard",
        // Coordinador
        "faculty": "/faculty/dashboard", "Faculty": "/faculty/dashboard",
        "Decano": "/faculty/dashboard", "decano": "/faculty/dashboard",
        "Coordinador": "/faculty/dashboard", "coordinador": "/faculty/dashboard",
        // Docente
        "teacher": "/teacher/dashboard", "Teacher": "/teacher/dashboard",
        "Docente": "/teacher/dashboard", "docente": "/teacher/dashboard",
    };

    // ------------------------------------------------------------
    // Maneja el envío del formulario de login
    // e.preventDefault() evita el comportamiento nativo del form
    // ------------------------------------------------------------
    async function handleLogin(e: Event) {
        e.preventDefault();
        error = "";

        try {
            const res = await fetch("https://gestion-de-horarios-1.onrender.com/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            if (!res.ok) {
                // Error 401: credenciales incorrectas
                error = "Correo o contraseña incorrectos";
                return;
            }

            const data = await res.json();

            // ----------------------------------------------------
            // Guardar datos de sesión en stores y localStorage
            // Los stores actualizan la UI reactivamente,
            // localStorage persiste la sesión entre recargas.
            // ----------------------------------------------------
            localStorage.setItem("token", data.token);

            localStorage.setItem("user_name", data.full_name);
            userName.set(data.full_name);

            localStorage.setItem("user_role", data.role);
            userRole.set(data.role);

            localStorage.setItem("user_id", String(data.id));
            userId.set(String(data.id));

            // Redirigir al dashboard del rol correspondiente
            const targetPath = routes[data.role];
            if (targetPath) {
                await goto(targetPath, { invalidateAll: true });
            } else {
                // Si el rol no está en el mapa, muestra el valor exacto
                // que retornó la BD para facilitar el diagnóstico
                error = "Rol no configurado en frontend: " + data.role;
            }

        } catch (err) {
            // Error de red: Render dormido o sin conexión
            error = "No se pudo conectar con el servidor de Render. Revisa tu conexión.";
        }
    }
</script>

<main class="d-flex align-items-center justify-content-center vh-100 bg-body-tertiary">
    <form
        class="form-signin w-100 bg-white p-4 rounded shadow"
        style="max-width: 360px;"
        onsubmit={handleLogin}
    >
        <img class="d-block mx-auto mb-1" src="/logo.png" alt="Logo CUL" width="100" height="40" />
        <h3 class="h3 mb-3 fw-normal text-center">Gestión de Horarios</h3>
        <h6 class="h6 mb-4 fw-normal text-center text-secondary">Acceso Institucional CUL</h6>

        <!-- Campo email con etiqueta flotante de Bootstrap -->
        <div class="form-floating mb-3">
            <input
                type="email"
                class="form-control"
                id="floatingInput"
                placeholder="name@example.com"
                bind:value={email}
                required
            />
            <label for="floatingInput">Correo electrónico</label>
        </div>

        <!-- Campo contraseña con etiqueta flotante de Bootstrap -->
        <div class="form-floating mb-3">
            <input
                type="password"
                class="form-control"
                id="floatingPassword"
                placeholder="Password"
                bind:value={password}
                required
            />
            <label for="floatingPassword">Contraseña</label>
        </div>

        <button class="btn btn-primary w-100 py-2 mt-2" type="submit">
            Ingresar al Sistema
        </button>

        <!-- Mensaje de error: visible solo cuando error tiene contenido -->
        {#if error}
            <div class="alert alert-danger mt-3 py-2 text-center" role="alert">
                <small>{error}</small>
            </div>
        {/if}

        <p class="mt-5 mb-3 text-body-secondary text-center">&copy; 2026 CUL - Barranquilla</p>
    </form>
</main>

<style>
    /* Evita que el borde del input se superponga al label flotante */
    .form-signin .form-control:focus {
        z-index: 2;
    }
</style>