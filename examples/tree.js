var Branch, Dot, Flower, Ground, Leaf, Line, Seed, Sky, Tree, drawCircleByText, drawGroundByText, drawLineByText, drawTreeByText, getLength, log, makeDNAByInteger, makeDNAByString, oText, test, _buffer, _eIndex;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
test = function(name, func) {
  console.log("--------" + name + " Test code...------------");
  func();
  return console.log("----------------------------------------");
};
window.height = 300;
window.width = 400;
log = function(txt) {
  return console.log(txt);
};
Dot = function(pos) {
  if (pos == null) {
    pos = {
      x: 0,
      y: 0
    };
  }
  this.position = {
    x: pos.x,
    y: pos.y
  };
  return this;
};
Line = function(start, end) {
  if (start == null) {
    start = {
      x: 0,
      y: 0
    };
  }
  if (end == null) {
    end = null;
  }
  this.start = {
    x: start.x,
    y: start.y
  };
  if (end != null) {
    this.end = {
      x: end.x,
      y: end.y
    };
  } else {
    this.end = {
      x: start.x,
      y: start.y
    };
  }
  return this;
};
getLength = function(something) {
  var dx, dy;
  if (something.start != null) {
    dx = this.end.x - this.start.x;
    dy = this.end.y - this.start.y;
    Math.sqrt(dx * dx + dy * dy);
  }
  return 0;
};
makeDNAByInteger = function(p, l) {
  var dna, i, _ref;
  dna = [];
  for (i = _ref = l - 1; _ref <= 0 ? i <= 0 : i >= 0; _ref <= 0 ? i++ : i--) {
    dna[i] = p % 10;
    p = Math.floor(p / 10);
  }
  return dna;
};
makeDNAByString = function(p, l) {
  var dna, i, k, _ref, _ref2;
  dna = [];
  k = 0;
  for (i = 0, _ref = l - p.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
    dna.push(0);
  }
  for (i = _ref2 = l - p.length; _ref2 <= l ? i < l : i > l; _ref2 <= l ? i++ : i--) {
    dna.push(p.charCodeAt(k) - 48);
    k += 1;
  }
  return dna;
};
Tree = function(DNA, position) {
  this.DNA = DNA != null ? DNA : [];
  if (position == null) {
    position = {
      x: 0,
      y: 0
    };
  }
  Dot.call(this, position);
  this.nutrients = 0;
  this.water = 0;
  this.energy = 0;
  this.branches = [new Branch(position, 0, this)];
  this.leaves = [];
  this.flowers = [];
  this.seeds = [];
  this.size = {
    x: 0,
    y: 0
  };
  this.leavesWidth = 0;
  this.state = {};
  return this;
};
Tree.prototype.addBranch = function(branch) {
  var dx, dy;
  this.branches.push(branch);
  dx = branch.end.x - this.position.x;
  dy = branch.end.y - this.position.y;
  if (this.size.x < dx * 2) {
    this.size.x = dx * 2;
  }
  if (this.size.y < dy * 2) {
    return this.size.y = dy * 2;
  }
};
Tree.prototype.setPosition = function(x, y) {
  var branch, dx, dy, flower, leaf, seed, _i, _j, _k, _l, _len, _len2, _len3, _len4, _ref, _ref2, _ref3, _ref4, _results;
  dx = x - this.position.x;
  dy = y - this.position.y;
  this.position.x = x;
  this.position.y = y;
  _ref = this.branches;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    branch = _ref[_i];
    branch.start.x += dx;
    branch.start.y += dy;
    branch.end.x += dx;
    branch.end.y += dy;
  }
  _ref2 = this.leaves;
  for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
    leaf = _ref2[_j];
    leaf.start.x += dx;
    leaf.start.y += dy;
    leaf.end.x += dx;
    leaf.end.y += dy;
  }
  _ref3 = this.flowers;
  for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
    flower = _ref3[_k];
    flower.position.x += dx;
    flower.position.y += dy;
  }
  _ref4 = this.seeds;
  _results = [];
  for (_l = 0, _len4 = _ref4.length; _l < _len4; _l++) {
    seed = _ref4[_l];
    seed.position.x += dx;
    _results.push(seed.position.y += dy);
  }
  return _results;
};
Tree.prototype.addLeaf = function(leaf) {
  this.leaves.push(leaf);
  return this.leavesWidth += leaf.length;
};
Tree.prototype.addFlower = function(flower) {
  return this.flowers.push(flower);
};
Tree.prototype.addSeed = function(seed) {
  return this.flowers.push(seed);
};
Tree.prototype.grow = function() {
  var branch, flower, leaf, seed, _i, _j, _k, _l, _len, _len2, _len3, _len4, _ref, _ref2, _ref3, _ref4, _results;
  _ref = this.branches;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    branch = _ref[_i];
    branch.grow();
  }
  _ref2 = this.flowers;
  for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
    flower = _ref2[_j];
    flower.bloom();
  }
  _ref3 = this.leaves;
  for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
    leaf = _ref3[_k];
    leaf.grow();
  }
  _ref4 = this.seeds;
  _results = [];
  for (_l = 0, _len4 = _ref4.length; _l < _len4; _l++) {
    seed = _ref4[_l];
    _results.push(seed.grow());
  }
  return _results;
};
Branch = function(position, angle, tree) {
  this.angle = angle != null ? angle : 0;
  this.tree = tree != null ? tree : null;
  Line.call(this, position);
  this.state = {
    child: true
  };
  this.DNAPointer = 0;
  this.reculsiveNumber = 0;
  return this;
};
Branch.prototype.grow = function() {
  var DNA, angle, gene, length;
  DNA = this.tree.DNA;
  gene = DNA[this.DNAPointer];
  switch (gene) {
    case 0:
      this["long"]();
      break;
    case 1:
    case 4:
    case 5:
      if (this.DNAPointer + 4 < DNA.length) {
        angle = (DNA[++this.DNAPointer] * 10 + DNA[++this.DNAPointer]) * 0.01 * Math.PI - Math.PI * 0.5;
        length = (DNA[++this.DNAPointer] * 10 + DNA[++this.DNAPointer]) * 0.3;
        this["addLeaf"](angle, length);
      }
      break;
    case 2:
    case 6:
    case 7:
      if (this.DNAPointer + 2 < DNA.length) {
        angle = (DNA[++this.DNAPointer] * 10 + DNA[++this.DNAPointer]) * 0.01 * Math.PI - Math.PI * 0.5;
        this["addBranch"](angle);
      }
      break;
    case 3:
    case 8:
      if (this.DNAPointer + 4 < DNA.length) {
        angle = (DNA[++this.DNAPointer] * 10 + DNA[++this.DNAPointer]) * 0.01 * Math.PI - Math.PI * 0.5;
        length = DNA[++this.DNAPointer] * 10 + DNA[++this.DNAPointer];
        this["addFlower"](angle, length);
      }
      break;
    case 9:
      this.DNAPointer -= 1;
      break;
    default:
      if (typeof this[gene] === "function") {
        this[gene]();
      }
  }
  if (++this.DNAPointer >= DNA.length) {
    return this.DNAPointer = 0;
  }
};
Branch.prototype.long = function() {
  if (this.tree.nutrients > 10 && this.tree.energy > 10) {
    this.state.child = false;
    this.tree.nutrients -= 10;
    this.tree.energy -= 10;
    this.end.x += Math.cos(this.angle + Math.PI * 0.5);
    return this.end.y += Math.sin(this.angle + Math.PI * 0.5);
  }
};
Branch.prototype.addBranch = function(angle) {
  if (this.tree.nutrients > 5 && this.tree.energy > 5) {
    this.tree.addBranch(new Branch(this.end, this.angle + angle, this.tree));
    this.tree.nutrients -= 5;
    return this.tree.energy -= 5;
  }
};
Branch.prototype.addLeaf = function(angle, length) {
  if (this.tree.nutrients > 5 && this.tree.energy > 5) {
    this.tree.addLeaf(new Leaf(this.end, this.angle + angle, length, this.tree));
    this.tree.nutrients -= 5;
    return this.tree.energy -= 5;
  }
};
Branch.prototype.addFlower = function(angle, pretty) {
  if (this.tree.nutrients > 5 && this.tree.energy > 5) {
    this.tree.addFlower(new Flower(this.end, this.angle + angle, pretty, this.tree));
    this.tree.nutrients -= 5;
    return this.tree.energy -= 5;
  }
};
Branch.prototype.reculsive = function(howMany) {
  var DNA, reculsivePoint;
  DNA = this.DNA;
  if (this.DNAPointer < 2) {
    return 0;
  }
  if (!((DNA[this.DNAPointer + 1] != null) && (DNA[this.DNAPointer + 2] != null))) {
    return 0;
  }
  reculsivePoint = this.DNAPointer - 2;
  if (++this.reculsiveNumber >= howMany) {
    this.reculsiveNumber = 0;
    this.DNAPointer = reculsivePoint + 3;
  }
  this.grow();
  return this.DNAPointer = reculsivePoint;
};
Leaf = function(position, angle, length, tree) {
  this.angle = angle != null ? angle : 0;
  this.length = length != null ? length : 10;
  this.tree = tree != null ? tree : null;
  Line.call(this, position, {
    x: position.x + Math.cos(angle + Math.PI * 0.5) * length,
    y: position.y + Math.sin(angle + Math.PI * 0.5) * length
  });
  this.state = {
    child: true
  };
  return this;
};
Leaf.prototype.grow = function() {
  if (this.tree.water > 100) {
    return this.state.child = false;
  }
};
Leaf.prototype.photosynthesis = function() {
  if (!this.state.child) {
    this.tree.nutrients -= this.length = getLength(this);
    return this.tree.energy += this.length;
  }
};
Flower = function(position, angle, pretty, tree) {
  this.angle = angle;
  this.pretty = pretty != null ? pretty : 1;
  this.tree = tree != null ? tree : null;
  Dot.call(this, position);
  this.state = {
    child: true,
    pollinated: false
  };
  return this;
};
Flower.prototype.pollination = function(DNA) {
  var i, lDNA, nDNA, r, sDNA, _ref;
  if (DNA.length > this.DNA.length) {
    lDNA = DNA;
    sDNA = this.DNA;
  } else {
    lDNA = this.DNA;
    sDNA = DNA;
  }
  r = Math.floor(Math.random() * lDNA.length);
  nDNA = [];
  for (i = 0; 0 <= r ? i < r : i > r; 0 <= r ? i++ : i--) {
    nDNA.push(sDNA[i]);
  }
  for (i = r, _ref = lDNA.length; r <= _ref ? i < _ref : i > _ref; r <= _ref ? i++ : i--) {
    nDNA.push(lDNA[i]);
  }
  return this.tree.addSeed(new Seed(this.position, nDNA[nDNA.length - 1], nDNA[nDNA.length - 2], nDNA, this.tree));
};
Flower.prototype.bloom = function() {
  if (this.tree.energy > 100) {
    return this.state.child = false;
  }
};
Seed = function(position, lastMass, taste, DNA, tree) {
  this.lastMass = lastMass != null ? lastMass : 1;
  this.taste = taste != null ? taste : 1;
  this.DNA = DNA != null ? DNA : [];
  this.tree = tree != null ? tree : null;
  Dot.call(this, position);
  this.nutrients = 0;
  this.energy = 0;
  this.mass = 1;
  this.state = {
    child: true,
    fly: false
  };
  return this;
};
Seed.prototype.grow = function() {
  var tree;
  tree = this.tree;
  if (this.mass < this.lastMass && tree.energy > 1 && tree.nutrients > 1) {
    this.mass += 1;
    this.energy += 1;
    this.nutrients += 1;
    tree.energy -= 1;
    return tree.nutrients -= 1;
  } else if (this.mass >= this.lastMass) {
    return this.goAway();
  }
};
Seed.prototype.goAway = function() {
  this.state.child = false;
  this.state.fly = true;
  return this.tree = null;
};
Seed.prototype.germinate = function() {
  var tree;
  tree = new Tree(this.DNA, this.position);
  tree.nutrients = this.nutrients;
  tree.energy = this.energy;
  return tree;
};
oText = function(x, y, text, size, color, _i) {
  this.x = x;
  this.y = y;
  this.text = text;
  this.size = size;
  this.color = color;
  this._i = _i;
  this.body = document.createElement('h1');
  this.body.innerHTML = text;
  this.body.style.position = "absolute";
  this.body.style.left = x + 'px';
  this.body.style.top = y + 'px';
  this.body.style.fontSize = this.size + 'px';
  this.body.style.color = color;
  document.body.appendChild(this.body);
  return this;
};
oText.buffer = [];
oText.emptyIndexes = [];
_eIndex = oText.emptyIndexes;
_buffer = oText.buffer;
oText.prototype.setPosition = function(x, y) {
  if (x != null) {
    this.x = x;
  }
  if (y != null) {
    this.y = y;
  }
  this.body.style.left = this.x + 'px';
  return this.body.style.top = this.y + 'px';
};
oText.prototype.settext = function(text) {
  this.text = text;
  return this.body.innerHTML = text;
};
oText.prototype.setSize = function(size) {
  this.size = size;
  return this.body.style.fontSize = this.size + 'px';
};
oText.prototype.setColor = function(color) {
  this.color = color;
  return this.body.style.color = this.color;
};
oText.prototype.remove = function() {
  this.body.innerHTML = "";
  return _eIndex.push(this._i);
};
oText.prototype.free = function() {
  return _eIndex.push(this._i);
};
oText.create = function(x, y, text, size, color) {
  var a;
  if (_eIndex.length === 0) {
    a = new oText(x, y, text, size, color, _buffer.length);
    _buffer.push(a);
  } else {
    a = _buffer[_eIndex[_eIndex.length - 1]];
    _eIndex.length -= 1;
    a.setPosition(x, y);
    a.settext(text);
    a.setSize(size);
    a.setColor(color);
  }
  return a;
};
oText.allFree = function() {
  var b, _i, _len, _results;
  _results = [];
  for (_i = 0, _len = _buffer.length; _i < _len; _i++) {
    b = _buffer[_i];
    _results.push(b.free());
  }
  return _results;
};
oText.clear = function() {
  var b, _i, _len, _results;
  _results = [];
  for (_i = 0, _len = _buffer.length; _i < _len; _i++) {
    b = _buffer[_i];
    _results.push(b.remove());
  }
  return _results;
};
drawLineByText = function(line, text, space, color) {
  var d, dx, dy, ex, ey, sx, sy, tx, ty, _results;
  sx = line.start.x;
  sy = line.start.y;
  ex = line.end.x;
  ey = line.end.y;
  d = Math.sqrt((ex - sx) * (ex - sx) + (ey - sy) * (ey - sy));
  dx = (ex - sx) / d * space;
  dy = (ey - sy) / d * space;
  if (dx > 0) {
    tx = 1;
  } else {
    tx = -1;
  }
  if (dy > 0) {
    ty = 1;
  } else {
    ty = -1;
  }
  _results = [];
  while (sx * tx <= ex * tx && sy * ty <= ey * ty) {
    oText.create(sx, window.height - sy, text, space, color);
    sx += dx;
    _results.push(sy += dy);
  }
  return _results;
};
drawCircleByText = function(cx, cy, r, text, space, color) {
  var a, dA, pi2, x, y, _results;
  a = 0;
  x = 0;
  y = 0;
  dA = 1 / r * space;
  pi2 = Math.PI * 2;
  _results = [];
  while (a < pi2) {
    x = Math.cos(a) * r;
    y = Math.sin(a) * r;
    oText.create(cx + x, window.height - (cy + y), text, space, color);
    _results.push(a += dA);
  }
  return _results;
};
drawTreeByText = function(tree) {
  var DNA, b, branch, f, flower, l, leaf, _i, _j, _k, _len, _len2, _len3, _ref, _ref2, _ref3, _results;
  DNA = tree.DNA;
  b = String.fromCharCode(33 + DNA[DNA.length - 1] * 9 + DNA[DNA.length - 2]);
  l = String.fromCharCode(33 + DNA[DNA.length - 3] * 9 + DNA[DNA.length - 4]);
  f = String.fromCharCode(33 + DNA[DNA.length - 5] * 9 + DNA[DNA.length - 6]);
  _ref = tree.flowers;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    flower = _ref[_i];
    drawCircleByText(flower.position.x, flower.position.y, 2, f, 1, "#CD5C5C");
  }
  _ref2 = tree.branches;
  for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
    branch = _ref2[_j];
    drawLineByText(branch, b, 3, "#8B4513");
  }
  _ref3 = tree.leaves;
  _results = [];
  for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
    leaf = _ref3[_k];
    _results.push(drawLineByText(leaf, l, 2, "#8FBC8F"));
  }
  return _results;
};

