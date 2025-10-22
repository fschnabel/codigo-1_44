$(document).ready(function () {
  const $contenedor = $("#lista-peliculas");

  // Spinner de carga (Bootstrap)
  const spinnerHTML = `
    <div class="col-12">
      <div class="d-flex flex-column align-items-center py-5">
        <div class="spinner-border text-primary" role="status" aria-live="polite"></div>
        <div class="mt-3 text-muted">Cargando películas...</div>
      </div>
    </div>
  `;

  // Mostrar spinner mientras carga
  $contenedor.html(spinnerHTML);

  // 🔹 Petición AJAX con retraso artificial
  $.ajax({
    url: "data/peliculas.json",
    method: "GET",
    dataType: "json",
    success: function (peliculas) {
      // Simular un retraso de 5 segundos antes de mostrar los resultados
      setTimeout(function () {
        let html = "";
        peliculas.forEach(function (peli) {
          const generosTxt = Array.isArray(peli.generos)
            ? peli.generos.join(" · ")
            : peli.generos || "Sin género";

          const imgSrc = /^https?:\/\//i.test(peli.imagen)
            ? peli.imagen
            : `img/${peli.imagen}`;

          html += `
            <div class="col-md-4 mb-4">
              <div class="card h-100 shadow">
                <img src="${imgSrc}" class="card-img-top" alt="${peli.titulo}">
                <div class="card-body d-flex flex-column">
                  <h5 class="card-title">${peli.titulo}</h5>
                  <p class="card-text text-muted">${generosTxt}</p>
                  <p class="card-text">${obtenerPrecio(peli)}</p>
                  <a href="pages/detalle.html?id=${peli.id}" class="btn btn-primary mt-auto">Ver más</a>
                </div>
              </div>
            </div>`;
        });
        $contenedor.html(html);
      }, 5000); // ⏳ retraso de 5 segundos
    },
    error: function (xhr, status, error) {
      console.error("Error al cargar las películas:", error);
      $contenedor.html(`
        <div class="col-12">
          <div class="alert alert-danger text-center" role="alert">
            No se pudo cargar la lista de películas. Intenta nuevamente más tarde.
          </div>
        </div>
      `);
    }
  });
});
