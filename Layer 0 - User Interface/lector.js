#!/usr/bin/env node

const program = require('commander');


const interpreter = require('../Layer 1 - Business Logic/interpreter');

program
  .version('0.0.1');


// / simulate

program
  .command('max-fifth')
  .alias('max')
  .description('get all the repositories of a particular organization')
  .option('-n, --number [n]', 'number of times to simulate')
  .action((options) => {
    interpreter.maxFifth(options.number);
  });

program
  .command('qualify')
  .alias('q')
  .description('get all the repositories of a particular organization')
  .option('-n, --number [n]', 'number of times to simulate')
  .option('-c, --country [country]', 'country to qualify')
  .option('-r, --round [round]', 'round from which start to simulate the matches')
  .option('-m, --mode [mode]', 'mode to select match to pull down')
  .action((options) => {
    interpreter.simulteToQualify(options.number, options.country, {
      round: options.round,
      mode: options.mode,
    });
  });


program
  .on('--help', () => {
    console.log('  For the RF requested:');
    console.log();
    console.log(' RF2:');
    console.log('    $ saffie repositories github -o rails');
    console.log(' RF3:');
    console.log('    $ saffie has-repository github -o rails');
    console.log('    $ saffie last-commits github -o github');
    console.log();
  });

program
  .command('*')
  .action((env) => {
    console.log('Command does not exists "%s"', env);
  });

program.parse(process.argv);
