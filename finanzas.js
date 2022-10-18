(() => {
  const boton = document.getElementById("boton")
  let periodo = document.getElementById("periodo")
  periodo.addEventListener("change",()=>{
    if(periodo.value=="Intraday"){
      frecuencia.disabled=false
    }
    else{
      frecuencia.disabled=true
    }
  })



  
  boton.addEventListener("click", () => {
      document.getElementById("graficoAcciones").innerHTML=""
      let stock = document.getElementById("accion").value;        
      let frecuencia = document.getElementById("frecuencia").value;        
      let periodo = document.getElementById("periodo").value;

      function getData(url) {
          return Promise.resolve(
              fetch(url)
                  .then(res => res.json())
          )
      }
      getUrl=(stock,per,freq)=>{
        //¿Como se esconde?
        let token='&apikey=V3M13AGJZDLJ7SM0';
        let urlBase="https://www.alphavantage.co/query?function=";
        if(per=="Diario"){
          let periodo="TIME_SERIES_DAILY"
          return [`${urlBase}${periodo}&symbol=${stock}${token}`,"Time Series (Daily)"]
  
        }
        else if(per=="Mensual"){
          let periodo="TIME_SERIES_MONTHLY"
          return [`${urlBase}${periodo}&symbol=${stock}${token}`,"Monthly Time Series"]
        }
        else{
          let periodo="TIME_SERIES_INTRADAY"
          if(freq=="15 Minutos"){
            frecuencia="&interval=15min"
            return [`${urlBase}${periodo}&symbol=${stock}${frecuencia}${token}`,"Time Series (15min)"]
          }
          else if(freq=="30 Minutos"){
            let frecuencia="&interval=30min"
            //Time Series (30min)
  
            return [`${urlBase}${periodo}&symbol=${stock}${frecuencia}${token}`,"Time Series (30min)"]
          }
          else{
            let frecuencia="&interval=60min"
            return [`${urlBase}${periodo}&symbol=${stock}${frecuencia}${token}`,"Time Series (60min)"]
          }
        }
  
  
      }
      //let url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${stock}&interval=30min&apikey=V3M13AGJZDLJ7SM0`;
      let url=getUrl(stock,periodo,frecuencia)
      console.log(url[0])
      getData(url[0]).then(data => {
        console.log(data);

          if (!data[url[1]]) {
            swal('ERROR', 'Ingrese un texto válido', 'error')
          } else {
              let fechas = []
              let valores = []
              for (x in data[url[1]]) {
                fechas.push(x.split(" ")[0])
                valores.push({ 'x':x.split(" "),
                 'y': [parseFloat(data[url[1]][x]['1. open']),
                  parseFloat(data[url[1]][x]['2. high']),
                   parseFloat(data[url[1]][x]['3. low']),
                    parseFloat(data[url[1]][x]['4. close'])]
                  })
              }
              var options = {
                  series: [{
                  data: valores
                }],
                  chart: {
                  type: 'candlestick',
                  height: 350
                },
                title: {
                  text: `Gráfico acción ${stock}`,
                  align: 'center'
                },
                xaxis: {
                  type: 'datetime'
                },
                yaxis: {
                  tooltip: {
                    enabled: true
                  }
                }
                };
                let chart = new ApexCharts(document.getElementById("graficoAcciones"), options);
                chart.render();
                
          }

      })
  })
}
)()

