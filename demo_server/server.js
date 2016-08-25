var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var port = 8878;
app.use(bodyParser.json());


//bring in the reportObjective;
const reportObjective = require('../src/index.js');
  //Configure the report connection as needed
reportObjective.config({
  url:"http://localhost:5757",
  app:"Demo App",
  appSecret:"8qym1WkSEgpR0jqRjCmmAJB8KyJk9BqO"
});

  //Example Reporting call
app.post('/api/record', (req, res)=>{
  /*//////////////////////////////////
  {trackable: 'Name of Trackable',
  user:'DevMountain User ID',
  quantifier:'Number describing how good te record is',
  note:'Note for record.',
  witness:'Devmountain ID of witness'}
  //////////////////////////////////*/
  reportObjective.report(
    req.body
  ).then(response=>res.send(response));
})

// reportObjective.getTrackables({name:["d","b","c","a"]}).then(function(r){
//   var trackables = r.map(i=>i._id);
//   reportObjective.createTrack({
//     _trackables:trackables,
//     name:"Track the first",
//     description:"The track to end all tracks",
//     application:reportObjective.config.app
//   }).then(console.log);
// });

// reportObjective.getTracks({})
//   .then(console.log)
// reportObjective.getRecordsForTrack({},{})
//   .then(function(response){
//     console.log("Why no fire?");
//     console.log(response);
//     console.log(response._trackables);
//   });

// reportObjective.createTrack({
//   name:"My New Trackable",
//
//   trackables:["a","b","c","dead on arrival"]
// })

// reportObjective.createTrackable({
//   name:"b",
//   description:"Student Does the B thingy To Be The B-iest B"
// })

// reportObjective.getRecordsForTrackables({
//   name:'a'
// },{user:1772}).then(function(response){
//   console.log(response);
// })

// reportObjective.report(
//   {trackable:'a',
//   user:1773,
//   quantifier:2,
//   note:"Note are awesome",
//   witness:666}
// ).then(response=>{console.log('resp',response);}).catch(err=>{console.log('err',err)});

// console.log(reportObjective.createTrack({
//   name:'trackName',
//   description:'This is a demo Track',
//   trackables:['a','b','c','d']
// }));



  //Example Get Trackables
app.get('/api/trackables', (req, res) =>{
  reportObjective.getTrackables(req.query).then((response)=>{
    res.send(response);
  });
})

  //Example Get Records
app.get('/api/records', (req, res) =>{
  reportObjective.getRecords(req.query).then((response)=>{
    res.send(response);
  });
})

app.post('/api/trackables', (req, res)=>{
  reportObjective.createTrackable(req.body).then((response)=>{
    res.send(response);
  });
})

  //Example Get Records By Trackable.
  //Uses 2 queries, the first describes the tracks you are looking for
  // The second can filter down the records for those tracks.
app.get('/api/recordsByTrackable', (req, res) =>{
  reportObjective.getRecordsForTrackables({name:'cheese'}, {}).then((response)=>{
    res.send(response);
  });
})

app.get('/api/recordsByTrack', (req, res)=>{
  var trackQuery = {};
  var userQuery = {};
  reportObjective.getRecordsForTrackables({name:'cheese'}, {}).then((response)=>{
    res.send(response);
  });
})

// reportObjective.getRecordsForTrackables({name:'cheese'}, {}).then((response)=>{
//   console.log(response);
//   res.send(response);
// });

// reportObjective.getTracks({name:"Track the first"})
// .then(console.log)



app.listen(port, function(){
  console.log("Listening on Port:", port);
});
