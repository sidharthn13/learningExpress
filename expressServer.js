const express = require("express");
const fs = require("fs");
const uuid = require("uuid");
const server = express();
const exampleJson = { name: "sid", age: "22" }; //example data for running tests
let data; //for write/append operations

server.use(express.json()); //middleware
server.use(express.urlencoded({ extended: true })); //middleware
server.get("/", (req, res) => {
  res.end("Welcome to landing page, this is a test");
});
server.get("/test", (req, res) => {
  const firstName = req.query.firstName;
  const lastName = req.query.lastName;
  res.end(`your full name is ${firstName} ${lastName}`);
});
server.get("/user/example", (req, res) => {
  res.json(exampleJson);
});
server.get("/users", (req, res) => {
  readData();
  res.status(200).json(data);
});
server.post("/users", (req, res) => {
  readData();
  let requestData = req.body;
  requestData["id"] = uuid.v4();
  data.push(requestData);
  writeData();
  res.status(200).end("success");
});
server.put("/users/:id", (req, res) => {
  readData();
  let requestData = req.body;
  const id = req.params.id;
  for (let i = 0; i < data.length; i++) {
    if (data[i]["id"] === id) {
      data[i]["name"] = requestData["name"];
      data[i]["age"] = requestData["age"];
      writeData();
      res.status(200).end("User record updated");
    }
  }
  res.status(404).end("No user with that ID");
});
server.delete("/users/:id", (req, res) => {
  //using url params
  readData();
  const id = req.params.id;
  for (let i = 0; i < data.length; i++) {
    if (data[i]["id"] === id) {
      data.splice(i, 1);
      writeData();
      res.status(200).end("user record deleted");
    }
  }
  res.status(404).end("No user with that ID");
});
server.listen(3000, () => {
  console.log("Server listening at port 3000");
});

//function to read from JSON file
function readData() {
  data = fs.readFileSync("./data.json", "utf-8");
  data = JSON.parse(data);
}

//function to write to JSON file
function writeData() {
  fs.writeFileSync("./data.json", JSON.stringify(data), "utf-8");
}
