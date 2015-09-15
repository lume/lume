let colors = {
  error: 'color: red; font-weight: bold;',
  warn: 'color: #995500;',
  info: 'font-weight: bold;',
  debug: 'color: blue;',
  trace: 'color: grey;'
};

let log = {
  level: 'info',
  levels: [ 'error', 'warn', 'info', 'debug', 'trace' ],

  showLevel: function(level) {
    return this
      .levels.slice(0, this.levels.indexOf(this.level) + 1) // all current levels
      .indexOf(level) !== -1;
  },

  out: function(level, ...args) {
    if (!this.showLevel(level))
      return;

    let prepend = "%c [famin] " + level + ': ';

    if (typeof args[0] === 'string')
      args[0] = prepend + args[0];
    else
      args.splice(0, 0, prepend);

    args.splice(1, 0, colors[level]);

    console.log.apply(console, args);
  }
}

for (let i = 0; i < log.levels.length; i++)
  log[log.levels[i]] = log.out.bind(log, log.levels[i]);

export default log;
