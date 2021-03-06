// Generated by CoffeeScript 1.3.3
var c, canvas, divideQuadrants, i, permutations, pixels, searched, size, test, w, x, y, _i;

canvas = document.getElementById('c');

c = canvas.getContext('2d');

size = 512;

canvas.width = canvas.height = size;

c.fillStyle = '#007fff';

for (i = _i = 0; _i < 5; i = ++_i) {
  x = Math.random() * size;
  y = Math.random() * size;
  w = Math.random() * 10 + 10;
  c.fillRect(x - w, y - w, w * 2, w * 2);
}

pixels = c.getImageData(0, 0, size, size).data;

permutations = [[0, 1, 2, 3], [0, 1, 3, 2], [0, 2, 1, 3], [0, 2, 3, 1], [0, 3, 1, 2], [0, 3, 2, 1], [1, 0, 3, 2], [1, 0, 2, 3], [1, 2, 3, 0], [1, 2, 0, 3], [1, 3, 2, 0], [1, 3, 0, 2], [2, 0, 1, 3], [2, 0, 3, 1], [2, 1, 0, 3], [2, 1, 3, 0], [2, 3, 0, 1], [2, 3, 1, 0], [3, 0, 2, 1], [3, 0, 1, 2], [3, 1, 2, 0], [3, 1, 0, 2], [3, 2, 1, 0], [3, 2, 0, 1]];

searched = 0;

divideQuadrants = function(x, y, w, h) {
  var j, k, neg, pos, _j, _len, _ref;
  if (w <= 1 || h <= 1) {
    searched++;
    return pixels[4 * (y * size + x) + 3] > 0;
  }
  pos = 0;
  neg = 0;
  _ref = permutations[Math.floor(24 * Math.random())];
  for (_j = 0, _len = _ref.length; _j < _len; _j++) {
    k = _ref[_j];
    i = x + ((k % 2) * w / 2);
    j = y + (Math.floor(k / 2) * h / 2);
    if (divideQuadrants(i, j, w / 2, h / 2) === true) {
      pos++;
    } else {
      neg++;
    }
    if (pos >= 2) {
      c.strokeRect(x, y, w, h);
      return true;
    }
    if (neg >= 2 && (w < 20 || h < 20)) {
      return false;
    }
  }
};

test = function() {
  console.time("start");
  divideQuadrants(0, 0, size, size);
  console.timeEnd("start");
  return console.log("searched", searched / (size * size));
};

setTimeout(test, 500);
