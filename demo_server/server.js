var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var port = 8878;
app.use(bodyParser.json());


//bring in the reportObjective;
const reportObjective = require('../index.js');
  //Configure the report connection as needed
reportObjective.config({
  url:"http://localhost:3000",
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

reportObjective.report(
  {trackable:'cheese',
  user:1771,
  quantifier:2,
  note:"Note are awesome",
  witness:666}
).then(response=>{console.log('resp',response);}).catch(err=>{console.log('err',err)});


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

app.put('/api/trackables', (req, res)=>{
  reportObjective.updateTrackable(req.body).then((response)=>{
    res.send(response);
  });
})


  //Example Get Records By Trackable.
  //Uses 2 queries, the first describes the tracks you are looking for
  // The second can filter down the records for those tracks.
app.get('/api/recordsByTrackable', (req, res) =>{
  console.log(req.query);
  reportObjective.getRecordsForTrackables({name:'cheese'}, {}).then((response)=>{
    console.log(response);
    res.send(response);
  });
})



app.listen(port, function(){
  console.log("Listening on Port:", port);
});
