// Layer 1 - Business Logic/logic

const matchProvider = require('../Layer 2 - Data Access/matchProvider');
const oddProvider = require('../Layer 2 - Data Access/oddProvider');
// const Printer = require('../Layer 0 - User Interface/printer');


function addPoints(state, match, local, visit) {
  if (match[state.table[local].name] > match[state.table[visit].name]) {
    state.table[local].points += 3;
  } else if (match[state.table[local].name] === match[state.table[visit].name]) {
    state.table[local].points += 1;
    state.table[visit].points += 1;
  } else {
    state.table[visit].points += 3;
  }
}

function sort(p) {
  const sortedArray = p;
  sortedArray.sort((a, b) => {
    return b.points - a.points;
  });

  return sortedArray;
}


exports.sortTable = sort;

exports.getInitalState = function (round) {
  const state = {
    table: [],
    matches: [],
  };
  state.table = matchProvider.getTeams();
  for (let i = 0; i < state.table.length; i++) {
    const local = state.table[i].name;
    for (let j = 0; j < state.table.length; j++) {
      const visit = state.table[j].name;
      if (local !== visit) {
        const match = matchProvider.getMatch(local, visit);
        if (match) {
          const matchRound = parseInt(match.round, 10);
          round = parseInt(round, 10);
          // check if its before the given round
          if (!round || round > matchRound) {
            match.status = 'played';
            addPoints(state, match, i, j);
            state.matches.push(match);
          }
        }
      }
    }
  }
  state.table = sort(state.table);
  return state;
};


function createAndAddMatch(local, visit, localGoals, visitGoals, status) {
  const match = {};
  match[local] = localGoals;
  match[visit] = visitGoals;
  match.local = local;
  match.status = status;
  match.odds = oddProvider.getOdds(local, visit);
  return match;
}

function matchPlayed(matches, local, visit) {
  for (let i = 0; i < matches.length; i++) {
    if ((local in matches[i]) && (visit in matches[i]) && matches[i].local === local) {
      return true;
    }
  }
  return false;
}


exports.teamWinsEverything = function (country, state) {
  // If no state is giving set it
  if (!state) {
    state = {
      table: [],
      matches: [],
    };
  }

  for (let i = 0; i < state.table.length; i++) {
    const local = state.table[i].name;
    for (let j = 0; j < state.table.length; j++) {
      const visit = state.table[j].name;
      if (local !== visit) {
        // const match = matchProvider.getMatch(local, visit);
        if (!matchPlayed(state.matches, local, visit)) {
          const status = 'downable';
          const winnerGoals = 2;
          const looserGoals = 0;
          if (local === country) {
            const fixedMatch = createAndAddMatch(local, visit, winnerGoals, looserGoals, status);
            addPoints(state, fixedMatch, i, j);
            state.matches.push(fixedMatch);
          } else if (visit === country) {
            const fixedMatch = createAndAddMatch(local, visit, looserGoals, winnerGoals, status);
            addPoints(state, fixedMatch, i, j);
            state.matches.push(fixedMatch);
          }
        }
      }
    }
  }
  state.table = sort(state.table);
  return state;
};


function simulate(state, local, visit, lIndex, vIndex) {
  const odds = oddProvider.getOdds(local, visit);
  const rand = Math.random();
  const status = 'simulated';
  const winnerGoals = 2;
  const looserGoals = 0;
  const drawGoals = 8;
  if (rand < odds.local) {
    const match = createAndAddMatch(local, visit, winnerGoals, looserGoals, status);
    addPoints(state, match, lIndex, vIndex);
    state.matches.push(match);
  } else if (rand < (odds.local + odds.draw)) {
    const match = createAndAddMatch(local, visit, drawGoals, drawGoals, status);
    addPoints(state, match, lIndex, vIndex);
    state.matches.push(match);
  } else {
    const match = createAndAddMatch(local, visit, looserGoals, winnerGoals, status);
    addPoints(state, match, lIndex, vIndex);
    state.matches.push(match);
  }
}

