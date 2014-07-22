"use strict";

module.exports = function(req, res, next) {
  res.etaggable = function(etag, isStaleCallback) {
    if (!etag) {
      throw new Error('Etag required');
    }

    res.set({ 'ETag': etag });

    // 304 Not Modified
    if (req.fresh) {
      // remove content headers
      if (res._headers) {
        Object.keys(res._headers).forEach(function(header) {
          if (header.indexOf('content') === 0) {
            res.removeHeader(header);
          }
        });
      }

      res.statusCode = 304;
      return res.end();
    } else {
      // load dynamic content now
      isStaleCallback();
    }
  };

  next();
};
