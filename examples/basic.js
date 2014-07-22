"use strict";

var etaggable = require('../');
var express = require('express');
var app = express();

var getEtag = function(key, cb) {
  return setImmediate(function() {
    cb(null, '4ALOzWNKcFh6OImOu5t68l0C2os=');
  });
};

app.get('/cached-data', etaggable, function(req, res, next) {
  getEtag('cached-data', function(err, etag) {
    if (err) { return next(err); }

    res.etaggable(etag, function() {
      // the second time you visit the page this won't get called
      console.log('loading dynamic content');
      res.send('Big content loaded from database/cache/filesystem here.');
    });
  });
});

app.listen(process.env.PORT || 7777);
