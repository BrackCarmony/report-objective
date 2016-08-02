'use strict';

var jwt = require('jsonwebtoken');
var axios = require('axios');

var _config = {
  url: "http://localhost:3000",
  app: "Demo App",
  appSecret: "8qym1WkSEgpR0jqRjCmmAJB8KyJk9BqO"
};

function success(response) {
  // console.log("Success:", response);
  // console.log("Success:", response.data);
  // console.log("Success:", response.data.data.length);
  return response.data.data;
}

function failure(err) {
  console.log("Error:", err);
  return err;
}

function sign(record) {
  return jwt.sign(record, _config.appSecret);
}

function post(coded) {
  return axios.post(_config.url + "/records", { token: coded, application: _config.app }).then(success).catch(failure);
}

function readTrackables(coded) {
  return axios.get(_config.url + ('/trackables?token=' + coded + '&application=' + _config.app)).then(success).catch(failure);
}

function readRecords(coded) {
  return axios.get(_config.url + ('/records?token=' + coded + '&application=' + _config.app)).then(success).catch(failure);
}

function _createTrackable(coded) {
  return axios.post(_config.url + "/trackables", { token: coded, application: _config.app }).then(success).catch(failure);
}

function _updateTrackable(coded) {
  return axios.patch(_config.url + "/trackables/null", { token: coded, application: _config.app }).then(success).catch(failure);
}

module.exports = {
  report: function report(record) {
    return post(sign(record));
  },
  config: function config(options) {
    Object.assign(_config, options);
    return Object.assign({}, _config);
  },
  getTrackables: function getTrackables(query) {
    return readTrackables(sign(query));
  },
  getRecords: function getRecords(query) {
    return readRecords(sign(query));
  },
  createTrackable: function createTrackable(query) {
    return _createTrackable(sign(query));
  },
  updateTrackable: function updateTrackable(query) {
    return _updateTrackable(sign(query));
  },
  getRecordsForTrackables: function getRecordsForTrackables(query) {
    var trackableQuery = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];


    var promise = new Promise(function (resolve, reject) {
      readTrackables(sign(query)).then(function (response) {
        var trackables = response;
        var count = 0;
        trackables.forEach(function (trackable) {
          trackableQuery._trackable = trackable._id;
          readRecords(sign(trackableQuery)).then(function (response) {
            trackable.records = response;
            count++;
            if (count == trackables.length) {
              resolve(trackables);
            }
          });
        });
      });
    });
    return promise;
  }
};