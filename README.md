# Conmebol-Simulator
Simulator to simulate which matches a country must win in order to qualify to the world cup.


To add a match result:

`node models/matches.js`


To simulate a table a hundred times:

`node Layer\ 0\ -\ User\ Interface/lector.js simulate -n 100`

To see what matches Chile needs to win to qualify in 5th position:

`node Layer\ 0\ -\ User\ Interface/lector.js qualify -n 100 -c chile -p 5`