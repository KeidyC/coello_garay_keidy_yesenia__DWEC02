//Clase GastoCombustible
class GastoCombustible{
    constructor( vehicleType, date, kilometers, precioViaje ){
        this.vehicleType = vehicleType;
        this.date = date;
        this.kilometers = kilometers;
        this.precioViaje = precioViaje
    }

    //Método convertToJSON() que serialice a JSON los atributos del objeto
    convertToJSON(){
        return JSON.stringify({
            vehicleType: this.vehicleType,
            date: this.date,
            kilometers: this.kilometers,
            precioViaje: this.precioViaje
        });
    }
}

// Exportarmos la clase
export default GastoCombustible; 