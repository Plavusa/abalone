
var receivedData = null;
var stop = false;

window.onload = function () {
    drawGenerator();

     smackjack.reset(JSON.stringify(example.chess), parse, null);
     $("#example-chess").click(function(){
       smackjack.exampleChess("", parse, null);
     })
     $("#odigraj-potez").click(function(){
       smackjack.odigrajPotez(JSON.stringify(receivedData), parse, null);
     })

    $("#odigraj-potez-1").click(function(){
      var port = $("#port-1").val();
      smackjack.odigrajPotez(JSON.stringify(receivedData), parse, null, port);
    })

    $("#reset-1").click(function(){
      var port = $("#port-1").val();
      smackjack.reset(JSON.stringify(receivedData), parse, null, port);
    })

    $("#odigraj-potez-2").click(function(){
      var port = $("#port-2").val();
      smackjack.odigrajPotez(JSON.stringify(receivedData), parse, null, port);
    })

    $("#reset-2").click(function(){
      var port = $("#port-2").val();
      smackjack.reset(JSON.stringify(receivedData), parse, null, port);
    })

    $("#igraj").click(function(){
      stop = false;
      zoviPrvog();
    })

    $("#stop").click(function(){
      stop = true;
    })

   $("#gen-generate").click(function() {
     generate();
   })
}

function parse(data) {
  receivedData = (JSON.parse((JSON.parse(data))));
  console.log(receivedData);

  displayData(receivedData);
}

function zoviPrvog() {
  console.log("zovem prvog");
  var port = $("#port-1").val();
  smackjack.odigrajPotez(JSON.stringify(receivedData), prviCallback, null, port);
}

function prviCallback(data) {
  receivedData = (JSON.parse((JSON.parse(data))));
  displayData(receivedData);

  console.log("dobio sam od prvog: ");
  console.log(receivedData);

  if(stop) return;
  var delay = +$("#delay").val();
  setTimeout(zoviDrugog, delay);
}

function zoviDrugog() {
  console.log("zovem drugog");
  var port = $("#port-2").val();
  smackjack.odigrajPotez(JSON.stringify(receivedData), drugiCallback, null, port);
}

function drugiCallback(data) {
  receivedData = (JSON.parse((JSON.parse(data))));
  displayData(receivedData);

  console.log("dobio sam od drugog: ");
  console.log(receivedData);
  if(stop) return;
  var delay = +$("#delay").val();
  setTimeout(zoviPrvog, delay);
}


function generate() {
  var board = {};
  board.type = $("#gen_boardType").val();
  board.dimensions = [];
  board.dimensions[0] = +$("#gen_boardDimensions-1").val();
  board.dimensions[1] = +$("#gen_boardDimensions-2").val();
  board.dimensions[2] = +$("#gen_boardDimensions-3").val();
  board.corner = $("#gen_boardCorner").val();
  board.axis = [];
  board.axis[0] = $("#gen_boardAxis-1").val();
  board.axis[1] = $("#gen_boardAxis-2").val();
  board.coloring = $("#gen_boardColoring").val();
  board.mode = $("#gen_boardMode").val();
  board.size = $("#gen_boardSize").val();

  var player = {};
  player.name = $("#gen_playerName").val();
  player.order = +$("#gen_playerOrder").val();
  player.message = $("#gen_playerMessage").val();

  var state = {};
  state.color = $("#gen_stateColor").val();
  state.shape = $("#gen_stateShape").val();

  var state2 = {};
  state2.color = $("#gen_stateColor-2").val();
  state2.shape = $("#gen_stateShape-2").val();

  console.log(board);
  console.log(player);
  console.log(state);




  var ax = [];
  ax[0] = board.axis[0].split(' ');
  ax[1] = board.axis[1].split(' ');
  var rand = [];
  var rand2 = [];
  for(let i=0; i < Math.min(...board.dimensions); i++) {
    var a = ax[0][Math.floor(Math.random()*ax[0].length)];
    var b = ax[1][Math.floor(Math.random()*ax[1].length)];
    if(i%2 == 0)
      rand.push([a, b]);
    else
      rand2.push([a, b]);

  }

  console.log(rand);

  var lisp = "";
  lisp += '(setq _board \'(\n' +
      '\t(type . "' + board.type + '")\n' +
      '\t(dimensions . (' + board.dimensions.join(' ') + '))\n' +
      '\t(corner . "' + board.corner + '")\n' +
      '\t(axis . ("' + board.axis[0] + '" "' + board.axis[1] + '"))\n' +
      '\t(coloring . "' + board.coloring + '")\n' +
      '\t(size . ' + board.size + ')))\n' +
      '(setq _player \'(\n' +
      '\t(name . "' + player.name + '")\n' +
      '\t(order . ' + player.order + ')\n' +
      '\t(message . "' + player.message + '")))\n' +
      '(setq _state \'(\n' +
      '\t(\n' +
      '\t\t(fields . ((' + rand.map(el => '"' + el[0] +'" "' + el[1] + '"').join(")(") + ')))\n' +
      '\t\t(style . (\n' +
      '\t\t\t(color . "' + state.color + '")\n' +
      '\t\t\t(shape . "' + state.shape + '"))))\n' +
      '\t(\n'+
      '\t\t(fields . ( (' + rand2.map(el => '"' + el[0] +'" "' + el[1] + '"').join(")(") + ')))\n' +
      '\t\t(style . (\n' +
      '\t\t\t(color . "' + state2.color + '")\n' +
      '\t\t\t(shape . "' + state2.shape + '"))))))';


  console.log(lisp);

  var data = {
    board: board,
    player: player,
    state: [
        {
            // Crni pešaci
            fields: rand,
            style: state
        },
        {
          fields: rand2,
          style: state2
        }
        ],
   markings: [],
   removed: [],
  }

  displayData(data);
}

