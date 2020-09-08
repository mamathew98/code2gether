var EditorClient = ot.EditorClient;
var SocketIOAdapter = ot.SocketIOAdapter;
var CodeMirrorAdapter = ot.CodeMirrorAdapter;


var socket = io('http://localhost:3000');
var socketCss = io('http://localhost:3000', {
  forceNew: true
});
var socketJs = io('http://localhost:3000', {
  forceNew: true
});

var htmlVal;
var cssVal;
var jsVal;
var editor = CodeMirror.fromTextArea(document.getElementById("code-screen"), {
  lineNumbers: true,
  theme: "monokai",
  mode: 'htmlmixed'
});
editor.setSize(500,200)
editor.on("change", function(cm, change) { 
  htmlVal = cm.getValue();
  compile();
 })

var editorCss = CodeMirror.fromTextArea(document.getElementById("code-screen-css"), {
  lineNumbers: true,
  theme: "monokai",
  mode: 'htmlmixed'
});
editorCss.setSize(500,200)
editorCss.on("change", function(cm, change) { 
  cssVal = cm.getValue();
  compile();
 })

var editorJs = CodeMirror.fromTextArea(document.getElementById("code-screen-js"), {
  lineNumbers: true,
  theme: "monokai",
  mode: 'htmlmixed'
});
editorJs.setSize(500,200)
editorJs.on("change", function(cm, change) { 
  jsVal = cm.getValue();
  compile();
 })

function compile() {
  var html = htmlVal;
  var css = cssVal;
  var js = jsVal;
  var compiler = document.getElementsByTagName('iframe')[0].contentWindow.document;

  compiler.open();
  compiler.writeln(
    html +
    '<style>' +
    css +
    '</style>' +
    '<script>' +
    js +
    '</script>'
  );
  compiler.close();
}


var code = $('#code-screen').val();
var codeCss = $('#code-screen-css').val();
var codeJs = $('#code-screen-js').val();

var cmClient;
var cmClientCss;
var cmClientJs;

function init(str, revision, clients, serverAdapter) {
  if (!code) {
    editor.setValue(str);
  }

  cmClient = new EditorClient(
    revision, clients, serverAdapter, new CodeMirrorAdapter(editor)
  );
};

function initCss(str, revision, clients, serverAdapter) {
  if (!codeCss) {
    editorCss.setValue(str);
  }

  cmClientCss = new EditorClient(
    revision, clients, serverAdapter, new CodeMirrorAdapter(editorCss)
  );
};

function initJs(str, revision, clients, serverAdapter) {
  if (!codeJs) {
    editorJs.setValue(str);
  }

  cmClientJs = new EditorClient(
    revision, clients, serverAdapter, new CodeMirrorAdapter(editorJs)
  );
};

socket.on('doc', function(obj) {
  init(obj.str, obj.revision, obj.clients, new SocketIOAdapter(socket));
});

socketCss.on('doc', function(obj) {
  initCss(obj.str, obj.revision, obj.clients, new SocketIOAdapter(socketCss));
});

socketJs.on('doc', function(obj) {
  initJs(obj.str, obj.revision, obj.clients, new SocketIOAdapter(socketJs));
});

var username = $("#chatbox-username").val();
if(username === "") {
  var userId = Math.floor(Math.random() * 9999).toString();
  username = "User" + userId;
  $("#chatbox-username").text(username);
};

var roomId = $('#roomId').val();
socket.emit('joinRoom', {room: roomId, docId: roomId, username: username, editor: 'html'});
socketCss.emit('joinRoom', {room: roomId+'css', docId: roomId, username: username, editor: 'css'});
socketJs.emit('joinRoom', {room: roomId+'js', docId: roomId, username: username, editor: 'js'});



var userMessage = function(name, text) {
  return ('<li class="media" style="height:30px;"> <div class="media-body"> <div class="media">' +
    '<div class="media-body"' +
    '<b>' + name + '</b> : ' + text +
    '<hr/> </div></div></div></li>'
  );
};

var sendMessage = function() {
  var userMessage = $('#userMessage').val();
  socket.emit('chatMessage', {message: userMessage, username: username});
  $('#userMessage').val("");
};

socket.on('chatMessage', function(data) {
  $('#chatbox-listMessages').append(userMessage(data.username, data.message));
});
