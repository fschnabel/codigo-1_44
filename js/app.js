$(document).ready(function () { 
  const $contenedor = $("#lista-peliculas");
  $("#navigation-bar").load("../pages/navBar.html", function(){
      getRutasBarraNavegacion(window.location.pathname);
  });
  $("#header-placeholder").load("../pages/header.html");
  $("#footer-placeholder").load("../pages/footer.html");

  // Fallbacks por si no existen en utils.js
  window.obtenerPrecio = window.obtenerPrecio || function (peli) {
    const n = Number(peli?.precios?.estreno ?? peli?.precios?.normal ?? 0);
    return n ? `$${n.toFixed(2)}` : "—";
  };

  // Convierte watch?v= en embed/ y agrega autoplay para YouTube
  function toEmbed(url) {
    if (!url) return "";
    try {
      const u = new URL(url, location.href);
      const host = u.hostname;
      // youtube.com
      if (host.includes("youtube.com")) {
        if (u.pathname === "/watch" && u.searchParams.get("v")) {
          return `https://www.youtube.com/embed/${u.searchParams.get("v")}?autoplay=1`;
        }
        if (u.pathname.startsWith("/embed/")) {
          return `${u.href}${u.search ? "&" : "?"}autoplay=1`;
        }
      }
      // youtu.be corto
      if (host === "youtu.be") {
        const id = u.pathname.replace("/", "");
        return `https://www.youtube.com/embed/${id}?autoplay=1`;
      }
      return url;
    } catch {
      return url;
    }
  }

  // Spinner de carga (Bootstrap)
  const spinnerHTML = `
    <div class="col-12">
      <div class="d-flex flex-column align-items-center py-5">
        <div class="spinner-border text-primary" role="status" aria-live="polite"></div>
        <div class="mt-3 text-muted">Cargando películas...</div>
      </div>
    </div>
  `;
  $contenedor.html(spinnerHTML);

  // Petición AJAX con retraso artificial
  $.ajax({
    url: "data/peliculas.json",
    method: "GET",
    dataType: "json",
    success: function (peliculas) {
      setTimeout(function () {
        let html = "";
        peliculas.forEach(function (peli) {
          const generosTxt = Array.isArray(peli.generos)
            ? peli.generos.join(" · ")
            : (peli.generos || "Sin género");

          const imgSrc = /^https?:\/\//i.test(peli.imagen)
            ? peli.imagen
            : `img/${peli.imagen}`;

          html += `
            <div class="col-md-4 mb-4 movie-card" style="display:none;">
              <div class="card h-100 shadow">
                <img src="${imgSrc}" class="card-img-top" alt="${peli.titulo}">
                <div class="card-body d-flex flex-column">
                  <h5 class="card-title">${peli.titulo}</h5>
                  <p class="card-text text-muted">${generosTxt}</p>
                  <p class="card-text">${obtenerPrecio(peli)}</p>
                  <div class="mt-auto d-grid gap-2">
                    <a href="pages/detalle.html?id=${peli.id}" class="btn btn-see-more">Ver más</a>
                    <button type="button"
                            class="btn btn-watch-trailer btn-trailer"
                            data-trailer-url="${peli.trailer || ''}"
                            data-titulo="${peli.titulo.replace(/"/g, '&quot;')}">
                      Ver tráiler
                    </button>
                  </div>
                </div>
              </div>
            </div>`;
        });

        $contenedor.html(html);
        $(".movie-card").each(function (i) {
          $(this).delay(i * 150).fadeIn(600); 
        });
      }, 5000); 
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

  // Delegación: abrir modal al click en "Ver tráiler"
  $(document).on("click", ".btn-trailer", function () {
    const url = $(this).data("trailer-url");
    const titulo = $(this).data("titulo") || "Tráiler";
    const src = toEmbed(url);

    $("#trailerLabel").text(titulo);
    $("#trailerPlayer").attr("src", src);

    const modalEl = document.getElementById("trailerModal");
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();

    function onHide() {
      $("#trailerPlayer").attr("src", "");
      modalEl.removeEventListener("hidden.bs.modal", onHide);
    }
    modalEl.addEventListener("hidden.bs.modal", onHide);
  });

  // Alerta de bienvenida solo una vez
  if (!localStorage.getItem("bienvenidaMostrada")) {
    const alerta = `
      <div class="alert alert-success alert-dismissible fade show text-center" role="alert" 
           style="position: fixed; top: 10px; left: 50%; transform: translateX(-50%); z-index: 2000; width: 90%; max-width: 500px;">
        🎬 <strong>¡Bienvenido a CinePlus!</strong> Disfruta explorando los estrenos y tus películas favoritas.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
      </div>
    `;
    $("body").append(alerta);
    localStorage.setItem("bienvenidaMostrada", "true");
  }
});
