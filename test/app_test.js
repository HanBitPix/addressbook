'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

chai.should();
chai.use(chaiHttp);



describe('GET /', () => {
  it('Should Create 3 Sample Data', (done) => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        done();
      });
  });
});

describe('POST /contact/', () => {
  let testUser = {
    id: 'John Doe',
    first_name: 'John',
    last_name: 'Doe',
    address: {
      street: '7 Lucky Street',
      city  : 'New York',
      state: 'New York',
      zipcode: '04221'
    },
    phone_number: '4343349343',
    email: 'Sebastian.Carroll@gmail.com',
    birthday: {
      year: 1984,
      month: 4,
      day: 10
    }
  };

  it('Should Create A Test User', (done) => {
    chai.request(app)
      .post('/contact/')
      .send(testUser)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('result');
        res.body.should.have.property('_index');
        res.body.should.have.property('_id');
        res.body.should.have.property('_type');
        res.body.should.have.property('_version');
        done();
      });
  });
});

describe('GET /contact', () => {
  it('Get All Users', (done) => {
    chai.request(app)
      .get('/contact')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });
});


describe('GET /contact/:user', () => {
  it('Find A Specific User', (done) => {
    chai.request(app)
      .get('/contact/' + 'John Doe')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });
});


describe('PUT /contact/:user', () => {
  it('Updates a Specific User Successfully', (done) => {
    chai.request(app)
      .get('/contact/' + 'John Doe')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });
});

// describe('Delete /contact/:user', () => {
//   it('Deletes A Specific User Successfully', (done) => {
//     chai.request(app)
//       .delete('/contact/' + 'John Doe')
//       .end((err, res) => {
//         res.should.have.status(200);
//         res.body.should.be.a('object');
//         res.body.should.have.property('result').eql('deleted');
//         done();
//       });
//   });

//   it('Error When Deleting Non-existing User', (done) => {
//     chai.request(app)
//       .delete('/contact/' + 'Shark Tank')
//       .end((err, res) => {
//         res.should.have.status(404);
//         done();
//       });
//   });
// });