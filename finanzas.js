(() => {
    const boton = document.getElementById("boton")
    boton.addEventListener("click", () => {
        let stock = document.getElementById("accion").value;
        let periodo = document.getElementById("periodo").value;
        let frecuencia = document.getElementById("frecuencia").value;
        
        function getData(url) {
            return Promise.resolve(
                fetch(url)
                    .then(res => res.json())
            )
        }
        let url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${stock}&interval=30min&apikey=V3M13AGJZDLJ7SM0`;
        getData(url).then(data => {
            let data2 = data["Time Series (30min)"];
            if (!data2) {
              swal('ERROR', 'Ingrese un texto válido', 'error')
            } else {
                let fechas = []
                let valores = []
                for (x in data2) {
                  fechas.push(x.split(" ")[0])
                  valores.push({ 'x':x.split(" "),
                   'y': [parseFloat(data2[x]['1. open']),
                    parseFloat(data2[x]['2. high']),
                     parseFloat(data2[x]['3. low']),
                      parseFloat(data2[x]['4. close'])]
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

