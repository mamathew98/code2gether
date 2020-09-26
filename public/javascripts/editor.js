var EditorClient = ot.EditorClient;
var SocketIOAdapter = ot.SocketIOAdapter;
var CodeMirrorAdapter = ot.CodeMirrorAdapter;

// FOR SERVER DEPLOYMENT
var socket = io("http://51.195.28.68:3000");
var socketCss = io("http://51.195.28.68:3000", {
  forceNew: true,
});
var socketJs = io("http://51.195.28.68:3000", {
  forceNew: true,
});

// FOR LOCAL DEPLOYMENT
// var socket = io("http://localhost:3000");
// var socketCss = io("http://localhost:3000", {
//   forceNew: true,
// });
// var socketJs = io("http://localhost:3000", {
//   forceNew: true,
// });

// html editor value
var htmlVal;

// Html Editor
var editor = CodeMirror.fromTextArea(document.getElementById("code-screen"), {
  lineNumbers: true,
  theme: "monokai",
  mode: "htmlmixed",
  extraKeys: { "Ctrl-Space": "autocomplete" },
});
// set editor size
editor.setSize(400, 190);
// get value of editor on content change
editor.on("change", function (cm, change) {
  htmlVal = cm.getValue();
  compile();
});

// css editor value
var cssVal;

// Css Editor
var editorCss = CodeMirror.fromTextArea(
  document.getElementById("code-screen-css"),
  {
    lineNumbers: true,
    theme: "monokai",
    mode: "css",
    extraKeys: { "Ctrl-Space": "autocomplete" },
  }
);
// set editor size
editorCss.setSize(400, 190);
// get value of editor on content change
editorCss.on("change", function (cm, change) {
  cssVal = cm.getValue();
  compile();
});

// js editor value
var jsVal;

// Javascript Editro
var editorJs = CodeMirror.fromTextArea(
  document.getElementById("code-screen-js"),
  {
    lineNumbers: true,
    theme: "monokai",
    mode: "javascript",
    extraKeys: { "Ctrl-Space": "autocomplete" },
  }
);
// set editor size
editorJs.setSize(400, 190);
// get value of editor on content change
editorJs.on("change", function (cm, change) {
  jsVal = cm.getValue();
  compile();
});

// compile htm;/css/js values into the iframe element
function compile() {
  var html = htmlVal;
  var css = cssVal;
  var js = jsVal;
  // get iframe element
  var compiler = document.getElementsByTagName("iframe")[0];
  const source = `
  <html>
    <head><style>${css}</style></head>
    <body>
      ${html}
      <script>${js}</script>
    </body>
  </html>
`;
  compiler.srcdoc = source;
}

// code editor values for sharing into otjs
var code = $("#code-screen").val();
var codeCss = $("#code-screen-css").val();
var codeJs = $("#code-screen-js").val();

// codeMirror clients for otjs
var cmClient;
var cmClientCss;
var cmClientJs;

// init html editor with data fetched from database and connect it to otjs
function init(str, revision, clients, serverAdapter) {
  // if editor is empty
  if (!code) {
    // set default value to editor
    editor.setValue(str);
  }

  // create a ot client for editor
  cmClient = new EditorClient(
    // document revisions
    revision,
    // other users(sockets) wolrking on this project
    clients,
    // ot server provided with socket connection
    serverAdapter,
    // adapt code mirror with ot
    new CodeMirrorAdapter(editor)
  );
}

// init css editor with data fetched from database
function initCss(str, revision, clients, serverAdapter) {
  if (!codeCss) {
    editorCss.setValue(str);
  }

  cmClientCss = new EditorClient(
    revision,
    clients,
    serverAdapter,
    new CodeMirrorAdapter(editorCss)
  );
}

// init js editor with data fetched from database
function initJs(str, revision, clients, serverAdapter) {
  if (!codeJs) {
    editorJs.setValue(str);
  }

  cmClientJs = new EditorClient(
    revision,
    clients,
    serverAdapter,
    new CodeMirrorAdapter(editorJs)
  );
}

// init html editor when socket data recieved on "doc" event
socket.on("doc", function (obj) {
  init(obj.str, obj.revision, obj.clients, new SocketIOAdapter(socket));
});

// init css editor when socket data recieved on "doc" event
socketCss.on("doc", function (obj) {
  initCss(obj.str, obj.revision, obj.clients, new SocketIOAdapter(socketCss));
});

// init js editor when socket data recieved on "doc" event
socketJs.on("doc", function (obj) {
  initJs(obj.str, obj.revision, obj.clients, new SocketIOAdapter(socketJs));
});

// get username if exists, and if not generate one
var username = $("#chatbox-username").text();
var name = $("#chatbox-name").text();
var userId = Math.floor(Math.random() * 9999).toString();
username = "User" + userId;
$("#chatbox-username").text(username);
if (name === "") {
  $("#chatbox-name").text(username);
}

// get generated roomId from elements
var roomId = $("#roomId").val();

// connect htlm socket to room
socket.emit("joinRoom", {
  room: roomId,
  docId: roomId,
  username: username,
  editor: "html",
});

// connect css socket to room
socketCss.emit("joinRoom", {
  room: roomId + "css",
  docId: roomId,
  username: username,
  editor: "css",
});

// connect js socket to room
socketJs.emit("joinRoom", {
  room: roomId + "js",
  docId: roomId,
  username: username,
  editor: "js",
});

// generate user message html
var userMessage = function (name, text) {
  return (
    '<li class="media" style="width: 100%;"> <div class="media-body" style="width: 100%;"> <div class="media" style="width: 100%;">' +
    '<div class="media-body" style="width: 100%;">' +
    '<span style="color: green">' +
    "<b>" +
    name +
    "</b> : " +
    "</span>" +
    '<span style="color: white;">' +
    text +
    "</span>" +
    "</div></div></div></li>"
  );
};

// send user message through socket
var sendMessage = function () {
  // get user input in message area
  var userMessage = $("#userMessage").val();
  // emit the message in socket via "chatMessage" event
  socket.emit("chatMessage", { message: userMessage, username: username });
  $("#userMessage").val("");
};

// get other users message on this event
socket.on("chatMessage", function (data) {
  // load the given message in chatbox area
  $("#chatbox-listMessages").append(userMessage(data.username, data.message));
});
