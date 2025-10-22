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