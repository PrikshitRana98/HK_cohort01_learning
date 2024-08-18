const express = require("express");
const responseTime = require('response-time')
const app = express();
const PORT = 3000;

 const measureRequestDuration = (req, res, next) => {
  const start = Date.now();
  res.once('finish', () => {
      const duration = Date.now() - start; 
      console.log("Time taken to process " + req.originalUrl + " is: " + 
    duration);
     });
   next();
  };

  app.use(measureRequestDuration);
  app.use(express.json())
  app.use(responseTime())

let numberOfRequest=0;

function calculateReqNum(req, res, next){
numberOfRequest++;
next();
}

function userMiddleware(req, res, next) {
  const username = req.headers.username;
  const password = req.headers.password;

  if (!(username === "harkirat" && password === "pass")) {
    res.status(403).json({
      msg: "invalid credinential! ",
    });
  } else {
    next();
  }
}

function kidneyMiddleware(req, res, next) {
  const kidneyId = req.query.kidneyId;
  console.log(req.query)
  if (!(kidneyId == 1 || kidneyId == 2)) {
    res.status(411).json({
      msg: "bad input! Some thing went wrong with input",
    });
  } else {
    next();
  }
}

app.get(
  "/health-checkup",calculateReqNum,userMiddleware,kidneyMiddleware,
  function (req, res) {
    res.status(200).json({
      kidneyId:parseInt(req.query.kidneyId),
      msg: "Your kidney id fine!",
    });
  }
);

app.put(
  "/replace-kidney",
  calculateReqNum,
  userMiddleware,
  kidneyMiddleware,
  function (req, res) {
    res.json({
      msg: "Your kidbey replacemnt is ok id fine!",
    });
  }
);

app.get("/heart-check", calculateReqNum,userMiddleware, function (req, res) {
  res.json({
    msg: "Your hearst id fine!",
  });
});

app.get("/totalRequest", function (req, res) {
  res.json({
    msg: "success",
    totalRequest:numberOfRequest,
  });
});

app.listen(PORT, function (err) {
  if (err) console.log("Error in server setup");
  console.log("Server listening on Port", PORT);
});
