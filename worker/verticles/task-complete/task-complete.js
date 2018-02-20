exports.vertxStart = function() {
  console.log("Starting task-complete Verticle")
}
exports.vertxStop = function() {
  console.log('Stopping task-complete Verticle')
}

var eb = vertx.eventBus()

// Register consumer for task-completion
eb.consumer("task-complete", function (message) {
  console.log("task-complete received: " + message.body())

  var completedTask = JSON.parse(message.body())
  completeTask(completedTask)
})


var WebClient = require("vertx-web-client-js/web_client")
var BodyCodec = require("vertx-web-common-js/body_codec")
var client = WebClient.create(vertx);

function buildJsonBody(task)
{
  var jsonBody = {
    "workerId" : "myWorkerId",
    "variables": {
      "calculatedValue": {
        "value": parseInt(task["result"]),
        "type": "Integer"
      }
    }
  }
  return jsonBody
}

function completeTask(task)
{
  client.post(8080, "camunda", "/engine-rest/external-task/" + task['source']['id'] + "/complete").as(BodyCodec.jsonObject()).sendJsonObject(buildJsonBody(task), function (ar, ar_err) {
    if (ar_err == null) {

      var response = ar
      var body = response.body()
      console.log("Received response with status code" + response.statusCode())
      console.log("Camunda Task Completion Response:" + JSON.stringify(body))

      // @TODO Add Response code error handling

      // Could not complete the POST request
    } else {
      console.error("Something went wrong: " + ar_err.getMessage())
    }
  })
}