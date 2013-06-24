#!/usr/local/bin/node

'use strict';

require('date-utils');

var project = process.argv[2],
    period = process.argv[3],
    from,
    to;


// create from and to date
({
  'current-month': function() {
    this['past-month'](0);
  },
  'current-week': function() {
    var now = new Date();

    from = now.addDays(-now.getDay()).toYMD();
    to = Date.yesterday().toYMD();
  },
  'last-month': function() {
    this['past-month'](1);
  },
  'last-week': function() {
    this['past-week'](1);
  },
  '_month': function(year, month) {
    from = (new Date(year, month, 1)).toYMD();
    to = (new Date(year, month, Date.getDaysInMonth(year, month))).toYMD();
  },
  'past-month': function(month) {
    var now = (new Date()).addMonths(-month);

    this._month(now.getFullYear(), now.getMonth());
  },
  'past-week': function(amount) {
    var now = new Date();

    to = now.addDays(-(now.getDay() + (7 * (amount - 1))));
    from = to.clone().addDays(-6).toYMD();
    to = to.toYMD();
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
