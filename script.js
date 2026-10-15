const numeroWhatsApp = "51927995288";
let carrito = [];
if (!location.hash) location.hash = "inicio";
/* BUSCADOR */
const buscar = document.getElementById("buscar-producto");
const productos = document.querySelectorAll(".producto[data-nombre]");
function buscarProductos() {
 let encontrados = 0;
 productos.forEach(p => {
  p.classList.toggle(
   "oculto",
   !p.dataset.nombre.toLowerCase().includes(
    buscar.value.toLowerCase().trim()
   )
  );
  if (!p.classList.contains("oculto")) encontrados++;
 });
 document.getElementById("mensaje-busqueda").textContent =
  encontrados ? "" : "No se encontraron productos.";
}
document.getElementById("boton-buscar").onclick = buscarProductos;
buscar.addEventListener("input", buscarProductos);
const lista = document.getElementById("lista-carrito");
const total = document.getElementById("total-carrito");
const aviso = document.getElementById("mensaje-carrito");
function actualizar() {
 lista.innerHTML = "";
 let suma = 0;
 carrito.forEach((p, i) => {
  suma += p.precio * p.cantidad;
  lista.innerHTML += `
   <div class="carrito-item">
    <strong>${p.nombre}</strong>
    <p>S/ ${p.precio.toFixed(2)} por unidad</p>
    <p>Subtotal: S/ ${(p.precio * p.cantidad).toFixed(2)}</p>
    <div class="controles-carrito">
     <button data-accion="menos" data-i="${i}">-</button>
     <span>${p.cantidad}</span>
     <button data-accion="mas" data-i="${i}">+</button>
     <button class="boton-quitar" data-accion="quitar" data-i="${i}">
      Quitar
     </button>
    </div>
   </div>`;
 });
 if (!carrito.length) {
  lista.innerHTML =
   '<p class="carrito-vacio">Agrega productos desde la tienda.</p>';
 }
 total.textContent = "S/ " + suma.toFixed(2);
}










































































































































































































































































document.addEventListener("click", e => {
 const b = e.target.closest(".agregar");
 if (!b) return;
 let p = carrito.find(x => x.nombre === b.dataset.nombre);
 if (p) {
  p.cantidad++;
 } else {
  carrito.push({
   nombre: b.dataset.nombre,
   precio: Number(b.dataset.precio),
   cantidad: 1
  });
 }
 actualizar();
 aviso.textContent = b.dataset.nombre + " agregado al carrito.";
 location.hash = "tienda";
});

lista.addEventListener("click", e => {
 const b = e.target.closest("button");
 if (!b) return;
 const p = carrito[b.dataset.i];
 if (!p) return;
 if (b.dataset.accion === "mas") p.cantidad++;
 if (b.dataset.accion === "menos") p.cantidad--;
 if (b.dataset.accion === "quitar" || p.cantidad <= 0) {
  carrito.splice(b.dataset.i, 1);
 }
 actualizar();
 aviso.textContent = "";
});

function enviarWhatsApp(mensaje) {
 window.open(
  "https://wa.me/" + numeroWhatsApp + "?text=" +
  encodeURIComponent(mensaje),
  "_blank"
 );
}

document.getElementById("comprar").onclick = () => {
 if (!carrito.length) {
  aviso.textContent = "Primero agrega un producto al carrito.";
  return;
 }
 let mensaje = "Hola, SAVAGE. Quiero realizar este pedido:\n";
 carrito.forEach(p => {
  mensaje += `\n${p.nombre} x ${p.cantidad}: S/ ${
   (p.precio * p.cantidad).toFixed(2)
  }`;
 });
 mensaje += "\n\nTotal: " + total.textContent;
 mensaje += "\nEnvío: " +
  document.querySelector('[name="envio"]:checked').value;
 enviarWhatsApp(mensaje);
};

document.getElementById("formulario-contacto").onsubmit = e => {
 e.preventDefault();
 enviarWhatsApp(
  "Hola, SAVAGE. Solicito información.\n" +
  "Nombre: " + document.getElementById("nombre").value +
  "\nWhatsApp: " + document.getElementById("whatsapp").value +
  "\nProvincia: " + document.getElementById("provincia").value +
  "\nDistrito: " + document.getElementById("distrito").value +
  "\nProducto: " + document.getElementById("producto-consulta").value +
  "\nCantidad: " + document.getElementById("cantidad").value
 );
};
actualizar();

function llenarDistritos(datos) {
 distrito.innerHTML =
  '<option value="">Selecciona tu distrito</option>';
 datos.forEach(x => {
  distrito.add(new Option(x.distrito, x.id));
 });
 distrito.disabled = false;
}
departamento.onchange = () => {
 const listaProvincias = provincias.filter(x =>
  String(x.departamento_id).padStart(2, "0") ===
  String(departamento.value).padStart(2, "0")
 );
 provincia.innerHTML =
  '<option value="">Provincia opcional</option>';
 listaProvincias.forEach(x => {
  provincia.add(new Option(x.provincia, x.id));
 });
 distrito.value = "";
 const listaDistritos = distritos.filter(x => {
  const prov = provincias.find(
   p => String(p.id) === String(x.provincia_id)
  );
  return prov &&
   String(prov.departamento_id).padStart(2, "0") ===
   String(departamento.value).padStart(2, "0");
 });
 llenarDistritos(listaDistritos);
};

provincia.onchange = () => {
 const listaDistritos = distritos.filter(x => {
  const prov = provincias.find(
   p => String(p.id) === String(x.provincia_id)
  );
  if (provincia.value) {
   return String(x.provincia_id) === String(provincia.value);
  }
  return prov &&
   String(prov.departamento_id).padStart(2, "0") ===
   String(departamento.value).padStart(2, "0");
 });
 llenarDistritos(listaDistritos);
};
document.getElementById("formulario-contacto").onsubmit = e => {
 e.preventDefault();
 if (!distrito.value) {
  estadoUbicaciones.textContent =
   "Selecciona tu distrito para continuar.";
  distrito.focus();
  return;
 }
 enviarWhatsApp(
  "Hola, SAVAGE. Solicito información.\n" +
  "Nombre: " + document.getElementById("nombre").value +
  "\nWhatsApp: " + document.getElementById("whatsapp").value +
  "\nDepartamento: " + departamento.selectedOptions[0].text +
  "\nProvincia: " +
  (provincia.value
   ? provincia.selectedOptions[0].text
   : "No especificada") +
  "\nDistrito: " + distrito.selectedOptions[0].text +
  "\nProducto: " + document.getElementById("producto-consulta").value +
  "\nCantidad: " + document.getElementById("cantidad").value
 );
};
cargarUbicaciones();
actualizar();