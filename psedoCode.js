// Fill with games already played
populateWithExistingMatches();

// Make chile win every game
teamWinsEverything('chile');

// Simulate n times

for (var i = 0; i < n; i++) {
    // Play the missing matches
  playMissingMatches();

  if (isQualified('chile')) {
        // get all the matches simulated, in this case should be only victories
    matches = getSimulatedMatches('chile');
    let iterator = 0;
    while (iterator < matches.length) {
            // Order the matches according of the posibility of the given outcome. [0] will be the one with the lower chance
      matchesSorted = sortByUnlikely(matches);

      length = matchesSorted.length;

            // If chile already lost the match then there is no need to pull it down. Then increase the iterator.
      while (hasLostTheMatch(matchesSorted[iterator], 'chile') && iterator < length)
        iterator++;

            // Exception control
      if (iterator >= length)
        break;

            // pullDown will make if chile won, then its a tie, if it was a tie then chile looses and if chile already looses it does nothing
      pullDown(matchesSorted[iterator], 'chile');

            // Check if it made it go un qualified
      if (!isQualified('chile')) {
                // Complete opposite of pullDown
        pushUp(matchesSorted[iterator], 'chile');
                // then matchesSorted[iterator] cannot be pulled down anymore, so we increase the iterator
        iterator++;
      } else {
                // Not sure about these, but as you have change a result maybe result that before werent able to be pull further down, otherwise it would have meant the disqualification of 'chile' now can be pulled down.
        iterator = 0;
      }
    }
  } else {
    print('There is no way that chile will qualify');
  }

  simulation[i] = getAllMatches();
}


amountOfNotQualified = 0;

// not filled matches
matches = getVirginMatches();

for (var i = 0; i < simulation.length; i++) {
    // count how many times it does qualified
  if (isQualified(simulation[i], 'chile'))
    amountOfNotQualified++;
  else {
    for (let j = 0; j < simulation[i].length; j++) {
      local = getLocal(simulation[i][j]);
      visit = getVisit(simulation[i][j]);
      result = getResult(simulation[i][j]);
        // count how many times is a victory for the local, draw or defeat for the local
      matches[local][visit][result]++;
    }
  }
}

print(`Times not qualified: ${amountOfNotQualified}`);
print(getMatchesOf(matches, 'chile'));
