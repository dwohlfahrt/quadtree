// Generated by CoffeeScript 1.3.3
var basictree, c, canvas, combinations, divideQuadrants, e, getPixel, h, i, layers, parts, pixels, rand, recursion, reference, rng_state, size, smallBoundingBox, w, weightMerger, x, y, _i, _j, _len, _ref;

canvas = document.getElementById('c');

c = canvas.getContext('2d');

size = 4096;

canvas.width = canvas.height = size;

rng_state = 123;

rand = function() {
  rng_state = (1103515245 * rng_state + 12345) % 0x100000000;
  return rng_state / 0x100000000;
};

c.fillStyle = '#007fff';

for (i = _i = 0; _i < 1490; i = ++_i) {
  x = rand() * size;
  y = rand() * size;
  w = rand() * 4 + 1;
  c.fillRect((x - w) + .5, (y - w) + .5, w * 2, w * 2);
}

c.fillRect(10, 10, 100, 100);

pixels = c.getImageData(0, 0, size, size).data;

combinations = function(list) {
  var a, b, newlist, _j, _k, _ref;
  newlist = [];
  for (a = _j = 0, _ref = list.length; 0 <= _ref ? _j < _ref : _j > _ref; a = 0 <= _ref ? ++_j : --_j) {
    for (b = _k = 0; 0 <= a ? _k < a : _k > a; b = 0 <= a ? ++_k : --_k) {
      newlist.push([list[a], list[b]]);
    }
  }
  return newlist;
};

weightMerger = function(_arg, _arg1) {
  var a1, a2, amax, asum, bound, h1, h2, maxh, maxw, maxx, maxy, minx, miny, w1, w2, waste, waste1, waste2, x1, x2, y1, y2;
  x1 = _arg[0], y1 = _arg[1], w1 = _arg[2], h1 = _arg[3], waste1 = _arg[4];
  x2 = _arg1[0], y2 = _arg1[1], w2 = _arg1[2], h2 = _arg1[3], waste2 = _arg1[4];
  minx = Math.min(x1, x2);
  miny = Math.min(y1, y2);
  maxx = Math.max(x1 + w1, x2 + w2);
  maxy = Math.max(y1 + h1, y2 + h2);
  maxw = maxx - minx;
  maxh = maxy - miny;
  a1 = w1 * h1;
  a2 = w2 * h2;
  asum = a1 + a2;
  amax = maxw * maxh;
  waste = waste1 + waste2 + Math.max(0, amax - asum);
  bound = [minx, miny, maxw, maxh, waste];
  if (!((y1 + h1) < y2 || y1 > (y2 + h2) || (x1 + w1) < x2 || x1 > (x2 + w2))) {
    return [-1, bound];
  }
  if ((amax - asum) < Math.pow(40, 2)) {
    return [waste, bound];
  }
  return null;
};

layers = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

getPixel = function(x, y) {
  return pixels[4 * (y * size + x) + 3] > 0;
};

