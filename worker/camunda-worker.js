exports.vertxStart = function() {
  console.log("Starting Primary Verticle");
}
exports.vertxStop = function() {
  console.log('Stopping Primary Verticle');
}

// loads config.json file
var cfg = Vertx.currentContext().config()
// console.log(JSON.stringify(cfg))

var workerOptions = {
  "worker" : true
};

// GEM_PATH is the specific ruby version.
var rubyOptions = {
  "config": {
    "GEM_PATH": "bundle/jruby/2.3.0/"
  },
  "worker" : true
}

// @TODO If you want parallel, then Deploy as a Multi-threaded worker 
vertx.deployVerticle('verticles/fetch-tasks/fetch-and-lock.js', workerOptions)
vertx.deployVerticle('verticles/process-calculate-numbers/calculate-numbers.js', workerOptions)
vertx.deployVerticle('verticles/task-complete/task-complete.js', workerOptions)
vertx.deployVerticle('verticles/http-server/httpserver.js')
vertx.deployVerticle('verticles/ruby-biz/ruby-biz.rb', rubyOptions)


