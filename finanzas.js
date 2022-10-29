//se importan los modulos
import {getData,getUrl,learnLinear,plot1,getNombre} from "./auxiliar.js"
(() => {
  
  //Obtiene el elemento boton
  const boton = document.getElementById("boton")
  //Obtiene el periodo... 
  let periodo = document.getElementById("periodo")
  //y lo desactiva si la funcion no esta en intraday
  periodo.addEventListener("change", () => {
    if (periodo.value == "Intraday") {
      frecuencia.disabled = false
    }
    else {
      frecuencia.disabled = true
    }
  })

  boton.addEventListener("click", async () => {
    //Obtenfo el simbolo ingresado
    let stock = document.getElementById("accion").value;

    // Consigo  el nombre de la Empresa desde API 
    let prop;
    getNombre(stock).then((item) => {
      prop= item;
    })


    // Guardo el nombre de la empresa para usarlo en lína .118
    let frecuencia = document.getElementById("frecuencia").value;
    let periodo = document.getElementById("periodo").value;


    //Se obtiene la URL a consultar
    let url = getUrl(stock, periodo, frecuencia)
    //consulto la API
    getData(url[0]).then(data => {

      //Si hay algun error
      if (!data[url[1]]) {
        swal('ERROR', 'Ingrese un texto válido o se acabó el límite de consultas desde la API', 'error');
        document.getElementById("graficoAccionesProyectado").innerHTML = "Ocurrió un error, favor recargar la página!";
        document.getElementById("proximo").innerHTML = "";

      } 
      //SI no
      else {
        //se grafica el grafico de velas
        plot1(data,url,prop)
        //Se proyectan los valores       
        learnLinear(data,url,prop);
      }

    })
  })
})()
