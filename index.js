const path = require('path')
const express = require('express')
const exphbs = require('express-handlebars')
var request = require('request')
var _ = require('lodash')
var async = require("async")

const app = express()

var requests = [
  {url: 'https://jsonplaceholder.typicode.com/users'},
  {url: 'https://jsonplaceholder.typicode.com/posts'}
]

var usersList, postsList

app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views/layouts')
  }))

app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, 'views'))


async.map(requests,(obj, callback) => {
  request(obj, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var body = JSON.parse(body)
      callback(null, body)
    } else {
      callback(error || response.statusCode)
    }
  });
}, (err, results) => {
  if (err) {
    console.log(err)
  } else {
    for (var i = 0; i < results.length; i++) {
      usersList = results[0]
      postsList = results[1]
    }
  }
});

app.get('/',(req, res) => {
  res.render('home', {
      users: usersList,
    })
});

app.listen(3000);