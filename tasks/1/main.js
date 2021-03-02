const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;
let animationID;

let phase1 = true //shape has to move towards right
let phase2 = false; //shape has to move diagonally towards bottom-left corner
let phase3 = false; //shape has to move towards right

const form = document.querySelector("form");
const select = document.querySelector("#shape");
const rectangleINfo = document.querySelector("#rectangle");
const squareInfo = document.querySelector("#square");
const circleINfo = document.querySelector("#circle");
const startBtn = document.querySelector("#start");
const restartBtn = document.querySelector("#restart");

let inpWidth = document.querySelector("#width");
let inpHeight = document.querySelector("#height");
let inpSide = document.querySelector("#side");
let inpRadius = document.querySelector("#radius");
let inpVelocity = document.querySelector("#velocity");
let inpColor = document.querySelector("#color");

let shape, rectangle, square, circle;


//Constructors and prototypes -----------------------------------------------------

function Shape(x, y, vel, color) {
  this.x = x;
  this.y = y;
  this.vel = vel;
  this.color = color;
}

function Rectangle(x, y, vel, color, width, height) {
  Shape.call(this, x, y, vel, color);
  this.width = width;
  this.height = height;
}

Rectangle.prototype = Object.create(Shape.prototype);
Object.defineProperty(Rectangle.prototype, "constructor", {
  value: Rectangle,
  enumerable: false,
  writable: true
});

Rectangle.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.fillRect(this.x, this.y, this.width, this.height);
  ctx.fill();
};

Rectangle.prototype.update = function() {
  if (phase1) {
    if (this.x < (width - this.width)) {
      this.x += this.vel;
    } else {
      this.vel = -(this.vel);
      phase1 = false;
      phase2 = true;
    }
  } 

  if (phase2) {
    if (this.y < (height - this.height)) {
      this.x += this.vel;
      //calculate y via linear equation
      this.y = (height - this.height) / (this.width - width) * this.x + height - this.height;
    } else {
      this.vel = -(this.vel);
      phase2 = false;
      phase3 = true;
    }
  }

  if (phase3) {
    if (this.x < (width - this.width)) {
      this.x += this.vel;
    } else {
      this.x = width - this.width;
      this.y = height - this.height;
    }
  }
};

function Circle(x, y, vel, color, radius) {
  Shape.call(this, x, y, vel, color);
  this.radius = radius;
}

Circle.prototype = Object.create(Shape.prototype);
Object.defineProperty(Circle.prototype, "constructor", {
  value: Circle,
  enumerable: false,
  writable: true
});

Circle.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
  ctx.fill();
};

Circle.prototype.update = function() {
  if (phase1) {
    if (this.x < (width - this.radius)) {
      this.x += this.vel;
    } else {
      this.vel = -(this.vel);
      phase1 = false;
      phase2 = true;
    }
  } 

  if (phase2) {
    if (this.y < (height - this.radius)) {
      this.x += this.vel;
      //calculate y via linear equation
      this.y = (height - this.radius) / (this.radius - width) * this.x + height - this.radius;
    } else {
      this.vel = -(this.vel);
      phase2 = false;
      phase3 = true;
    }
  }

  if (phase3) {
    if (this.x < (width - this.radius)) {
      this.x += this.vel;
    } else {
      this.x = width - this.radius;
      this.y = height - this.radius;
    }
  }
};

//Event listeners ----------------------------------------------------------------------

select.addEventListener("change", () => {
  if (select.value === "rectangle") {
    shape = rectangle;
    shape.x = shape.y = 0;
    shape.width = shape.height = 40;
    refresh();

    rectangleINfo.style.display = "block";
    squareInfo.style.display = "none";
    circleINfo.style.display = "none";
  } else if (select.value === "square") {
    shape = square;
    shape.x = shape.y = 0;
    shape.width = shape.height = 40;
    refresh();

    rectangleINfo.style.display = "none";
    squareInfo.style.display = "flex";
    circleINfo.style.display = "none";
  } else {
    shape = circle;
    shape.x = shape.y = shape.radius = 40;
    refresh();

    rectangleINfo.style.display = "none";
    squareInfo.style.display = "none";
    circleINfo.style.display = "flex";
  }

  shape.vel = 10;
  shape.color = "#1e90ff";

  inpWidth.value = 40;
  inpHeight.value = 40;
  inpSide.value = 40;
  inpRadius.value = 40;
  inpVelocity.value = 10;
  inpColor.value = "#1e90ff";
});