drawTreeByCanvas = function (tree) {
  var DNA, b, branch, f, flower, l, leaf, _i, _j, _k, _len, _len2, _len3, _ref, _ref2, _ref3, _results;
  var context = document.getElementById("screen").getContext("2d");
  
  DNA = tree.DNA;
  b = String.fromCharCode(33 + DNA[DNA.length - 1] * 9 + DNA[DNA.length - 2]);
  l = String.fromCharCode(33 + DNA[DNA.length - 3] * 9 + DNA[DNA.length - 4]);
  f = String.fromCharCode(33 + DNA[DNA.length - 5] * 9 + DNA[DNA.length - 6]);
  _ref = tree.flowers;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    flower = _ref[_i];
    context.beginPath();
    context.fillStyle = "#CD5C5C";
    context.arc(flower.position.x, window.height - flower.position.y, 2, 0, Math.PI*2, false);
    context.closePath();
    context.fill();
  }
  _ref2 = tree.branches;
  for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
    branch = _ref2[_j];
    context.beginPath();
    context.strokeStyle = "#8B4513";
    context.moveTo(branch.start.x, window.height -branch.start.y);
    context.lineTo(branch.end.x, window.height -branch.end.y);
    context.closePath();
    context.stroke();
  }
  _ref3 = tree.leaves;
  for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
    leaf = _ref3[_k];
    context.beginPath();;
    context.strokeStyle = "#8FBC8F";
    context.moveTo(leaf.start.x, window.height -leaf.start.y);
    context.lineTo(leaf.end.x, window.height -leaf.end.y);
    context.closePath();
    context.stroke();
  }
};

