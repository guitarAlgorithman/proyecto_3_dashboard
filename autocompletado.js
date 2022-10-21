

let cajaAPI = document.getElementById("accion")

cajaAPI.addEventListener("keyup", async () => {

    let stock = document.getElementById("accion").value;
    // obtuve otra Key, ya que estaba pidiendo mucha info a la API.
    let token = '&apikey=YL903NWSISGJPQQB';
    let urlBase = "https://www.alphavantage.co/query?function=";
    let metodo = "SYMBOL_SEARCH";

    let url = [`${urlBase}${metodo}&keywords=${stock}${token}`];


    const listaSugerencias = [];

    // Esta es la caja que recibirá los simbolos sugeridos por la API.
    // Usé bootstrap, y el form quedó dentro del div de las lineas 36-43 del html.
    const cajaSugerencias = document.getElementById("datalistOptions");

    const listaMatches = fetch(url)
        .then((response) => response.json())

        .then((lista) => {

            const arraySugerencias = lista.bestMatches;

            arraySugerencias.forEach((item) => {
                const cadaSugerencia = (item);
                const cadaSimbolo = (Object.values(cadaSugerencia)[0]);

                listaSugerencias.push(cadaSimbolo);
                var newTag = document.createElement("option");
                var sugerencia = document.createTextNode(`${cadaSimbolo}`);
                newTag.appendChild(sugerencia);

                cajaSugerencias.appendChild(newTag);

            })



        })
})

//Esto es para borrar las sugerencias anteriores de la caja

cajaAPI.addEventListener("focusout", async () => {
    const cajaSugerencias = document.getElementById("datalistOptions");

    while (cajaSugerencias.firstChild) {
        cajaSugerencias.removeChild(cajaSugerencias.firstChild);
    }
});

