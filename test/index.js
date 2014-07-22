"use strict";

var etaggable = require('../');
var express = require('express');
var app = express();
var etag = '4ALOzWNKcFh6OImOu5t68l0C2os=';

var getEtag = function(key, cb) {
  return setImmediate(function() {
    cb(null, etag);
  });
};

app.get('/cached-data', etaggable, function(req, res, next) {
  getEtag('cached-data', function(err, etag) {
    if (err) { return next(err); }

    res.etaggable(etag, function() {
      // the second time you visit the page this won't get called
      res.send('Big content loaded from database/cache/filesystem here.');
    });
  });
});

var request = require('supertest');

describe('express-etaggable', function() {
  it('should set the etag', function(done) {
    request(app)
      .get('/cached-data')
      .expect('Etag', etag)
      .expect(200)
      .end(function(err, res) {
        if (err) throw err;

        done();
      });
  });

  it('should respond with not modified', function(done) {
    request(app)
      .get('/cached-data')
      .set('If-None-Match', etag)
      .expect(304)
      .end(function(err, res) {
        if (err) throw err;

        done();
      });
  });
});
