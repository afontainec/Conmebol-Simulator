// Layer:2 Data-access/providerAccess.js

const fs = require('fs');

let matches;

exports.getTeams = function () {
  return [{
    name: 'chile',
    points: 0,
  }, {
    name: 'argentina',
    points: 0,
  }, {
    name: 'bolivia',
    points: 0,
  }, {
    name: 'peru',
    points: 0,
  }, {
    name: 'paraguay',
    points: 0,
  }, {
    name: 'uruguay',
    points: 0,
  }, {
    name: 'venezuela',
    points: 0,
  }, {
    name: 'colombia',
    points: 0,
  }, {
    name: 'ecuador',
    points: 0,
  }, {
    name: 'brasil',
    points: 0,
  }];
};


function getMatches(callback) {
  fs.readFile('matches.js', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      callback(err);
    }

    let matches = {};
    try {
      matches = JSON.parse(data);
    } catch (e) {
      matches = {};
    }
    callback(null, matches);
  });
}

exports.initialize = function () {
  return new Promise((resolve, reject) => {
    getMatches((err, m) => {
      if (err) {
        reject(err);
      }
      matches = m;
      resolve();
    });
  });
};

// exports.matchInState = function (state, local, visit) {
//   for (let i = 0; i < state.matches.length; i++) {
//     if (local in state.matches[i] && visit in state.matches[i]
//        && state.matches[i].local === local) {
//       console.log('pillado');
//       return true;
//     }
//   }
//   return false;
// };

exports.getMatch = function (local, visit) {
  if (matches[local] && matches[local][visit]) {
    const match = matches[local][visit];
    match.local = local;
    return matches[local][visit];
  }
  return false;
};
