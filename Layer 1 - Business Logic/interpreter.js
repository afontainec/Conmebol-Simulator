// Layer 1 - Business Logic/interpreter.js

const Logic = require('./logic');
const Printer = require('../Layer 0 - User Interface/printer');
const matchProvider = require('../Layer 2 - Data Access/matchProvider');
const oddProvider = require('../Layer 2 - Data Access/oddProvider');


// exports.maxFifth = function (n) {
//   const initialState = Logic.getInitalState();
//   Printer.printHighlighted('La tabla actual es: ');
//   Printer.printTable(initialState);
// };

function addTableToFinalState(finalState, table) {
  if (!finalState.table) {
    finalState.table = matchProvider.getTeams();
  }
  for (let j = 0; j < finalState.table.length; j++) {
    for (let i = 0; i < table.length; i++) {
      if (table[i].name === finalState.table[j].name) {
        finalState.table[j].points += table[i].points;
      }
    }
  }
}

function getVisit(match, local) {
  const array = Object.keys(match);
  for (let i = 0; i < array.length; i++) {
    if (array[i] !== 'local' && array[i] !== 'round' && array[i] !== local && array[i] !== 'status') {
      return array[i];
    }
  }
}

function addMatchesToFinalState(finalState, matches) {
  if (!finalState.matches) {
    finalState.matches = {};
  }

  for (let i = 0; i < matches.length; i++) {
    // add the match if it has not been played
    if (matches[i].status !== 'played') {
      const local = matches[i].local;
      if (!(local in finalState.matches)) {
        finalState.matches[local] = {};
      }
      const visit = getVisit(matches[i], local);
      if (!(visit in finalState.matches[local])) {
        finalState.matches[local][visit] = {};
        finalState.matches[local][visit][local] = 0;
        finalState.matches[local][visit][visit] = 0;
        finalState.matches[local][visit].draw = 0;
      }
      // home wins
      if (matches[i][local] > matches[i][visit]) {
        finalState.matches[local][visit][local] += 1;
      } else if (matches[i][local] < matches[i][visit]) {
        finalState.matches[local][visit][visit] += 1;
      } else {
        finalState.matches[local][visit].draw += 1;
      }
    }
  }
}

function divideTable(table, byNumber) {
  for (let i = 0; i < table.length; i++) {
    table[i].points /= byNumber;
  }
}

function addStateToFinalState(finalState, state) {
  addTableToFinalState(finalState, state.table);
  addMatchesToFinalState(finalState, state.matches);
}

function getMatchToPullDown(matches, mode) {
  if (!mode || mode === 'least_likely') {
    return matches[0];
  } else if (mode === 'random') {
    const r = Math.floor(Math.random() * matches.length);
    return matches[r];
  }
}


function initialize() {
  return new Promise((resolve) => {
    const promises = [matchProvider.initialize(), oddProvider.initialize()];
    resolve(Promise.all(promises));
  });
}

exports.simulteToQualify = function (n, country, options) {
  initialize().then(() => {
    if (!n) {
      n = 1;
    }

    const finalState = {};
    let unQualifiable = 0;
    Printer.printHighlighted('La tabla actual es: ');
    Printer.printTableHighlighted(Logic.getInitalState(options.round));
    for (let i = 0; i < n; i++) {
      let state = Logic.getInitalState(options.round);
      state = Logic.teamWinsEverything(country, state);
      state = Logic.playMissingMatches(state);
      if (!Logic.isQualified(state, country, options.position)) {
        // Printer.print(`El país ${country} no va a clasificar aunque gane todo`);
        // Printer.printHighlighted(`Escenarion en que ${country} se le es imposible clasificar:`);
        // Printer.printTableHighlighted(state);
        unQualifiable++;
      } else {
        const matches = Logic.filterDownableMatches(state.matches, country);

        while (matches.length > 0) {
          // sort by unlikeness
          matches.sort((a, b) => {
            return Logic.getOddOfOccurance(a) - Logic.getOddOfOccurance(b);
          });

          // get the match to pullDown

          const match = getMatchToPullDown(matches, options.mode);
          // pullDown will make if country won, then its a tie,
          // if it was a tie then country looses
          // and if country already looses it does nothing
          Logic.pullDown(state, match, country);
          state.table = Logic.sortTable(state.table);

          // check if it has become unqualified, therefor match is undownable.
          if (!Logic.isQualified(state, country, options.position)) {
            // Complete opposite of pullDown
            Logic.pushUp(state, match, country);
            match.status = 'undownable';
            state.table = Logic.sortTable(state.table);
            // remove the match
            const index = matches.indexOf(match);
            if (index > -1) {
              matches.splice(index, 1);
            }
          }

          // remove undownable match
          if (match.status === 'undownable') {
            const index = matches.indexOf(match);
            if (index > -1) {
              matches.splice(index, 1);
            }
          }
        }
        addStateToFinalState(finalState, state);
      }
    }
    divideTable(finalState.table, n - unQualifiable);
    finalState.table = Logic.sortTable(finalState.table);

    Printer.printHighlighted(`En ${unQualifiable} (${(unQualifiable / n) * 100}%) escenarios se hizo imposible para que ${country} clasificara`);
    Printer.printHighlighted('Todos los partidos:');
    Printer.printAllMatchesOfHighlighted(finalState);
    Printer.printHighlighted('Tabla:');
    Printer.printTableHighlighted(finalState);
    Printer.printHighlighted(`Los Partidos de ${country}:`);
    Printer.printMatchesOfHighlighted(finalState, country);
  }).catch((err) => {
    console.log('hubo un error');
    Printer.print(err);
  });
};

exports.simulate = function (n, round) {
  initialize().then(() => {
    if (!n) {
      n = 1;
    }

    // if (!round) {
    //   round = 20;
    // }

    const finalState = {};
    Printer.printHighlighted('La tabla actual es: ');
    Printer.printTableHighlighted(Logic.getInitalState(round));
    for (let i = 0; i < n; i++) {
      let state = Logic.getInitalState(round);
      state = Logic.playMissingMatches(state);
      addStateToFinalState(finalState, state);
    }
    divideTable(finalState.table, n);
    finalState.table = Logic.sortTable(finalState.table);

    Printer.printHighlighted('Todos los partidos:');
    Printer.printAllMatchesOfHighlighted(finalState);
    Printer.printHighlighted('Tabla:');
    Printer.printTableHighlighted(finalState);
  }).catch((err) => {
    console.log('hubo un error');
    Printer.print(err);
  });
};
