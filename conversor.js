// Empiezo el conversor con un array vacío e importo el array real desde el archivo JsON

let monedas = [];

document.addEventListener("DOMContentLoaded", () => {
    const importarMonedas = fetch("./data.json");
    importarMonedas.then((respuesta) => respuesta.json()).then((respuesta) => {
        monedas = respuesta;
        agregarTarjetasDivisas(monedas)
    })
})

// Empieza el conversor. Primero, muestro en pantalla las divisas disponibles

let contenedorDivisas = document.getElementById("contenedorDivisas")

// Cargo el local storage desde el inicio (si lo hubiera)

const cargarHistorialDesdeLocalStorage = () => {
    let historialGuardado = localStorage.getItem('historialDeConversiones');
    if(historialGuardado){
        historialDeConversiones = JSON.parse(historialGuardado);
    }

    mostrarHistorialDeConversiones();
}

const agregarTarjetasDivisas = () => {
    monedas.forEach((divisa) => {
        let divDivisa = document.createElement("div")
        divDivisa.className = "tarjetaDivisa"
        divDivisa.innerHTML = `<h3>Divisa: ${divisa.nombre}</h3>
        <h3>Tipo de Cambio: ${divisa.tipoDeCambio}</h3>
        <h3>País de Origen: ${divisa.paisDeOrigen}</h3>`;
        contenedorDivisas.appendChild(divDivisa)
    })
}

agregarTarjetasDivisas();

// Genero un array para ir mostrando el historial en pantalla

let historialDeConversiones = [];

// Función para convertir los pesos a otra moneda

const convertirDivisas = () => {
    let cantidadIngresada = Number(document.getElementById("cantidadIngresada").value);
    let divisaSeleccionada = document.getElementById("divisaSeleccionada").value;

    let tipoDeCambio = monedas.find(divisa => divisa.nombre === divisaSeleccionada).tipoDeCambio;

    let resultadoConversion = cantidadIngresada / tipoDeCambio;

    let mostrarResultadoConversion = document.getElementById("mostrarResultado");
    mostrarResultadoConversion.textContent = `Sus ${cantidadIngresada} pesos son equivalentes a ${resultadoConversion.toFixed(2)} ${divisaSeleccionada}`

    historialDeConversiones.push({
        cantidad: cantidadIngresada,
        divisa: divisaSeleccionada,
        resultado: resultadoConversion.toFixed(2),
    })

    guardarHistorialEnLocalStorage();
    mostrarHistorialDeConversiones();

    Swal.fire("Conversión realizada con éxito!");
}

// Acá está la función para el historial

const mostrarHistorialDeConversiones = () => {
    let contenedorHistorial = document.getElementById("contenedorHistorial");
    contenedorHistorial.innerHTML = "";

    historialDeConversiones.forEach(conversion => {
        let divConversion = document.createElement("div");
        divConversion.className = "divConversion"
        divConversion.innerHTML = `
        <p>${conversion.cantidad} pesos son ${conversion.resultado} ${conversion.divisa}</p>`;
        contenedorHistorial.appendChild(divConversion)
    })
}

// Le asigno el evento al botón para que ejecute la conversión

let botonConvertir = document.getElementById("botonConvertir")

botonConvertir.addEventListener("click", convertirDivisas)

// Genero una función para almacenar en Local Storage

const guardarHistorialEnLocalStorage = () => {
    localStorage.setItem('historialDeConversiones', JSON.stringify(historialDeConversiones));
}

// Le asigno el evento al botón de borrar para borrar el historial en Local Storage

const borrarHistorial = () => {
    localStorage.removeItem('historialDeConversiones')
    historialDeConversiones = [];
    mostrarHistorialDeConversiones();
    
    Swal.fire("El historial fue borrado exitosamente")
}

let botonBorrarHistorial = document.getElementById("botonBorrar")
botonBorrarHistorial.addEventListener("click", borrarHistorial);

cargarHistorialDesdeLocalStorage();