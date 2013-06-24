#!/usr/local/bin/node

'use strict';

require('date-utils');

var project = process.argv[2],
    period = process.argv[3],
    from,
    to;


// create from and to date
({
  'last-month': function() {
    this['past-month'](1);
  },
  '_month': function(year, month) {
    from = (new Date(year, month, 1)).toYMD();
    to = (new Date(year, month, Date.getDaysInMonth(year, month))).toYMD();
  },
  'past-month': function(month) {
    var now = (new Date()).addMonths(-month);

    this._month(now.getFullYear(), now.getMonth());
  },
  'current-month': function() {
    this['past-month'](0);
  },
  'today': function() {
    from = Date.today().toYMD();
    to = from;
  },
  'yesterday': function() {
    from = Date.yesterday().toYMD();
    to = from;
  }
})[period](process.argv[4]);


// get stats from npm registry
(new (require('cushion').Connection)(
  'isaacs.iriscouch.com',
  80
)).database('downloads').view('app', 'pkg', {
  'startkey': JSON.stringify([project, from]),
  'endkey': JSON.stringify([project, to])
}, function(error, result, info) {
  if (!error && info && info[0] && info[0].value) {
    console.log(info[0].value);
  } else {
    console.log('N/A');
  }
});
