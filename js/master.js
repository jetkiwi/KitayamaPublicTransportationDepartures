var isDest = 0;
var tableData = null;
var c = null;
var ctx = null;

$(document).ready(function () {
  c = document.getElementById("canvas");
  ctx = c.getContext("2d");

  $.get("./data/table.json", function (data) {
    tableData = data;
  });

  // This is from stackoverflow
  WebFontConfig = {
    google: { families: ['Noto Sans'] },
    active: function () { draw(); },
  };
  (function () {
    var wf = document.createElement("script");
    wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1.5.10/webfont.js';
    wf.async = 'true';
    document.head.appendChild(wf);
  })();

  // This is also from stackoverflow
  // Resize the canvas to fill browser window dynamically
  window.addEventListener('resize', resizeCanvas, false);
  resizeCanvas();

  $(function () {
    setInterval(function () {
      resizeCanvas();
      if (isDest == 1) {
        isDest = 0;
      } else {
        isDest = 1;
      }
    }, 5000);
  });
});

function resizeCanvas() {
  c.width = innerWidth;
  c.height = innerHeight;
  draw();
}

function draw() {
  var s = Math.floor(innerHeight / 5);
  //Background
  ctx.fillStyle = "gray";
  ctx.fillRect(0, 0, innerWidth, innerHeight);
  //Departure Info Background
  ctx.fillStyle = "black";
  ctx.fillRect(0.5 * s, 1.5 * s, innerWidth - 1 * s, 3 * s);

  ctx.font = Math.floor(s * 0.75) + "px 'Noto Sans'";

  drawTitle(ctx, s, ["Dep.", "Op.", "Dest. via/Arr."]);

  if (!(tableData === null)) {
    var d = getLines(tableData);
    var lines = [];
    var i = 0;
    while (i < d.length) {
      lines.push([d[i].depTime, d[i].operator, d[i].destination, d[i].arrTime]);
      i = i + 1;
    }

    i = 0;
    while (i < d.length) {
      var line = lines[i];
      drawLine(ctx, s, i, [line[0], line[1], line[2 + isDest]]);
      i = i + 1;
    }
  }

}

function drawTitle(ctx, s, str) {
  ctx.fillStyle = "white";
  ctx.fillText("Dep.", 0.5 * s, 1.5 * s - 0.25 * s);
  ctx.fillText("Op.", 0.5 * s + 2 * s, 1.5 * s - 0.25 * s);
  ctx.fillText("Dest. via/Arr.", 0.5 * s + 4 * s, 1.5 * s - 0.25 * s);
}

function drawLine(ctx, s, line, str) {
  ctx.fillStyle = "orange";
  ctx.fillText(str[0], 0.5 * s, s * line + 2.5 * s - 0.25 * s);
  ctx.fillText(str[1], 0.5 * s + 2 * s, s * line + 2.5 * s - 0.25 * s);
  ctx.fillText(str[2], 0.5 * s + 4 * s, s * line + 2.5 * s - 0.25 * s);
}

function getLines(tableData) {
  //Since the data is in hhmm format, we will have to compare it in that format
  var date = new Date();
  var str = ('0' + date.getHours()).slice(-2) + ('0' + date.getMinutes()).slice(-2);

  //Create a copy
  tableData = tableData.slice(0);

  tableData.sort(function (a, b) {
    return Number(a.depTime) - Number(b.depTime);
  });

  //By iterating from the end, the index will not be affected
  //This trick is from stackoverflow
  var i = tableData.length;
  while (i--) {
    if (Number(tableData[i].depTime) < Number(str)) {
      tableData.splice(i, 1);
    }
  }

  return tableData.slice(0, 3);
}
