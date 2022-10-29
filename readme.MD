# Dashboard Proyecto 3

El siguiente trabajo se enmarca en el Bootcamp FullStack 2022 de la UDD.

## Dashboard

El siguiente Dashboard realiza una consulta a la API [Alpha Vantage](https://www.alphavantage.co/) para obtener precios de activos como acciones, currencies, entre otras y graficarlos con la API [APEX Charts](https://apexcharts.com/).

Finalmente de forma adicional, efectúa una serie de tiempo autoregresiva en base a la selección, buscando realizar un pronóstico (el algoritmo se ejecuta mediante la API [TensorFlow JS](https://www.tensorflow.org/)). 

## Funcionamiento y limiantes

Se ingresa el Activo a analizar en la parte de acción mediante su símbolo. (Algunos ejemplos puden ser AAPL, IBM, MSFT, BTCUSD, USDCLP, entre otros). Para las fracuencias mensuales y diarias, solamente se tiene la frecuenca definida por la API. Para los precios Intraday, se pueden definir frecuencias de 15 minutos, 30 minutos y 60 minutos a mostras.

Cabe destacar, que por un tema de la gratuidad de la API [Alpha Vantage](https://www.alphavantage.co/) existe un número limitado de 5 consultar por minuto.

## Layout básico

El Layout desarrollado tiene el siguiente esquema:

![](./images/layout-basico.jpg) 

El funcionamiento responsive busca que se convierta en una columna.

## GITHub del proyecto

[Link al proyecto](https://github.com/guitarAlgorithman/proyecto_3_dashboard)

## Página del proyecto publicada

[Link](https://guitaralgorithman.github.io/proyecto_3_dashboard/)

## Participantes

- [Mario Sanhueza](https://github.com/MarioASG)
- [Nicolas Meneses](https://github.com/BootNM)
- [Gustavo Henriquez](https://github.com/guitarAlgorithman)