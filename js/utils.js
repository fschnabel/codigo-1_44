function obtenerPrecio(pelicula) {
      if (esEstreno(pelicula)){
        return formatearPrecio(pelicula.precios.estreno);
      } else {
        return formatearPrecio(pelicula.precios.normal);
      }
}

function esEstreno(pelicula){
    const fechaEstreno = new Date(pelicula.estreno);
    const fechaActual = new Date();

    fechaEstreno.setUTCHours(0, 0, 0, 0);
    fechaActual.setUTCHours(0, 0, 0, 0);

    return fechaEstreno.getTime() >= fechaActual.getTime();
}

function mensajeBadge(pelicula){
    if (esEstreno(pelicula)){
        return `Película en estreno. Precio: $${pelicula.precios.estreno}`;
    } else {
        return `Cartelera regular. Precio: $${pelicula.precios.normal}`;
    }
}

function formatearPrecio(precio){
    return new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(precio);
}

function getEstrellas(valor) {
      const v = Math.max(0, Math.min(5, Math.round(Number(valor) || 0)));
      return "★".repeat(v) + "☆".repeat(5 - v);
};

function getRutasBarraNavegacion(path){

    if (path === "/index.html"){
        document.getElementById("navInicio").href  = "index.html";
        document.getElementById("navContacto").href= "pages/contacto.html";
        document.getElementById("navRenta").href   = "pages/renta.html";
        document.getElementById("brandIcon").src   = "img/icon.png";
    } else {
        document.getElementById("navInicio").href  = "../index.html";
        document.getElementById("navContacto").href= "contacto.html";
        document.getElementById("navRenta").href   = "renta.html";
        document.getElementById("brandIcon").src   = "../img/icon.png";

    }

    document.querySelectorAll(".nav-link").forEach(link => link.classList.remove("active"));

    if (path.endsWith("index.html") || path === "/" || path.endsWith("/CinePlus/")) {
      document.getElementById("navInicio").classList.add("active");
    } else if (path.endsWith("contacto.html")) {
      document.getElementById("navContacto").classList.add("active");
    } else if (path.endsWith("renta.html")) {
      document.getElementById("navRenta").classList.add("active");
    }

}
