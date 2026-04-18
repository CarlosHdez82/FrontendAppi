<script lang="ts">
  import { userRole, userName } from "$lib/stores/user";
  import { goto } from "$app/navigation";

  // Usamos $state para que Svelte 5 detecte los cambios en los inputs
  let email = $state("");
  let password = $state("");
  let error = $state("");

  // Recibimos el evento 'e' para manejar el preventDefault manualmente
  async function handleLogin(e: Event) {
    e.preventDefault(); 
    error = ""; // Limpiamos errores previos al intentar ingresar

    try {
      const res = await fetch("https://gestion-de-horarios-final.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Enviamos los valores capturados por los $state
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        error = "Credenciales inválidas";
        return;
      }

      const data = await res.json();

      // --- PASO 1: IMPLEMENTACIÓN DE LÓGICA JWT ---
      
      // 1. Guardamos el Token físico en el navegador
      localStorage.setItem("token", data.token);

      // 2. Guardamos el Nombre del Usuario también en localStorage para mostrarlo en la interfaz
      const fullName = `${data.first_name} ${data.last_name}`;
      localStorage.setItem("user_name", fullName);

      // 3. Guardamos el Rol también en localStorage para que persista al recargar (F5)
      localStorage.setItem("user_role", data.role_name);
      
      // 1. Actualizamos el store
      userRole.set(data.role_name);
      userName.set(fullName); 

      // 2. Redirigimos al dashboard correspondiente
      const targetPath = {
        "admi": "/admi/dashboard",
        "faculty": "/faculty/dashboard",
        "teacher": "/teacher/dashboard",
        "student": "/student/dashboard"
      }[data.role_name];

      if (targetPath) {
        await goto(targetPath, { invalidateAll: true }); 
        // 'invalidateAll' fuerza a SvelteKit a volver a cargar los datos de la nueva ruta
      } else {
        error = "Rol no reconocido: " + data.role_name;
      }
    } catch (err) {
      error = "Error de conexión con el servidor";
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
      alt="Logo"
      width="100"
      height="40"
    />
    <h3 class="h3 mb-3 fw-normal text-center">Sistema de Gestión de Horarios</h3>
    <h6 class="h6 mb-3 fw-normal text-center">Corporación Universitaria Latinoamericana</h6>

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

    <div class="form-check text-start my-3">
      <input
        class="form-check-input"
        type="checkbox"
        id="checkDefault"
      />
      <label class="form-check-label" for="checkDefault">
        Recordarme
      </label>
    </div>

    <button class="btn btn-primary w-100 py-2" type="submit">
      Ingresar
    </button>

    {#if error}
      <div class="alert alert-danger mt-3">{error}</div>
    {/if}

    <p class="mt-5 mb-3 text-body-secondary text-center">&copy; 2026</p>
  </form>
</main>