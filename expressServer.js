const express = require("express");
const fs = require("fs");
const uuid = require("uuid");
const {body, param,query , validationResult,checkSchema} = require("express-validator");
const server = express();
let data; //for write/append operations    //bad practice to globally declare such variable


server.get("/", (req, res) => {
  res.end("Welcome to landing page, this is a test");
});
server.get("/users", (req, res) => {
  readData();
  res.status(200).json(data);
});


server.use(express.json()); //middleware
server.use(express.urlencoded({ extended: true })); //middleware

const validateInput =[
  // body().custom((value,{req})=>{
  //   const keys = Object.keys(value)
    
  //   if(keys.length !== 2){
  //     console.log(keys)
  //     throw new Error("input should have exactly 2 key value pairs")  
  //   }
  //   if(keys[0]!=="name"){
  //     throw new Error('First key must be "name"')
  //   }
  //   if(keys[1]!=="age"){
  //     throw new Error('Second key must be "age"')
  //   }
  // }),
  body("name").custom((value,{req})=>{
    // const nameRegex = /^[a-zA-Z\s]+$/;
    // if(!nameRegex.test(value)){
    //   throw new Error("Invalid name format")
    // }
    if(!value){
      throw new Error("Invalid name format")
    }
  }),
//insert middleware to validate age 
// body('age').isInt().withMessage('Age input field accepts only int values'),  
  (req,res,next) =>{
    console.log('hi');
    const errors = validationResult(req)
    console.log(`error${JSON.stringify(errors)}`)
    if(!errors.isEmpty()){
      return res.status(400).json({errors:errors.array()}) //prepend return here if app does not work,refer gpt
    }
    next();
  }
]

const regValidation ={
  name:{
      notEmpty:true,
      errorMessage:"Failed for name"
  },
  age:{
    isInt:true,
    errorMessage:"Age issue"
  }
  
}

server.post("/users",checkSchema(regValidation), (req, res) => {

  const err = validationResult(req);
  console.log("err...",err.array())
if(err.array()?.length ){
  res.status(400).end({"Error":err.array()})
}

  readData();
  
  let requestData = req.body;
  requestData["id"] = uuid.v4();
  data.push(requestData);
  writeData();
  res.status(200).end("success");
});
server.put("/users/:id",validateInput, (req, res) => {
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
server.delete("/users/:id",(req, res) => {
  //using url params
  readData();
  const id = req.params.id;
  for (let i = 0; i < data.length; i++) {
    if (data[i]["id"] === id) {
      data.splice(i, 1);          //use filter
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
