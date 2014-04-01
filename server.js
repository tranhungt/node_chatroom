var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var cache = {};

function send404(res){
  res.writeHead(404, {'Content-Type': 'text/plain'});
  res.write('Error 404: resource not found');
  res.end();
}

function sendFile(res, filePath, fileContents){
  res.writeHead(
    200,
    {'Content-Type': mime.lookup(path.basename(filePath))}
  );
  res.end(fileContents);
}

function serveStatic(res, cache, absPath){
  if (cache[absPath]){
    sendFile(res, absPath, cache[absPath]);
  }

  fs.exists(absPath, function(exists){
    if (!exists){
      send404(res);
    }

    fs.readFile(absPath, function(err, data){
      if (err){
        send404(res);
      }

      cache[absPath] = data;
      sendFile(res, absPath, data);
    })
  })
}

var server = http.createServer();
server.on('request', function(req, res){
  var filePath = false;
  if (req.url == '/'){
    filePath = 'public/index.html'
  } else{
    filePath = 'public/' + req.url;
  }

  var absPath = './' + filePath;
  console.log(absPath);
  serveStatic(res, cache, absPath);
})
var port = 3000;
server.listen(port);
console.log("Node server listening on port " + port);