exports.vertxStart = function() {
  console.log("Starting calculate-numbers Verticle")
}
exports.vertxStop = function() {
  console.log('Stopping calculate-numbers Verticle')
}

var eb = vertx.eventBus()

eb.consumer("calculate-numbers", function (message) {
  console.log("calculate-numbers received: " + message.body())
  var task = JSON.parse(message.body())
  
  var num1 = parseInt(task["variables"]["num1"]["value"])
  var num2 = parseInt(task["variables"]["num2"]["value"])
  console.log('numbers: ' + num1 + ' and ' + num2)

  var calc = calculateNumbers(num1, num2)
  
  var calcResponse = {
    "source": task,
    "result": calc
  }
  // console.log('calcResponse = ' + JSON.stringify(calcResponse))
  // console.log(calcResponse['result'])
  eb.publish("task-complete", JSON.stringify(calcResponse))
})

// Simple function for adding two numbers together
function calculateNumbers(num1, num2)
{
  var calc = num1 + num2
  return calc
}

