// Layer:2 Data-access/providerAccess.js

const fs = require('fs');

let odds;


function getAllOdds(callback) {
  fs.readFile('odds.js', 'utf8', (err, data) => {
    if (err) {
      callback(err);
    }

    let odds = {};
    try {
      odds = JSON.parse(data);
    } catch (e) {
      odds = {};
    }
    callback(null, odds);
  });
}

exports.initialize = function () {
  return new Promise((resolve, reject) => {
    getAllOdds((err, m) => {
      if (err) {
        reject(err);
      }
      odds = m;
      resolve();
    });
  });
};

exports.getOdds = function (local, visit) {
  if (odds[local] && odds[local][visit]) {
    const total = odds[local][visit].local + odds[local][visit].visit + odds[local][visit].draw;
    return {
      local: odds[local][visit].local / total,
      visit: odds[local][visit].visit / total,
      draw: odds[local][visit].draw / total,
    };
  }
  return {
    local: 0.5,
    draw: 0.3,
    visit: 0.2,
  };
};
