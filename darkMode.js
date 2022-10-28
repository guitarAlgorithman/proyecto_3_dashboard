const bdark = document.querySelector('#bdark');
const body = document.querySelector('body');
const inputs = document.querySelector('.inputs');
const graficoAcciones = document.querySelector('.graficoAcciones');
const graficoAccionesProyectado = document.querySelector('.graficoAccionesProyectado');
const bdark2 = document.querySelector('.bwhite');
const valorEsperado = document.querySelector('.valorEsperado');
const titulo = document.querySelector('.titulo');

bdark.addEventListener('click', e=>{
    body.classList.toggle('darkmode');
    inputs.classList.toggle('inputsDark');
    graficoAcciones.classList.toggle('graficoAccionesDark');
    graficoAccionesProyectado.classList.toggle('graficoAccionesProyectadoDark');
    bdark2.classList.toggle('bdark');
    valorEsperado.classList.toggle('valorDark');
    titulo.classList.toggle('tituloDark');
    
    const cambioModo = bdark2.classList.length;

    if(cambioModo === 1){
        document.querySelector('#bdark').innerHTML = 'Modo Oscuro';
        }else{
            document.querySelector('#bdark').innerHTML = 'Modo Claro'
        }
});



   

