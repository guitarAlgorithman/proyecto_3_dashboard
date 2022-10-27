(() => {

  //Obtiene el elemento boton
  const boton = document.getElementById("boton")

  //funcion de apoyo, retorna un elemento al azar de un array
  function random_item(items){
    return items[Math.floor(Math.random()*items.length)];
  }
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
    // Consigo  el nombre de la Empresa desde API 

    let stock = document.getElementById("accion").value;
    //Este token busca obtener el nombre de la empresa y los detalles en la api
    let token = random_item(['&apikey=U34CX5I5PKMD40BK','&apikey=U34CX5I5PKMD40BK','&apikey=UWG636FIC5KU9WFL','&apikey=3R61X21IN0YKPG24','&apikey=IEWGJV7AJ6LPB0Y4','&apikey=KMJIO4FE0CCC0U6A']);
    //console.log(token);
    let urlBase = "https://www.alphavantage.co/query?function=";
    let info = "OVERVIEW"
    let url1 = [`${urlBase}${info}&symbol=${stock}${token}`]

    const nombreEmpresa = fetch(url1)
      .then((response) => response.json())
      .then((item) => {
        return item.Name;
      });

    document.getElementById("graficoAcciones").innerHTML = ""
    document.getElementById("graficoAccionesProyectado").innerHTML = "Cargando proyección de valores..."
    let prop = await nombreEmpresa;
    if (!prop) {
      prop = "Activo Exótico";
    }


    // Guardo el nombre de la empresa para usarlo en lína .118
    let frecuencia = document.getElementById("frecuencia").value;
    let periodo = document.getElementById("periodo").value;

    function getData(url) {
      return Promise.resolve(
        fetch(url)
          .then(res => res.json())
      )
    }
    getUrl = (stock, per, freq) => {

      //Se usa otro token por limite de consulta de la api
      let token = random_item(['&apikey=V3M13AGJZDLJ7SM0','&apikey=GT6OY7LGBYYCVW15','&apikey=BJG78FFVJWSSLCO4','&apikey=E3C8HTNZRKKOHBLP','&apikey=L9TOGDM571H8IPOI','&apikey=DCZYHSNB898FDXDN','&apikey=IV1DHS39MCUESNJY'])
      //console.log(token);
      if (per == "Diario") {
        let periodo = "TIME_SERIES_DAILY"
        return [`${urlBase}${periodo}&symbol=${stock}${token}`, "Time Series (Daily)"]

      }
      else if (per == "Mensual") {
        let periodo = "TIME_SERIES_MONTHLY"
        return [`${urlBase}${periodo}&symbol=${stock}${token}`, "Monthly Time Series"]
      }
      else {
        let periodo = "TIME_SERIES_INTRADAY"
        if (freq == "15 Minutos") {
          frecuencia = "&interval=15min"
          return [`${urlBase}${periodo}&symbol=${stock}${frecuencia}${token}`, "Time Series (15min)"]
        }
        else if (freq == "30 Minutos") {
          let frecuencia = "&interval=30min"
          //Time Series (30min)

          return [`${urlBase}${periodo}&symbol=${stock}${frecuencia}${token}`, "Time Series (30min)"]
        }
        else {
          let frecuencia = "&interval=60min"
          return [`${urlBase}${periodo}&symbol=${stock}${frecuencia}${token}`, "Time Series (60min)"]
        }
      }


    }
    let url = getUrl(stock, periodo, frecuencia)
    //console.log(url[0])
    getData(url[0]).then(data => {
      //console.log(data);

      if (!data[url[1]]) {
        swal('ERROR', 'Ingrese un texto válido o se acabó el límite de consultas desde la API', 'error');
        document.getElementById("graficoAccionesProyectado").innerHTML = "Ocurrió un error, favor recargar la página!";
        document.getElementById("proximo").innerHTML = "";

      } else {
        let fechas = []
        let valores = []
        for (x in data[url[1]]) {
          fechas.push(x.split(" ")[0])
          valores.push({
            'x': x.split(" ")[0],
            'y': [parseFloat(data[url[1]][x]['1. open']),
            parseFloat(data[url[1]][x]['2. high']),
            parseFloat(data[url[1]][x]['3. low']),
            parseFloat(data[url[1]][x]['4. close'])]
          })
        }
        fechas = fechas.reverse(x => x)
        valores = valores.reverse(x => x)

        var options = {
          series: [{
            data: valores
          }],
          chart: {
            toolbar:{
              show:false
            },
            type: 'candlestick',
            height: 350
          },
          title: {
            text: `Acciones de ${prop}`,
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

        let y = [];
        let xx = [];
        let anterior;
        let k = true;
        let originales = []

        for (x in data[url[1]]) {

          if (k == true) {
            anterior = parseFloat(data[url[1]][x]['4. close']);
            originales.push({ 'x': x.split(" ")[0], 'y': anterior })
            k = false;
          } else {

            xx.push(anterior);
            y.push(parseFloat(data[url[1]][x]['4. close']));
            originales.push({ 'x': x.split(" ")[0], 'y': parseFloat(data[url[1]][x]['4. close']) })
            anterior = parseFloat(data[url[1]][x]['4. close']);
          }

        }
        xx = xx.reverse(x => x);
        y = y.reverse(y => y);

        learnLinear = async (x, y) => {

          const model = tf.sequential();
          model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
          model.compile({
            loss: 'meanSquaredError',
            optimizer: 'adamax'
          });
          const xs = tf.tensor2d(x, [x.length, 1]);
          const ys = tf.tensor2d(y, [y.length, 1]);

          await model.fit(xs, ys, { epochs: 500 });
          if (!model) {
            document.getElementById("graficoAccionesProyectado").innerHTML = "Ocurrió un error, favor recargar la página!"
            return 0
          }
          let forecast = [];


          for (let i = 0; i < originales.length; i++) {

            let tensor = model.predict(tf.tensor2d([originales[i].y], [1, 1]));
            let valor = parseFloat(tensor.dataSync()[0]).toFixed(2);
            forecast.push({ 'x': originales[i].x, 'y': valor });

          }

          let ultimo = forecast[0].y
          if (!ultimo) {
            document.getElementById("graficoAccionesProyectado").innerHTML = "Ocurrió un error, favor recargar la página!"
            return 0
          }
          //console.log(ultimo);
          let tensor = model.predict(tf.tensor2d([parseFloat(ultimo)], [1, 1]));
          ultimo = parseFloat(tensor.dataSync()[0]).toFixed(2);

          var optionss = {
            series: [{
              name: "Regresión Lineal",
              data: forecast
            }, {

              name: "Valor Real Cierre",
              data: originales
            }
            ],
            chart: {
              toolbar:{
                show:false
              },
              type: 'line',
              height: 350
            },
            title: {
              text: `Regresión lineal para ${prop}`,
              align: 'center'
            },
            yaxis: {
              tooltip: {
                enabled: true
              }
            },
            xaxis: {
              type: 'datetime'
            },
          };
          document.getElementById("graficoAccionesProyectado").innerHTML = ""
          let chart2 = new ApexCharts(document.getElementById("graficoAccionesProyectado"), optionss);
          if(!chart2.render()){
            document.getElementById("graficoAccionesProyectado").innerHTML = "Ocurrió un error, favor recargar la página!"
            return 0
          }

          document.getElementById("proximo").innerHTML = `<p>El valor esperado en base a su selección es: ${ultimo} (En la unidad de moneda que corresponda)</p>`
        }
        learnLinear(xx, y);
      }

    })
  })
})()