inpWidth.addEventListener("input", () => {
  shape.width = inpWidth.value;
  refresh();
});

inpHeight.addEventListener("input", () => {
  shape.height = inpHeight.value;
  refresh();
});

inpSide.addEventListener("input", () => {
  shape.width = shape.height = inpSide.value;
  refresh();
});

inpRadius.addEventListener("input", () => {
  shape.x = shape.y = shape.radius = parseInt(inpRadius.value);
  refresh();
});

inpVelocity.addEventListener("input", () => {
  shape.vel = parseInt(inpRadius.value);
});

inpColor.addEventListener("input", () => {
  shape.color = inpColor.value;
  refresh();
});

start.addEventListener("click", () => {
  select.disabled = true;
  inpWidth.disabled = true;
  inpHeight.disabled = true;
  inpSide.disabled = true;
  inpRadius.disabled = true;
  inpVelocity.disabled = true;

  select.style.cursor = "not-allowed";
  inpWidth.style.cursor = "not-allowed";
  inpHeight.style.cursor = "not-allowed";
  inpSide.style.cursor = "not-allowed";
  inpRadius.style.cursor = "not-allowed";
  inpVelocity.style.cursor = "not-allowed";

  animationID = rAF(loop);
});

restart.addEventListener("click", () => {
  cAF(animationID);

  rectangle.x = rectangle.y = square.x = square.y = 0;
  circle.x = circle.y = 40;
  rectangle.vel = square.vel = circle.vel = 10;
  rectangle.color = square.color = circle.color = "#1e90ff";
  rectangle.width = rectangle.height = square.width = square.height = 40;
  circle.radius = 40;
  refresh();

  inpWidth.value = 40;
  inpHeight.value = 40;
  inpSide.value = 40;
  inpRadius.value = 40;
  inpVelocity.value = 10;
  inpColor.value = "#1e90ff";

  phase1 = true;
  phase2 = false;
  phase3 = false;

  select.disabled = false;
  inpWidth.disabled = false;
  inpHeight.disabled = false;
  inpSide.disabled = false;
  inpRadius.disabled = false;
  inpVelocity.disabled = false;

  select.style.cursor = "auto";
  inpWidth.style.cursor = "auto";
  inpHeight.style.cursor = "auto";
  inpSide.style.cursor = "auto";
  inpRadius.style.cursor = "auto";
  inpVelocity.style.cursor = "auto";
});

// ----------------------------------------------------------------------------------------------

const rAF = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
const cAF = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

function loop() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
  ctx.fillRect(0, 0, width, height);

  shape.update();
  shape.draw();
  
  if (!(phase3 && (shape.constructor.name === "Rectangle" && shape.x >= width - shape.width ||
  shape.constructor.name === "Circle" && shape.x >= width - shape.radius))) {
    animationID = rAF(loop);
  } else {
    ctx.beginPath();
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, width, height);

    if (shape.constructor.name === "Rectangle") {
      shape.x = width - shape.width;
      shape.y = height - shape.height;
    } else {
      shape.x = width - shape.radius;
      shape.y = height - shape.radius;
    }

    shape.draw();

    phase1 = true;
    phase2 = false;
    phase3 = false;
  }
}

function refresh() {
  ctx.beginPath();
  ctx.fillStyle = "rgb(0, 0, 0)";
  ctx.fillRect(0, 0, width, height);
  shape.draw();
}

rectangle = new Rectangle(0, 0, parseInt(inpVelocity.value), inpColor.value, inpWidth.value, inpHeight.value);
square = new Rectangle(0, 0, parseInt(inpVelocity.value), inpColor.value, inpSide.value, inpSide.value);
circle = new Circle(0 + parseInt(inpRadius.value), 0 + parseInt(inpRadius.value), parseInt(inpVelocity.value), inpColor.value, inpRadius.value);
shape = rectangle;

refresh();
