#!/usr/local/bin/node

'use strict';

var http = require('http');
require('date-utils');

var project = process.argv[2],
    period = process.argv[3],
    dlUrl = 'http://isaacs.iriscouch.com/downloads/_design/app/_view/pkg?',
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
http.get(
  dlUrl +
  'startkey=["' + project + '", "' + from + '"]' +
  '&endkey=["' + project + '", "' + to + '"]',
  function(response) {
    var data = [];

    response.on('data', function(chunk) {
      data.push(chunk);
    })

    response.on('end', function() {
      console.log(JSON.parse(data.join('')).rows[0].value);
    });
  }
);
