 // Layer 0 - User Interface/printer.js

 exports.printTable = function (state) {
   for (let i = 0; i < state.table.length; i++) {
     console.log(`${i + 1}) ${state.table[i].name}   ${state.table[i].points}`);
   }
 };

 exports.printTableHighlighted = function (state) {
   console.log('---------------------------------------------------------------------------------------------');
   for (let i = 0; i < state.table.length; i++) {
     console.log(`${i + 1}) ${state.table[i].name}   ${state.table[i].points}`);
   }
   console.log('---------------------------------------------------------------------------------------------');
 };

 exports.print = function (string) {
   console.log(string);
 };


 exports.printHighlighted = function (string) {
   console.log('---------------------------------------------------------------------------------------------');
   console.log(string);
   console.log('---------------------------------------------------------------------------------------------');
 };

 function printMatchStadistics(matches, local, visit) {
   console.log(`${local} vs ${visit}: ${local} ganó ${matches[local][visit][local]}, ${visit} ganó ${matches[local][visit][visit]}, empataron ${matches[local][visit].draw} `);
 }

 exports.printAllMatchesOfHighlighted = function (state) {
   console.log('---------------------------------------------------------------------------------------------');
   for (let i = 0; i < Object.keys(state.matches).length; i++) {
     const local = Object.keys(state.matches)[i];
     for (let j = 0; j < Object.keys(state.matches[local]).length; j++) {
       const visit = Object.keys(state.matches[local])[j];
       printMatchStadistics(state.matches, local, visit);
     }
   }
   console.log('---------------------------------------------------------------------------------------------');
 };

 exports.printMatchesOfHighlighted = function (state, country) {
   console.log('---------------------------------------------------------------------------------------------');
   for (let i = 0; i < Object.keys(state.matches).length; i++) {
     const local = Object.keys(state.matches)[i];
     for (let j = 0; j < Object.keys(state.matches[local]).length; j++) {
       const visit = Object.keys(state.matches[local])[j];
       if (local === country || visit === country) {
         printMatchStadistics(state.matches, local, visit);
       }
     }
   }
   console.log('---------------------------------------------------------------------------------------------');
 };
