(() => {

    const boton = document.getElementById("boton");

    boton.addEventListener("click", async () => {
        // Consigo  el nombre de la Empresa desde API 
        let stock1 = document.getElementById("accion").value;
        let token = '&apikey=V3M13AGJZDLJ7SM0';
        let urlBase1 = "https://www.alphavantage.co/query?function=";
        let info = "OVERVIEW"
        let url1 = [`${urlBase1}${info}&symbol=${stock1}${token}`]

        document.getElementById("graficoAccionesProyectado").innerHTML=""
        //El forecast sera con un periodo fijo

        // Guardo el nombre de la empresa para usarlo en lína .99
        let prop = await nombreEmpresa;
        let stock = document.getElementById("accion").value;

        let urlBase = "https://www.alphavantage.co/query?function=";
        let periodo = "TIME_SERIES_DAILY"
        let url = [`${urlBase}${periodo}&symbol=${stock}${token}`, "Time Series (Daily)"]
  
        function getData(url) {
            return Promise.resolve(
                fetch(url)
                    .then(res => res.json())
            )
        }
        const data = getData(url[0])
        data.then((data)=>{
            let y=[]
            let xx=[]
            let anterior;
            let k=true
           
            for(x in data[url[1]]){  
                         
                if(k==true){
                    anterior=parseFloat(data[url[1]][x]['4. close'])
                    k=false
                }else{

                    y.push(anterior)
                    xx.push(parseFloat(data[url[1]][x]['4. close']));
                    anterior=parseFloat(data[url[1]][x]['4. close'])
                }
                
            }
            
            xx=xx.reverse(x=>x)         
            y=y.reverse(y=>y)
            learnLinear= async (x,y)=>{

                const model = tf.sequential();
                model.add(tf.layers.dense({units:1,inputShape:[1]}));
                model.compile({
                    loss:'meanSquaredError',
                     optimizer :'adamax'
                    });
                const xs=tf.tensor2d(x,[x.length,1]);
                const ys=tf.tensor2d(y,[y.length,1]);

                await model.fit(ys,xs,{epochs: 250});
                let forecast=[]
                let inicial=[y[(y.length)-1]];
                
                for(let i=0;i<10;i++){
                    let tensor=model.predict(tf.tensor2d([inicial],[1,1]))
                    let valor=parseFloat(tensor.dataSync()[0]).toFixed(2);
                    console.log(valor);
                    forecast.push(valor);
                    inicial= tensor.dataSync()[0];
                }      
                
                
                var options = {
                    series: [{
                    data: forecast
                  }],
                    chart: {
                    type: 'line',
                    height: 350
                  },
                  title: {
                    text: `Gráfico Forecast 10 días ${stock}`,
                    align: 'center'
                  },                  
                  yaxis: {
                    tooltip: {
                      enabled: true
                    }
                  }
                  };
                  let chart2 = new ApexCharts(document.getElementById("graficoAccionesProyectado"), options);
                  chart2.render();
                
                
    
            }
            learnLinear(xx,y)




           
        })

    })


}
)()