"use strict";

var socketIO = require("socket.io");
var ot = require("ot");
var roomList = {};

module.exports = function (server) {
  var html = "HTML";
  var css = "CSS";
  var js = "JS";

  var io = socketIO(server);
  io.on("connection", function (socket) {
    socket.on("joinRoom", function (data) {
      if (!roomList[data.room]) {
        if(data.editor === 'html') {
          console.log('html');
          var socketIOServer = new ot.EditorSocketIOServer(
            html,
            [],
            data.room,
            function (socket, cb) {
              var self = this; 
              Project.findByIdAndUpdate(
                data.docId,
                { html: self.document },
                function (err) {
                  if (err) return cb(false);
                  cb(true);
                }
              );
            }
          );
        }
        if(data.editor === 'css') {
          console.log('css');
          var socketIOServer = new ot.EditorSocketIOServer(
            css,
            [],
            data.room,
            function (socket, cb) {
              var self = this; 
              Project.findByIdAndUpdate(
                data.docId,
                { css: self.document },
                function (err) {
                  if (err) return cb(false);
                  cb(true);
                }
              );
            }
          );
        }
        if(data.editor === 'js') {
          console.log('js');
          var socketIOServer = new ot.EditorSocketIOServer(
            js,
            [],
            data.room,
            function (socket, cb) {
              var self = this; 
              Project.findByIdAndUpdate(
                data.docId,
                { js: self.document },
                function (err) {
                  if (err) return cb(false);
                  cb(true);
                }
              );
            }
          );
        }
        roomList[data.room] = socketIOServer;
      }

        roomList[data.room].addClient(socket);
        roomList[data.room].setName(socket, data.username);

      socket.room = data.room;
      socket.join(data.room);
    });

    socket.on("chatMessage", function (data) {
      io.to(socket.room).emit("chatMessage", data);
    });

    socket.on("disconnect", function () {
      socket.leave(socket.room);
    });
  });
};
