//Importamos la clase GastoCombustible
import GastoCombustible from "./GastoCombustible.js";

// ------------------------------ 1. VARIABLES GLOBALES ------------------------------
let tarifasJSON = null;
let gastosJSON = null;
let tarifasJSONpath = "data/tarifasCombustible.json";// Ruta de los Ficheros
let gastosJSONpath = "data/gastosCombustible.json";

// ------------------------------ 2. CARGA INICIAL DE DATOS (NO TOCAR!) ------------------------------
// Esto inicializa los eventos del formulario y carga los datos iniciales
document.addEventListener("DOMContentLoaded", async () => {
    // Cargar los JSON cuando la página se carga, antes de cualquier interacción del usuario
    await cargarDatosIniciales();

    // Mostrar datos en consola
    console.log("Tarifas JSON: ", tarifasJSON);
    console.log("Gastos JSON: ", gastosJSON);

    calcularGastoTotal();

    // Inicializar eventos el formularios
    document.getElementById("fuel-form").addEventListener("submit", guardarGasto);
});

// Función para cargar ambos ficheros JSON al cargar la página
async function cargarDatosIniciales() {

    try {
        // Esperar a que ambos ficheros se carguen
        tarifasJSON = await cargarJSON(tarifasJSONpath);
        gastosJSON = await cargarJSON(gastosJSONpath);

    } catch (error) {
        console.error("Error al cargar los ficheros JSON:", error);
    }
}

// Función para cargar un JSON desde una ruta específica
async function cargarJSON(path) {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error(`Error al cargar el archivo JSON: ${path}`);
    }
    return await response.json();
}

// ------------------------------ 3. FUNCIONES ------------------------------
// Calcular gasto total por año al iniciar la aplicación
function calcularGastoTotal() {
    // Array asociativo con clave=año y valor=gasto total
    let aniosArray = {
        2010: 0,
        2011: 0,
        2012: 0,
        2013: 0,
        2014: 0,
        2015: 0,
        2016: 0,
        2017: 0,
        2018: 0,
        2019: 0,
        2020: 0,
    };

    // Recorrer el array de gastos y acumular el precio de viaje en el año correspondiente
    gastosJSON.forEach((gasto) => {
        // Extraemos el año del gasto
        let anio = new Date(gasto.date).getFullYear();

        // Comprobar si el año está en nuestro array (entre 2010 y 2020) y sumamos el precio
        // del viaje al año correspondiente
        if (anio >= 2010 && anio <= 2020) {
            aniosArray[anio] += gasto.precioViaje;
        }
    });

    // Recorremos el array aniosArray y mostramos los resultados en nuestra aplicación 
    for (let anio in aniosArray) {
        document.getElementById(`gasto${anio}`).textContent =
            aniosArray[anio].toFixed(2);
    }
}

// Guardar gasto introducido y actualizar datos
function guardarGasto(event) {
    event.preventDefault();

    // Obtener los datos del formulario
    const tipoVehiculo = document.getElementById("vehicle-type").value;
    const fecha = new Date(document.getElementById("date").value);
    const kilometros = parseFloat(document.getElementById("kilometers").value);
 
    //Extraemos el año de la fecha introducida en el formulario
    let anio = fecha.getFullYear();
    let precioKilometro = 0;

    //Buscar la tarifa correspondiente al tipo de vehículo y año devuelve 0 si el vehiculo no existe.
    tarifasJSON.tarifas.forEach(tarifa => {
        if (tarifa.anio === anio) {
            precioKilometro = tarifa.vehiculos[tipoVehiculo] || 0; 
        }
    });

    // Calcula el precio del viaje
    let precioViaje = precioKilometro * kilometros;

    // Crea un nuevo objeto de tipo GastoCombustible
    const nuevoGasto = new GastoCombustible(tipoVehiculo, fecha, kilometros, precioViaje);

    // Agrega el nuevo gasto a gastosJSON
    gastosJSON.push(nuevoGasto);

    // Mostrar el nuevo gasto en "Gastos recientes"
    mostrarGastoReciente(nuevoGasto);

    // Actualiza el gasto total con el nuevo gasto
    calcularGastoTotal();

    // Limpiamos el formulario
    document.getElementById("fuel-form").reset();
}


//Función para mostrar los gastos recientes
function mostrarGastoReciente(gasto) {
    let listaGasto = document.getElementById("expense-list");
    let lista = document.createElement("li");
    lista.textContent = gasto.convertToJSON();
    listaGasto.appendChild(lista);
}

