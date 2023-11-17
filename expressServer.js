const express = require("express");
const fs = require("fs");
const uuid = require("uuid");
const server = express();
const exampleJson = { name: "sid", age: "22" }; //example data for running tests
let dataInJson; //for write/append operations

//middleware functions
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.get("/", (req, res) => {
  res.end("Welcome to landing page, this is a test");
});
server.get("/test", (req, res) => {
  const firstName = req.query.firstName;
  const lastName = req.query.lastName;
  res.end(`your full name is ${firstName} ${lastName}`);
});

server.get("/GET/users/get-example", (req, res) => {
  res.json(exampleJson);
});

server.get("/GET/users/get-all", (req, res) => {
  readJsonData();
  res.status(200).json(dataInJson);
});

server.post("/POST/users/create", (req, res) => {
  readJsonData();
  let incomingData = req.body;
  incomingData["id"] = uuid.v4();
  dataInJson.push(incomingData);
  writeJsonData();
  res.status(200).end("success");
});
server.put("/PUT/users/update", (req, res) => {
  //using query params
  readJsonData();
  let incomingData = req.body;
  const id = req.query.id;
  for (let i = 0; i < dataInJson.length; i++) {
    if (dataInJson[i]["id"] === id) {
      dataInJson[i]["name"] = incomingData["name"];
      dataInJson[i]["age"] = incomingData["age"];
      writeJsonData();
      res.status(200).end("User record updated");
    }
  }
  res.status(404).end("No user with that ID");
});

server.delete("/DELETE/users/delete/:id", (req, res) => {
  //using url params
  readJsonData();
  const id = req.params.id;
  for (let i = 0; i < dataInJson.length; i++) {
    if (dataInJson[i]["id"] === id) {
      dataInJson.splice(i, 1);
      writeJsonData();
      res.status(200).end("user record deleted");
    }
  }
  res.status(404).end("No user with that ID");
});

server.listen(3000, () => {
  console.log("Server listening at port 3000");
});

//function to read from JSON file
function readJsonData() {
  dataInJson = fs.readFileSync("./data.json", "utf-8");
  dataInJson = JSON.parse(dataInJson);
}

//function to write to JSON file
function writeJsonData() {
  fs.writeFileSync("./data.json", JSON.stringify(dataInJson), "utf-8");
}
