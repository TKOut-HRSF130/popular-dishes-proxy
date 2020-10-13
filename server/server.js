const express = require('express');
const path = require('path');
const http = require('http');
const axios = require('axios');
const app = express();
const port = 3004;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '/../public')));

const cb = (res, resProxy) => {
  let data = '';

  res.on('data', d => {
    data += d
  })
  res.on('end', () => {
    resProxy.send(data);
  })
};

app.get('/:id', (req, res) => {
  res.sendFile(path.join(__dirname, '/../public/index.html'))
});

// ======================================DISHES================================
app.get('/api/dishes/restaurant/:id', (reqProxy, resProxy) => {
  http.get(`http://ec2-54-67-110-162.us-west-1.compute.amazonaws.com/api/dishes/restaurant/${reqProxy.params.id}`, (res) => {
    cb(res, resProxy);
  });
});

// ==================================BOOKINGS==================================
app.get('/api/bookings/restaurantName/:id', (reqProxy, resProxy) => {
  http.get(`http://ec2-54-176-143-236.us-west-1.compute.amazonaws.com/api/bookings/restaurantName/${reqProxy.params.id}?restaurantId=${reqProxy.params.id}`, (res) => {
    cb(res, resProxy);
  });
});

app.get('/api/bookings/:id', (reqProxy, resProxy) => {
  axios.get(`http://ec2-54-176-143-236.us-west-1.compute.amazonaws.com/api/bookings/${reqProxy.params.id}`, {
    params: reqProxy.query
  })
    .then((response) => {
      resProxy.status(200).send(response.data)
    });
});


app.post('/api/bookings/:id', (reqProxy, resProxy) => {
  const reservation = reqProxy.body;
  reservation.restaurantId = reqProxy.params.restaurantId;
  axios.post(`http://ec2-54-176-143-236.us-west-1.compute.amazonaws.com/api/bookings/${reqProxy.params.id}`, reqProxy.body)
    .then((response) => {
      resProxy.send(response)
    })
});

// ========================================PHOTOS====================================
app.get('/api/restaurants/photos/:id', (reqProxy, resProxy) => {
  http.get(`http://ec2-34-201-104-34.compute-1.amazonaws.com/api/restaurants/photos/${reqProxy.params.id}?restaurant_id=${reqProxy.params.id}`, (res) => {
    cb(res, resProxy);
  });
});
// ====================================REVIEWS=======================================
app.get('/api/restaurants/:id', (reqProxy, resProxy) => {
  http.get(`http://ec2-13-52-220-189.us-west-1.compute.amazonaws.com/api/restaurants/${reqProxy.params.id}`, (res) => {
    cb(res, resProxy);
  });
});

app.get('/api/review_list/:id', (reqProxy, resProxy) => {
  http.get(`http://ec2-13-52-220-189.us-west-1.compute.amazonaws.com/api/review_list/${reqProxy.params.id}`, (res) => {
    cb(res, resProxy);
  });
});

// ==================================================================================
app.listen(port, () => {
  console.log(`Proxy running at http://localhost:${port}`);
});