smallBoundingBox = function(x, y) {
  var j, sched, xmax, xmin, ymax, ymin, _j, _k;
  xmin = 5;
  ymin = 5;
  xmax = -1;
  ymax = -1;
  sched = [[0, 0], [0, 3], [3, 3], [3, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [1, 3], [2, 0], [2, 1], [2, 2], [2, 3], [3, 1], [3, 2]];
  for (i = _j = 0; _j < 4; i = ++_j) {
    for (j = _k = 0; _k < 4; j = ++_k) {
      if ((xmin < i && i < xmax) && (ymin < j && j < ymax)) {
        continue;
      }
      if (getPixel(x + i, y + j)) {
        xmin = Math.min(xmin, i);
        xmax = Math.max(xmax, i);
        ymin = Math.min(ymin, j);
        ymax = Math.max(ymax, j);
      }
    }
  }
  if (ymax < 0) {
    return [];
  }
  return [[x + xmin, y + ymin, xmax - xmin, ymax - ymin, 0]];
};

divideQuadrants = function(x, y, w, h) {
  var a, b, bound, boundary, box, boxes, boxtmp, h1, h2, hh, hw, pair, pairs, score, skipbox, sorted, start, w1, w2, waste1, weight, x1, x2, y1, y2, _j, _len, _ref;
  if (w === 4 && h === 4) {
    return smallBoundingBox(x, y);
  }
  hw = w >> 1;
  hh = h >> 1;
  start = +(new Date);
  boxes = [].concat(divideQuadrants(x, y, hw, hh), divideQuadrants(x + hw, y, hw, hh), divideQuadrants(x + hw, y + hh, hw, hh), divideQuadrants(x, y + hh, hw, hh));
  skipbox = [];
  if (w > 512) {
    boundary = 128;
    x2 = x + boundary;
    y2 = y + boundary;
    w2 = w - boundary * 2;
    h2 = h - boundary * 2;
    boxtmp = boxes;
    boxes = [];
    for (_j = 0, _len = boxtmp.length; _j < _len; _j++) {
      box = boxtmp[_j];
      x1 = box[0], y1 = box[1], w1 = box[2], h1 = box[3], waste1 = box[4];
      if (x1 > x2 && y1 > y2 && (x1 + w1) < (x2 + w2) && (y1 + h1) < (y2 + h2)) {
        skipbox.push(box);
      } else {
        boxes.push(box);
      }
    }
  }
  while (boxes.length > 1) {
    pairs = (function() {
      var _k, _len1, _ref, _ref1, _results;
      _ref = combinations(boxes);
      _results = [];
      for (_k = 0, _len1 = _ref.length; _k < _len1; _k++) {
        _ref1 = _ref[_k], a = _ref1[0], b = _ref1[1];
        weight = weightMerger(a, b);
        if (weight) {
          _results.push(weight.concat([a, b]));
        } else {
          _results.push(null);
        }
      }
      return _results;
    })();
    pairs = (function() {
      var _k, _len1, _results;
      _results = [];
      for (_k = 0, _len1 = pairs.length; _k < _len1; _k++) {
        pair = pairs[_k];
        if (pair !== null) {
          _results.push(pair);
        }
      }
      return _results;
    })();
    if (pairs.length === 0) {
      break;
    }
    sorted = pairs.sort(function(a, b) {
      return a[0] - b[0];
    });
    _ref = sorted[0], score = _ref[0], bound = _ref[1], a = _ref[2], b = _ref[3];
    boxes = (function() {
      var _k, _len1, _results;
      _results = [];
      for (_k = 0, _len1 = boxes.length; _k < _len1; _k++) {
        box = boxes[_k];
        if (box !== a && box !== b) {
          _results.push(box);
        }
      }
      return _results;
    })();
    boxes.push(bound);
  }
  layers[Math.log(w) / Math.log(2) - 1] += new Date - start;
  return boxes.concat(skipbox);
};

reference = function(w, h) {
  var filled, _j, _k;
  filled = 0;
  for (x = _j = 0; 0 <= w ? _j < w : _j > w; x = 0 <= w ? ++_j : --_j) {
    for (y = _k = 0; 0 <= h ? _k < h : _k > h; y = 0 <= h ? ++_k : --_k) {
      if (pixels[4 * (y * size + x) + 3] > 0) {
        filled++;
      }
    }
  }
  return filled;
};

recursion = function(x, y, w, h) {
  var hh, hw;
  if (w === 1 && h === 1) {
    if (pixels[4 * (y * size + x) + 3] > 0) {
      return 1;
    } else {
      return 0;
    }
  }
  hw = w >> 1;
  hh = h >> 1;
  return recursion(x, y, hw, hh) + recursion(x + hw, y, hw, hh) + recursion(x + hw, y + hh, hw, hh) + recursion(x, y + hh, hw, hh);
};

basictree = function(x, y, w, h) {
  var boxes, hh, hw;
  if (w === 1 && h === 1) {
    if (pixels[4 * (y * size + x) + 3] > 0) {
      return [[x, y, 1, 1, 0]];
    } else {
      return [];
    }
  }
  hw = w >> 1;
  hh = h >> 1;
  boxes = [].concat(basictree(x, y, hw, hh), basictree(x + hw, y, hw, hh), basictree(x + hw, y + hh, hw, hh), basictree(x, y + hh, hw, hh));
  return boxes;
};

c.strokeStyle = "black";

console.time("filled");

console.log('fill', reference(size, size));

console.timeEnd("filled");

console.time("recursion");

console.log('recur', recursion(0, 0, size, size));

console.timeEnd("recursion");

console.time("tree");

console.log('basic', basictree(0, 0, size, size).length);

console.timeEnd("tree");

console.time("merge");

parts = divideQuadrants(0, 0, size, size);

console.timeEnd("merge");

for (_j = 0, _len = parts.length; _j < _len; _j++) {
  _ref = parts[_j], x = _ref[0], y = _ref[1], w = _ref[2], h = _ref[3], e = _ref[4];
  c.strokeRect(x + 0.5, y + 0.5, w, h);
}
