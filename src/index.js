require("babel-polyfill");
var jwt = require('jsonwebtoken');
var axios = require('axios');
var ObjectId= require('mongoose').Types.ObjectId;

var config = {
  url:"http://localhost:5757",
  app:"Demo App",
  appSecret:"8qym1WkSEgpR0jqRjCmmAJB8KyJk9BqO"
};

function toObjectId(id) {
    var stringId = id.toString().toLowerCase();
    if (!ObjectId.isValid(stringId)) {
      return null;
    }
    var result = new ObjectId(stringId);
    if (result.toString() != stringId) {
      return null;
    }
    return result;
}

function success(response){
  if (response.data.data) return response.data.data;
  return response.data;
}

function failure(err){
  console.log("Error:", err);
  return err;
}

function sign(record){

  var signed = jwt.sign(record, config.appSecret);
  var decoded = jwt.verify(signed, config.appSecret);
  return signed;
}

function post(coded){
  return axios.post(config.url + "/api/recordTrackable",
  {token:coded, application:config.app})
  .then(success)
  .catch(failure)
}

function readTrackables(coded){
  return axios.get(config.url+`/api/readTrackable?token=${coded}
    &application=${config.app}`)
  .then(success)
  .catch(failure)
}

function readRecords(coded){
  return axios.get(config.url+`/api/readRecord?token=${coded}
    &application=${config.app}`)
  .then(success)
  .catch(failure)
}

function createTrackable(coded){
  return axios.post(config.url + "/api/createTrackable",
  {token:coded, application:config.app})
  .then(success)
  .catch(failure)
}

function createTrack(track){
  return axios.post(config.url + "/api/createTrack",
  {token:track, application:config.app})
  .then(success)
  .catch(failure)
}

function readTracks(coded){
  return axios.get(config.url+`/tracks?token=${coded}
    &application=${config.app}`)
  .then(success)
  .catch(failure)
}

module.exports = {
  report:function(record){
    return post(sign(record));
  }
  ,config:function(options){
    Object.assign(config, options);
    return Object.assign({}, config);
  },
  getTrackables:function(query){
    if(!query.name) return new Error("Must supply name property.  Either the name of the trackable, or an array of names")
    if(Array.isArray(query.name)) query.name = {$in:query.name};
    return readTrackables(sign(query));
  },
  getRecords:function(query){
    return readRecords(sign(query));
  },
  createTrackable:function(query){
    return createTrackable(sign(query));
  },
  createTrack:function(query){
    if (!query.name) return new Error("name required for track");
    if (!query.trackables||query.trackables.length<2)
      return new Error("Property trackables required to be an array of at least 2 trackables");

    return createTrack(sign(query));

  },
  getRecordsForTrackables:function(query, recordQuery ={}){
    var promise = new Promise((resolve, reject)=>{
      readTrackables(sign(query)).then(response=>{
        var trackables = response;
        var count =0;
        trackables.forEach(trackable => {
          recordQuery._trackable = trackable._id;
          readRecords(sign(recordQuery)).then(response =>{
              trackable.records = response;
              count++;
              if(count == trackables.length){
                resolve(trackables);
              }
            }
          );
        })
      });
    })
    return promise;
  },
  getTracks(query){
    return readTracks(sign(query));
  },
  getRecordsForTrack(trackQuery, recordQuery){
    trackQuery.$populate = '_trackables';
    var promise =  new Promise((resolve, reject)=>{
      readTracks(sign(trackQuery)).then(response =>{
        // Possible TODO extend to work with multiple tracks at once
        var trackables = response[0]._trackables
        var count = 0;
        trackables.forEach(trackable => {
          recordQuery._trackable = trackable._id;
          readRecords(sign(recordQuery)).then(resp => {
            // console.log ("response", response);
            trackable.records = resp;
            count++;
            if(count == trackables.length){
              console.log("lg",response[0]);
              resolve(response[0]);
            }
          });
        })
      })
    });
    return promise;
  }
}
