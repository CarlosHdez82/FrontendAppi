<script lang="ts">
  import { userRole, userName, userId } from "$lib/stores/user";
  import { goto } from "$app/navigation";

  // Usamos $state de Svelte 5 para reactividad
  let email = $state("");
  let password = $state("");
  let error = $state("");

  // Mapa de roles: cubre el nombre exacto que devuelve la BD
  const routes: Record<string, string> = {
    // Administrador
    "admi": "/admi/dashboard",
    "admin": "/admi/dashboard",
    "Admi": "/admi/dashboard",
    "Admin": "/admi/dashboard",
    "Administrador": "/admi/dashboard",
    "administrador": "/admi/dashboard",
    // Coordinador / Faculty
    "faculty": "/faculty/dashboard",
    "Faculty": "/faculty/dashboard",
    "Decano": "/faculty/dashboard",
    "decano": "/faculty/dashboard",
    "Coordinador": "/faculty/dashboard",
    "coordinador": "/faculty/dashboard",
    // Docente / Teacher
    "teacher": "/teacher/dashboard",
    "Teacher": "/teacher/dashboard",
    "Docente": "/teacher/dashboard",
    "docente": "/teacher/dashboard",
  };

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
        // Si el controlador lanza 401, entra aquí
        error = "Correo o contraseña incorrectos";
        return;
      }

      const data = await res.json();

      // --- SINCRONIZACIÓN CON TU CONTROLADOR DE PYTHON ---
      
      // 1. Guardar el Token JWT
      localStorage.setItem("token", data.token);

      // Guardar Nombre Completo
      localStorage.setItem("user_name", data.full_name);
      userName.set(data.full_name); 

      // Guardar el Rol
      localStorage.setItem("user_role", data.role);
      userRole.set(data.role);

      // Guardar el ID del usuario
      localStorage.setItem("user_id", String(data.id));
      userId.set(String(data.id));
      
      // 4. Redirección basada en el mapa de rutas
      const targetPath = routes[data.role];

      if (targetPath) {
        await goto(targetPath, { invalidateAll: true }); 
      } else {
        // Este mensaje te dirá qué nombre exacto está devolviendo Neon
        error = "Rol no configurado en frontend: " + data.role;
      }

    } catch (err) {
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
    <img
      class="d-block mx-auto mb-1"
      src="/logo.png"
      alt="Logo CUL"
      width="100"
      height="40"
    />
    <h3 class="h3 mb-3 fw-normal text-center">Gestión de Horarios</h3>
    <h6 class="h6 mb-4 fw-normal text-center text-secondary">Acceso Institucional CUL</h6>

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

    {#if error}
      <div class="alert alert-danger mt-3 py-2 text-center" role="alert">
        <small>{error}</small>
      </div>
    {/if}

    <p class="mt-5 mb-3 text-body-secondary text-center">&copy; 2026 CUL - Barranquilla</p>
  </form>
</main>

<style>
  /* Opcional: Estilos para que el login se vea más limpio */
  .form-signin .form-control:focus {
    z-index: 2;
  }
</style>