var options = {};
options._boardType =  ["rectangular", "hexagonal-flat", "hexagonal-pointy"];
options._boardDimensions = [15,15,6];
options._boardCorner = ["bottom-left", "top-left", "top-right", "bottom-right", "left", "right", "bottom", "top"];
options._boardAxis = [];
options._boardAxis[0] = "1 2 3 4 5 6 7 8 9 10 11 12 13 14 15";
options._boardAxis[1] = "A B C D E F G H I J K L M N O";
options._boardColoring = ["classic", "chess"];
options._boardMode = ["classic", "circles"];
options._boardSize = ["xxs", "xs", "s", "m", "l", "xl", "xxl"];

options._playerName = "La Plavusha";
options._playerOrder = [1, 2];
options._playerMessage = "Zdravo deco";

options._stateColor = ["red", "pink", "purple", "deep-purple", "indigo", "blue", "light-blue", "cyan", "teal", "green", "light-green", "lime", "yellow", "amber", "deep-orange", "brown", "grey", "blue-grey", "black ", "white"];
options._stateShape = ["O", "X", "circle", "square", "star", "arrow-left", "arrow-right", "arrow-up", "arrow-down", "angle-left", "angle-right", "angle-up", "angle-down", "angle-double-left", "angle-double-right", "angle-double-up", "angle-double-down", "crosshairs", "bullseye", "check", "check-circle", "minus", "plus", "suit-spade-fill", "suit-spade-outline", "suit-heart-fill", "suit-heart-outline", "suit-diamond-fill", "suit-diamond-outline", "suit-club-fill", "suit-club-outline", "number-1", "number-2", "number-46", "number-53", "letter-A", "letter-B", "letter-M", "letter-a", "letter-s", "letter-q", "chess-king-outline", "chess-king-fill", "chess-queen-outline", "chess-queen-fill", "chess-rook-outline", "chess-rook-fill", "chess-bishop-outline", "chess-bishop-fill", "chess-knight-outline", "chess-knight-fill", "chess-pawn-outline", "chess-pawn-fill"];


function drawGenerator() {
  var div = $(".generator");
  r = new RegExp(/[A-Z].*/);

  $.each( options, function( key, value ) {

    var id = "gen" + key;
    var innerDiv = $("<div/>");
    var label =  $("<label/>", {"for": id,}).append(key.match(r)).appendTo(innerDiv);

    if( Object.prototype.toString.call( value ) === '[object Array]' ) {
      switch (key) {
        case "_boardDimensions": drawDimensions(id, value, innerDiv);
        break;
        case "_boardAxis": generateAxis(id, value, innerDiv);
          break;
        default: drawSelect(id, value, innerDiv);
      }
    }else if( typeof value == "string") {
      drawString(id, value, innerDiv);
    }

    div.append(innerDiv);
  });

  var id="gen_stateColor-2";
  var innerDiv = $("<div/>");
  var label =  $("<label/>", {"for": id,}).append("Color").appendTo(innerDiv);
  drawSelect(id, options._stateColor, innerDiv, 5);
  div.append(innerDiv);
  var id= "gen_stateShape-2";
  var innerDiv = $("<div/>");
  var label =  $("<label/>", {"for": id,}).append("Shape").appendTo(innerDiv);
  drawSelect(id, options._stateShape, innerDiv, 13);
  div.append(innerDiv);

  var button = $("<button/>", {
    "type" : "button",
    "id" : "gen-generate"
  }).append("Generisi");

  div.append(button);

}

function drawString(id, value, container) {
  var input = $("<input/>", {
    "type": "text",
    "value" : value,
    "id": id
  }).appendTo(container);
}

function drawDimensions(id, array, container) {
  container.append("<br/>");
  for (let i=1; i<=3 ; i++) {
    var label =  $("<label/>", {
      "for": id + "-" + i,
    }).append("D" + i).appendTo(container);
    var input = $("<input/>", {
      "id":  id + "-" + i,
      "type": "number",
      "min": "1",
      "max": "20",
      "value" : array[i-1],
    }).appendTo(container);
  }
}

function generateAxis(id, array, container) {
  container.append("<br/>");
  for (let i=1; i<3 ; i++) {
    var label =  $("<label/>", {
      "for": id + "-" + i,
    }).append("A" + i).appendTo(container);
    var input = $("<input/>", {
      "id": id + "-" + i,
      "type": "text",
      "value": array[i-1]
    }).appendTo(container);
    container.append("<br/>");
  }

}

function drawSelect(id, array, container, selected = 0) {
  var select = $("<select/>", {
    "id": id
  });
  for (let i=0; i < array.length; i++) {
      var option = $("<option/>", {
        "value" : array[i],
        "selected" : i == selected
      }).append(array[i]).appendTo(select);
    }
  container.append(select);
  }