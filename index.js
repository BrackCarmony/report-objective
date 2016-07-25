var jwt = require('jsonwebtoken');
var axios = require('axios');

var coded = jwt.sign({
  trackable:"pizza",
  user:1776,
  note:"Delete Me",
  quantifier:1,
  witness:24602,
  }, 'gx6RAi9OScT3Q4qwDym0IE88GQhvmE8d');

var config = {
  url:"http://localhost:3000",
  app:"Demo App",
  appSecret:"8qym1WkSEgpR0jqRjCmmAJB8KyJk9BqO"
};

function success(response){
  // console.log("Success:", response);
  // console.log("Success:", response.data);
  // console.log("Success:", response.data.data.length);
  return response.data.data;
}

function failure(err){
  console.log("Error:", err);
  return err;
}

function sign(record){
  return jwt.sign(record, config.appSecret);
}

function post(coded){
  return axios.post(config.url + "/records",{token:coded, application:config.app})
  .then(success)
  .catch(failure)
}

function readTrackables(coded){
  return axios.get(config.url+`/trackables?token=${coded}&application=${config.app}`)
  .then(success)
  .catch(failure)
}

function readRecords(coded){
  return axios.get(config.url+`/records?token=${coded}&application=${config.app}`)
  .then(success)
  .catch(failure)
}

function createTrackable(coded){
  return axios.post(config.url + "/trackables",{token:coded, application:config.app})
  .then(success)
  .catch(failure)
}

function updateTrackable(coded){
  return axios.patch(config.url + "/trackables/null",{token:coded, application:config.app})
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
    return readTrackables(sign(query));
  },
  getRecords:function(query){
    return readRecords(sign(query));
  },
  createTrackable:function(query){
    return createTrackable(sign(query));
  },
  updateTrackable:function(query){
    return updateTrackable(sign(query));
  },
  getRecordsForTrackables:function(query, trackableQuery ={}){

    var promise = new Promise((resolve, reject)=>{
      readTrackables(sign(query)).then(response=>{
        var trackables = response;
        var count =0;
        trackables.forEach(trackable => {
            trackableQuery._trackable = trackable._id;
          readRecords(sign(trackableQuery)).then(response =>{
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
  }
}