exports.playMissingMatches = function (state) {
  for (let i = 0; i < state.table.length; i++) {
    const local = state.table[i].name;
    for (let j = 0; j < state.table.length; j++) {
      const visit = state.table[j].name;
      if (local !== visit) {
        if (!matchPlayed(state.matches, local, visit)) {
          simulate(state, local, visit, i, j);
        }
      }
    }
  }

  state.table = sort(state.table);
  return state;
};


exports.isQualified = function (state, country, position) {
  //  if position is not defined, then set it to 5
  if (!position) {
    position = 5;
  }
  for (let i = 0; i < position; i++) {
    if (state.table[i].name === country) {
      return true;
    }
  }
  return false;
};

function getVisitTeam(match) {
  const local = match.local;
  let visit;
  for (let i = 0; i < Object.keys(match).length; i++) {
    if (Object.keys(match)[i] !== 'local' &&
      Object.keys(match)[i] !== 'status' &&
      Object.keys(match)[i] !== 'odds' &&
      Object.keys(match)[i] !== local) {
      visit = Object.keys(match)[i];
      return visit;
    }
  }
}


// exports.pushUp = function (match, team) {
//   const local = match.local;
//   const visit = getVisitTeam(match);
//   let otherTeam;
//   if (team === local) {
//     otherTeam = visit;
//   } else {
//     otherTeam = local;
//   }
//
//   if (match[team] < match[otherTeam]) {
//     match[team] = 3;
//     match[otherTeam] = 3;
//   } else if (match[team] === match[otherTeam]) {
//     match[team] = 4;
//     match[otherTeam] = 3;
//   }
// };


function changePoints(state, team, amount) {
  let found = false;
  for (let i = 0; i < state.table.length; i++) {
    if (state.table[i].name === team) {
      state.table[i].points += amount;
      found = true;
    }
  }
  if (!found) {
    throw new Error(`${team} not found. (in changePoints)`);
  }
}

exports.pullDown = function (state, match, team) {
  const local = match.local;
  const visit = getVisitTeam(match);
  let otherTeam;
  if (team === local) {
    otherTeam = visit;
  } else {
    otherTeam = local;
  }
  if (match[team] > match[otherTeam]) {
    match[team] = 3;
    match[otherTeam] = 3;
    changePoints(state, team, -3);
    changePoints(state, team, 1);
    changePoints(state, otherTeam, 1);
  } else if (match[team] === match[otherTeam]) {
    match[team] = 3;
    match[otherTeam] = 4;
    changePoints(state, team, -1);
    changePoints(state, otherTeam, -1);
    changePoints(state, otherTeam, 3);
    match.status = 'undownable';
  } else {
    match.status = 'undownable';
  }
};

exports.pushUp = function (state, match, team) {
  const local = match.local;
  const visit = getVisitTeam(match);
  let otherTeam;
  if (team === local) {
    otherTeam = visit;
  } else {
    otherTeam = local;
  }
  if (match[team] < match[otherTeam]) {
    match[team] = 6;
    match[otherTeam] = 6;
    changePoints(state, otherTeam, -3);
    changePoints(state, team, 1);
    changePoints(state, otherTeam, 1);
  } else if (match[team] === match[otherTeam]) {
    match[team] = 7;
    match[otherTeam] = 6;
    changePoints(state, team, -1);
    changePoints(state, otherTeam, -1);
    changePoints(state, team, 3);
  } else {
    throw new Error(`Cannot push up a match for ${team} because ${match[team]} is greater than ${match[otherTeam]}`);
  }
};


exports.getOddOfOccurance = function (match) {
  const local = match.local;
  const visit = getVisitTeam(match);
  if (match[local] > match[visit]) {
    return match.odds.local;
  }
  if (match[visit] > match[local]) {
    return match.odds.visit;
  }
  return match.odds.draw;
};

exports.filterDownableMatches = function (matches, country) {
  const downableMatches = [];
  for (let i = 0; i < matches.length; i++) {
    if (matches[i].status === 'downable' && (country in matches[i])) {
      downableMatches.push(matches[i]);
    }
  }
  return downableMatches;
};
