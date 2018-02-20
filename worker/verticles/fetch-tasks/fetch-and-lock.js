exports.vertxStart = function() {
  console.log("Starting fetch-and-lock Verticle")
}
exports.vertxStop = function() {
  console.log('Stopping fetch-and-lock Verticle')
}

var eb = vertx.eventBus()

eb.consumer("get-tasks", function (message) {
  console.log("get-tasks received: " + message.body())
  getTasks()
})

// How to load a NPM Module Lib
// Allows easy loadings of helper code to keep verticles clean
// var helpers = require('cam-helpers')
// console.log(helpers.getCamundaUrl1())
// console.log(helpers.getCamundaUrl2())

var WebClient = require("vertx-web-client-js/web_client")
var BodyCodec = require("vertx-web-common-js/body_codec")

var client = WebClient.create(vertx)

function buildJsonBody()
{
  var jsonBody = {
    "workerId" : "myWorkerId",
    "maxTasks" : 10,
    "usePriority": false,
    "topics": [
      {
        "topicName": "calculate-numbers",
        "lockDuration": 600000,
        "variables": ["num1", "num2"],
        "deserializeValues": true
      }
    ]
  }
  return jsonBody
}

function getTasks(){
  client.post(8080, "camunda", "/engine-rest/external-task/fetchAndLock").as(BodyCodec.jsonArray()).sendJsonObject(buildJsonBody(), function (ar, ar_err) {
    if (ar_err == null) {

      var response = ar
      var body = response.body()
      console.log("Received response with status code" + response.statusCode())

      // If the returned Array is not empty
      if (body.length != 0){
        console.log('Array Item count: ' + body.length)

        // Iterate over each item in the array
        Array.prototype.forEach.call(body, function(task) {
          console.log('Item: ' + JSON.stringify(task))
         
          // EVENT BUS: Publish Message to Calculate-Numbers Verticle
          eb.publish("calculate-numbers", JSON.stringify(task))

        })
        console.log('Completed processing array')

        // If the returned Array is empty
      } else {
        console.log('No tasks found in Array')
      }

      // Could not complete the POST request
    } else {
      console.error("Something went wrong: " + ar_err.getMessage())
    }
  })
}
