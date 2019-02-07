'use strict';

const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const elastic = require('./elasticsearch');
const PORT = 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


// Sample Data Parse
function indexData(){
  const addressbookRaw = fs.readFileSync('../data/addressbook.json');
  const addressbook = JSON.parse(addressbookRaw);
  console.log(`${addressbook.length} items parsed from data file`);
  elastic.bulkIndex('addressbook', 'contact', addressbook);
}

/****************  
  *** Get Sample Data ***
************** */
app.get('/', (req, res) => {
  res.send(indexData());
});

/****************  
  *** Creates a User ***
************** */
app.post('/contact/:name', (req, res) => {
  elastic.createUser(req,res);
});


/****************  
  *** Get a User ***
************** */
app.get('/contact/:name', (req, res) => {
  elastic.getUser(req,res);
});

/****************  
  *** Get a Users ***
************** */
app.get('/contact', (req, res) =>{
  elastic.getAllUsers(req, res);
});

/****************  
  *** Update a User ***
************** */
app.put('/contact/:name', (req, res) => {
  elastic.updateUser(req, res);
});

/****************  
  *** Delete a User ***
************** */
app.delete('/contact/:name', (req, res) => {
  elastic.deleteUser(req,res);
});

/****************  
  *** Deletes all Indices ***
************** */
app.delete('/delete', (req,res) => {
  elastic.deleteIndedx(req,res);
});


app.listen(PORT, function() {
  console.log('Server is running on PORT:',PORT);
});

