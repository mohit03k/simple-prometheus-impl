import express, { NextFunction, Request, Response } from "express"
import { requestCount } from "./monitoring/requesCount";
import client from "prom-client"
const app = express();

app.use(requestCount)

// every time /user is hit . requestCount middleware is hit. which increase the request counter and obserce the request to create histogram
app.get("/user", (req, res) => {
  res.json({
    name: "user1",
    some: "update code"
  })
})

app.get("/metrics", async (req, res) => {
  const metrics = await client.register.metrics() // this will export all metrics 
  res.set('Content-Type', client.register.contentType)
  res.end(metrics) // this is to end the request and give client no data. u can give it optionally like here we doing 
  // but before that we need to define the type of content using res.set() that we doing above
})

app.use('/user', (req, res) => {
  const app = req.body
  const startTime = Date.now()
})

app.listen(3000) 
