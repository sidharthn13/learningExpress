const express = require("express");
const fs = require("fs");
const uuid = require("uuid");
server = express();

const exampleJson = { name: "sid", age: "22" }; //example data for running tests
let dataInJson; //for write/append operations

//middleware functions
server.use(express.json());
server.use(express.urlencoded());

server.get("/", (req, res) => {
  res.end("Welcome to landing page, this is a test");
});
server.get("/test", (req, res) => {
  const firstName = req.query.firstName;
  const lastName = req.query.lastName;
  res.end(`your full name is ${firstName} ${lastName}`);
});

server.get("/CRUD/getExample", (req, res) => {
  res.json(exampleJson);
});

server.get("/CRUD/getJson", (req, res) => {
  let jsonData = fs.readFileSync("./data.json", "utf-8");
  jsonData = JSON.parse(jsonData);
  res.status(200).json(jsonData);
});

server.post("/CRUD/writeJson", (req, res) => {
  dataInJson = fs.readFileSync("./data.json", "utf-8");
  dataInJson = JSON.parse(dataInJson);
  let incomingData = req.body;
  incomingData["id"] = uuid.v4();
  dataInJson.push(incomingData);
  dataInJson = JSON.stringify(dataInJson);
  fs.writeFileSync("./data.json", dataInJson, "utf-8");
  res.status(200).end("success");
});
server.put("/CRUD/writeJson", (req, res) => {           //using query params
  dataInJson = fs.readFileSync("./data.json", "utf-8");
  dataInJson = JSON.parse(dataInJson);
  let incomingData = req.body;
  const id = req.query.id;
  for (let i = 0; i < dataInJson.length; i++) {
    if (dataInJson[i]["id"] === id) {
      dataInJson[i]["name"] = incomingData["name"];
      dataInJson[i]["age"] = incomingData["age"];
      fs.writeFileSync("./data.json", JSON.stringify(dataInJson), "utf-8");
      res.status(200).end("User record updated");
    }
  }
  res.status(404).end("No user with that ID");
});

server.delete("/CRUD/writeJson/:id", (req, res) => {          //using url params
  dataInJson = fs.readFileSync("./data.json", "utf-8");
  dataInJson = JSON.parse(dataInJson);
  const id = req.params.id;
  for (let i = 0; i < dataInJson.length; i++) {
    if (dataInJson[i]["id"] === id) {
      dataInJson.splice(i, 1);
      fs.writeFileSync("./data.json", JSON.stringify(dataInJson), "utf-8");
      res.status(200).end("user record deleted");
    }
  }
  res.status(404).end("No user with that ID");
});

server.listen(3000, () => {
  console.log("Server listening at port 3000");
});
