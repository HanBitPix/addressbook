'use strict';
const elasticsearch = require('elasticsearch');

// Creates starts the Elastic Client along with log trace
const client = new elasticsearch.Client({
  host: '127.0.0.1:9200',
  log: 'trace'
});

// Notifies if there was an error if not passes
client.ping({ requestTimeout: 30000 }, function(error) {
  if (error) {
    console.error('elasticsearch cluster is down!');
  } else {
    console.log('Everything is ok');
  }
});

module.exports = {
  // Creates a Simple User
  createUser: (req, res) => {
    client.create({
      index: 'addressbook',
      type: 'contact',
      id: req.body.id,
      body: {
        id: req.body.id,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        address: {
          street: req.body.address.street,
          city  : req.body.address.city,
          state: req.body.address.state,
          zipcode: req.body.address.zip
        },
        phone_number: req.body.phone_number,
        email: req.body.email,
        birthday: {
          year: req.body.birthday.year,
          month: req.body.birthday.month,
          day: req.body.birthday.day
        }
      }
    }).then((resp) => {
      console.log(resp);
      res.send(resp);
    }).catch((err) => {
      console.trace(err.message);
      res.send(err.message);
    });
  },

  // Get One Specific User
  getUser: (req, res) => {
    client.get({
      index: 'addressbook',
      type: 'contact',
      id: req.params.name
    }).then((resp) => {
      console.log(resp);
      res.send(resp);
    }).catch((err) => {
      console.trace(err.message);
      res.status(404).send('No User Found!');
    });
  },

  // Get All User
  getAllUsers: (req, res) => {
    client.search({
      index: 'addressbook',
      q: req.query.q,
      body: {
        size: req.query.pageSize,
        from: req.query.page
      }
    }).then((resp) => {
      console.log(resp);
      res.send(resp);
    }).catch((err) => {
      console.trace(err.message);
      res.send(err.message);
    });
  },
  // Updates a User
  updateUser: (req, res) => {
    client.update({
      index: 'addressbook',
      type: 'contact',
      id: req.params.name,
      body: {
        doc: {
          first_name: req.query.name
        }
      }
    }).then((resp) => {
      console.log(resp);
      res.send(resp);
    }).catch((err) => {
      console.trace(err.message);
      res.status(404).send('User was not found to update!');
    });
  },
  // Deletes a User
  deleteUser: (req, res) => {
    client.delete({
      index: 'addressbook',
      type: 'contact',
      id: req.params.name
    }).then((resp) => {
      console.log(resp);
      res.send(resp);
    }).catch((err) => {
      console.trace(err.message);
      res.status(404).send('User was not found to delete!');
    });
  },
  // Deletes all indices
  deleteIndedx: (req, res) => {
    client.indices.delete({index: '_all'}, function(error) {
      if (error) {
        console.error('INDEX WAS NOT DELETED');
        res.send('INDEX WAS NOT DELETED');
      } else {
        console.log('Indices Has been cleared');
        res.send('Indices Has been cleared');
      }
    });
  },

  // Bulk Upload Data
  bulkIndex: (index, type, data) => {
    let bulkBody = [];
  
    data.forEach(item => {
      bulkBody.push({
        index: {
          _index: index,
          _type: type,
          _id: item.id
        }
      });
  
      bulkBody.push(item);
    });
  
    client.bulk({body: bulkBody})
      .then(response => {
        let errorCount = 0;
        response.items.forEach(item => {
          if (item.index && item.index.error) {
            console.log(++errorCount, item.index.error);
          }
        });
        console.log(
          `Successfully indexed ${data.length - errorCount}
          out of ${data.length} items`
        );
      })
      .catch(console.err);
  }
};