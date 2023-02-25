
const redis = require("redis");

const client = redis.createClient();

client.on("error",(err)=>{
  console.log("Error while connecting to redis");
})

client.connect();

module.exports = {client};
