(() => {

    const boton = document.getElementById("boton");

    boton.addEventListener("click", async () => {
        // Consigo  el nombre de la Empresa desde API 
        let stock1 = document.getElementById("accion").value;
        let token = '&apikey=V3M13AGJZDLJ7SM0';
        let urlBase1 = "https://www.alphavantage.co/query?function=";
        let info = "OVERVIEW"
        let url1 = [`${urlBase1}${info}&symbol=${stock1}${token}`]

        const nombreEmpresa = fetch(url1)
        .then((response) => response.json())
        .then((item) => {
          return item.Name;
        });


        document.getElementById("graficoAccionesProyectado").innerHTML = "cargando"
        //El forecast sera con un periodo fijo

        let prop = await nombreEmpresa;
        let urlBasef = "https://www.alphavantage.co/query?function=";
        let periodof = "TIME_SERIES_DAILY"
        let urlf = [`${urlBasef}${periodof}&symbol=${stock1}${token}`, "Time Series (Daily)"]

        function getData(url) {
            return Promise.resolve(
                fetch(url)
                    .then(res => res.json())
            )
        }
        const data = getData(urlf[0])
        data.then(function (data) {
            let y = [];
            let xx = [];
            let anterior;
            let k = true;
            let originales = []

            for (x in data[urlf[1]]) {

                if (k == true) {
                    anterior = parseFloat(data[urlf[1]][x]['4. close']);
                    originales.push({ 'x': x.split(" ")[0], 'y': anterior })
                    k = false;
                } else {

                    xx.push(anterior);
                    y.push(parseFloat(data[urlf[1]][x]['4. close']));
                    originales.push({ 'x': x.split(" ")[0], 'y': parseFloat(data[urlf[1]][x]['4. close']) })
                    anterior = parseFloat(data[urlf[1]][x]['4. close']);
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
                    document.getElementById("graficoAccionesProyectado").innerHTML = "Error recargar página"
                    return 0
                }
                let forecast = [];


                for (let i = 0; i < originales.length; i++) {

                    let tensor = model.predict(tf.tensor2d([originales[i].y], [1, 1]));
                    let valor = parseFloat(tensor.dataSync()[0]).toFixed(2);
                    forecast.push({ 'x': originales[i].x, 'y': valor });

                }

                let ultimo = forecast[0].y
                console.log(ultimo);
                let tensor = model.predict(tf.tensor2d([parseFloat(ultimo)], [1, 1]));
                ultimo = parseFloat(tensor.dataSync()[0]).toFixed(2);

                var options = {
                    series: [{
                        name: "Regresión Lineal",
                        data: forecast
                    }, {

                        name: "Valor Real Cierre",
                        data: originales
                    }
                    ],
                    chart: {
                        type: 'line',
                        height: 350
                    },
                    title: {
                        text: `Gráfico Regresión lineal ${prop}`,
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
                let chart2 = new ApexCharts(document.getElementById("graficoAccionesProyectado"), options);
                chart2.render();

                document.getElementById("proximo").innerHTML=`<p>El valor esperado para mañana es: ${ultimo} USD </p>`
                //console.log(ultimo);



            };
            learnLinear(xx, y);





        })

    })


}
)()