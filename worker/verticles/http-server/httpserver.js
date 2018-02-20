exports.vertxStart = function() {
  console.log("Starting httpserver Verticle");
}

exports.vertxStop = function() {
  console.log('Stopping httpserver Verticle');
}

var eb = vertx.eventBus();


var Router = require("vertx-web-js/router");
var server = vertx.createHttpServer();
var router = Router.router(vertx);

router.route().path("/get-tasks/").handler(function (routingContext) {
  // This handler will be called for every request
  var response = routingContext.response();
  response.putHeader("content-type", "text/plain");

  // EVENT BUS: Publish message for Get-Tasks
  eb.publish("get-tasks", "go get some external tasks");

  // Write to the response and end it
  response.end("getting tasks - look at console");
});

server.requestHandler(router.accept).listen(8080);