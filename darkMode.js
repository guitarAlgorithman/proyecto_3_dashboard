const bdark = document.querySelector('#bdark', );
const body = document.querySelector('body');
const inputs = document.querySelector('.inputs');
const graficoAcciones = document.querySelector('.graficoAcciones')
const graficoAccionesProyectado = document.querySelector('.graficoAccionesProyectado')
const bdark2 = document.querySelector('.bwhite')

bdark.addEventListener('click', e=>{
    body.classList.toggle('darkmode');
    inputs.classList.toggle('inputsDark');
    graficoAcciones.classList.toggle('graficoAccionesDark');
    graficoAccionesProyectado.classList.toggle('graficoAccionesProyectadoDark');
    bdark2.classList.toggle('bdark')
})