test("tree", function() {
  var branch, i, leaf, t, _i, _j, _k, _len, _len2, _len3, _ref, _ref2, _ref3;
  t = new Tree([0, 0, 0, 0, 2, 3, 0, 2, 7, 0]);
  t.nutrients = 100;
  t.water = 100;
  t.energy = 100;
  for (i = 0; i <= 10; i++) {
    t.grow();
    log("--" + i + " : --");
    log("branch : ");
    _ref = t.branches;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      branch = _ref[_i];
      log("" + branch.start.x + ", " + branch.start.y + " / " + branch.end.x + ", " + branch.end.y);
    }
    log("leaf : ");
    _ref2 = t.leaves;
    for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
      leaf = _ref2[_j];
      log("" + leaf.start.x + ", " + leaf.start.y + " / " + leaf.end.x + ", " + leaf.end.y);
    }
    log("flower : ");
    _ref3 = t.flowers;
    for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
      leaf = _ref3[_k];
      log("" + leaf.position.x + ", " + leaf.position.y);
    }
  }
  return drawTreeByText(t);
});
Ground = function(shape) {
  if (shape == null) {
    shape = [];
  }
  this.trees = [];
  this.seeds = [];
  this.sizeOfTile = 10;
  this.shape = shape;
  this.width = shape.length;
  this.nutrients = [];
  this.water = [];
  return this.removeTreeSequence = null;
};
Ground.prototype.addTree = function(tree) {
  var i, otree, _len, _ref;
  tree.setPosition(tree.position.x, this.shape[Math.floor(tree.position.x)]);
  _ref = this.trees;
  for (i = 0, _len = _ref.length; i < _len; i++) {
    otree = _ref[i];
    if (otree.position.x > tree.position.x) {
      this.trees.splice(i, 0, tree);
      return tree;
    }
  }
  return this.trees.push(tree);
};
Ground.prototype.removeTree = function(tree) {
  var _ref, _ref2;
  this.tree.state["die"] = true;
  if ((_ref = this._i) == null) {
    this._i = 0;
  }
  return (_ref2 = this.removeTreeSequence) != null ? _ref2 : this.removeTreeSequence = setInterval(__bind(function() {
    var x;
    if (!(this._i > this.trees.length)) {}
    tree = this.trees[this._i];
    x = Math.floor(tree.position.x / this.sizeOfTile);
    if (!(tree.state["die"] === true && this.water[x] > 100)) {}
    return this._i++;
  }, this), 10);
};
Ground.prototype.treeGrow = function() {
  var tree, x, _i, _len, _ref, _results;
  _ref = this.trees;
  _results = [];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    tree = _ref[_i];
    tree.grow();
    x = Math.floor(tree.position.x / this.sizeOfTile);
    _results.push(this.water[x] > 10 ? (tree.water += 10, this.water[x] -= 10) : void 0);
  }
  return _results;
};
drawGroundByText = function(ground) {
  var size, tree, x, y, _i, _len, _len2, _ref, _ref2, _results;
  size = 6;
  oText.allFree();
  _ref = ground.trees;
  width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  sx = document.body.scrollLeft;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    tree = _ref[_i];
    if(sx < tree.position.x && sx+width > tree.position.x)
      drawTreeByCanvas(tree);
    console.log("sx : " + sx + "width : " + width);
  }
  _ref2 = ground.shape;
  _results = [];
  for (x = 0, _len2 = _ref2.length; x < _len2; x++) {
    y = _ref2[x];
    oText.create(x, window.height - 8 - y, "-", size, "black");
    _results.push(x += size - 1);
  }
  return _results;
};
test("ground with tree", function() {
  var g;
  return g = new Ground([10, 10, 10, 10, 11, 11, 11, 11, 12, 12, 12, 12, 13, 13, 13, 13, 13, 13, 13, 13, 12, 12, 12, 12, 11, 11, 11, 11, 10, 10, 10, 10, 10]);
});
Sky = function(ground, sea) {
  this.ground = ground != null ? ground : null;
  this.sea = sea != null ? sea : null;
  this.water = 0;
  this.width = ground.width;
  this.date = 0;
  this.time = 0;
  this.minite = 0;
  this.second = 0;
  this.timeRatio = 24;
  this.lights = [];
  this.lastTime = 0;
  return setInterval(function() {
    if (this.second < 60) {
      return this.second += 1;
    } else {
      if (this.minite < 60) {
        return this.minite += 1;
      } else {
        if (this.time < 24) {
          return this.time += 1;
        } else {
          return this.date += 1;
        }
      }
    }
  }, 1000 / this.timeRatio);
};
Sky.prototype.shine = function() {
  var a, angle, b, c, i, width, _ref, _results;
  width = this.width;
  this.sunshine = (10000 * width - this.water) / (10000 * width);
  _results = [];
  for (i = 0, _ref = this.sunshine * width * 0.1; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
    angle = Math.PI * time / 24;
    a = Math.cos(angle);
    b = Math.sin(angle);
    c = Math.random(width * 0.5) - width;
    _results.push(this.lights.push({
      a: a,
      b: b,
      c: c
    }));
  }
  return _results;
};
Sky.prototype.makePhotosynthesis = function() {
  var A, B, C, a, b, c, leaf, light, nearLeaf, nearX, tree, x, x1, x2, y1, y11, y12, y2, y21, y22, _i, _j, _k, _len, _len2, _len3, _ref, _ref2, _ref3;
  _ref = this.lights;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    light = _ref[_i];
    nearLeaf = null;
    nearX = null;
    _ref2 = this.ground.trees;
    for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
      tree = _ref2[_j];
      a = light.a;
      b = light.b;
      c = light.c;
      y11 = (-a * (tree.pos.x - tree.size.x * 0.5) - c) / b;
      y21 = (-a * (tree.pos.x + tree.size.x * 0.5) - c) / b;
      y12 = tree.pos.y;
      y22 = tree.pos.y + tree.size.y;
      if ((y11 > y22 && y12 > y22) || (y11 < y12 && y21 < y12)) {
        continue;
      }
      _ref3 = tree.leaves;
      for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
        leaf = _ref3[_k];
        x1 = leaf.start.x;
        x2 = leaf.end.x;
        y1 = leaf.start.y;
        y2 = leaf.end.y;
        A = y1 - y2;
        B = -(x1 - x2);
        C = x1 * y2 - x2 * y1;
        x = (B * c - C * b) / (A * b - B * a);
        if ((x1 < x && x < x2)) {
          if (a > 0 && nearX < x) {
            nearX = x;
            nearLeaf = leaf;
          }
          if (a < 0 && nearX > x) {
            nearX = x;
            nearLeaf = leaf;
          }
        }
      }
    }
    if (nearLeaf != null) {
      nearLeaf.photosynthesis();
    }
  }
  return this.lights = [];
};
Sky.prototype.vaporize = function() {
  var tree, _i, _len, _ref, _results;
  this.water += this.sea.width;
  this.sea.water -= this.sea.width;
  _ref = this.ground.trees;
  _results = [];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    tree = _ref[_i];
    _results.push(tree.water > tree.leavesWidth ? (tree.water -= tree.leavesWidth, this.water += tree.leavesWidth) : void 0);
  }
  return _results;
};
makeRandomTree = function (x){
  var dna = makeDNAByInteger(Math.floor(Math.random()*100000000000), 20);
  var t = new Tree(dna, {x:Math.floor(Math.random()*x), y:0});
  t.nutrients = 10000;
  t.water = 10000;
  t.energy = 10000;
  return t;
};
test("ground with tree", function() {
  var g;
  var shape = []
  var t = 10;
  for(var i=0; i<1000; i++){
    shape.push(t);
    if(Math.random()<0.3)t+=1;
    if(Math.random()<0.3)t-=1;
  }
  g = new Ground(shape);
  for(var j=0; j<10; j++){
    g.addTree(makeRandomTree(1000));
  }
  for(var i=0; i<g.trees.length; i++)
    log(g.trees[i].DNA);
  setInterval(function (){
    g.treeGrow();
    drawGroundByText(g);
  }, 100)
  
});