const express = require('express');
const app = express();
const dog = require('./routes/dogs')
app.use(express.json())
require(dotenv).configure()

app.use('/static', express.static('assets'));

// require('express-asnyc-errors')
// For testing purposes, GET /

const logger = (req, res, next) => {

  console.log(`${req.method} ${req.url}`)
  res.on('finish', () => {
    console.log(`Status: ${res.statusCode}`)
  });
  next()
}

app.use(logger)

app.get('/', (req, res) => {
  res.json("Express server running. No content provided at root level. Please use another route.");
});
// For testing express.json middleware
app.post('/test-json', (req, res, next) => {
  // send the body as JSON with a Content-Type header of "application/json"
  // finishes the response, res.end()
  res.json(req.body);
  next();
});

// For testing express-async-errors
app.get('/test-error', async (req, res) => {
  throw new Error("Hello World!")
});
app.use("/dogs", dog)

app.use((req, res, next) => {
  const err = new Error(`Error, requested resource could not be found`)
  err.statusCode = 404
  throw err;
})

app.use((err, req, res, next) => {

  const response = {
    statusCode: err.statusCode || 500,
    message: err.message || "something went wrong",
    stack: process.env.NODE_ENV ==="production" ? undefined : err.stack
  }
  console.log(err);
  res.status(err.statusCode)
  res.json(response)
})

const port = 5000;
app.listen(port, () => console.log('Server is listening on port', port));
