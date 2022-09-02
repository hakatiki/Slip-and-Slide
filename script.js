const canvas = document.querySelector('.myCanvas');
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d');

// a function that clears the canvas
function clearCanvas() {
    ctx.fillStyle = 'rgb(70, 70, 70)';
    ctx.fillRect(0, 0, width, height);
}

// a class that stores a line x and y
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
// a function that draws a line
function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}
// a class that stores a list of lines
class Lines {
    constructor() {
        this.points = [];
        this.side = 0;
    }
    add(x, y) {
        this.points.push(new Point(x, y));
    }
    addPoint(point){
        this.points.push(point);
    }
    draw() {
        for (let i = 0; i < this.points.length-1; i++) {
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'rgb(255, 255, 255)';
            drawLine(this.points[i].x, this.points[i].y, this.points[i+1].x, this.points[i+1].y);
        }
        drawLine(this.points[this.points.length-1].x, this.points[this.points.length-1].y, this.points[0].x, this.points[0].y);
    }
    setSide(side){
        this.side = side;
    }
}

// a function that returns the center of the canvas
function getCenter() {
    return {
        x: width/2,
        y: height/2
    }
}


//a function that draws a circle
function drawCircle(x, y, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI*2, false);
    ctx.fillStyle = 'rgb(255, 0, 0)';
    ctx.fill();
}

canvas.addEventListener('click', function (e) {
    if (isFirstPlaced){
        const x = e.clientX;
        const y = e.clientY;
        second_x = x;
        second_y = y;
        isSecondPlaced = true;
        const diff_x = second_x - first_x;
        const diff_y = second_y - first_y;
        const plus_x = first_x + diff_x*1000.0;
        const plus_y = first_y + diff_y*1000.0;

        const minus_x = first_x - diff_x*1000.0;
        const minus_y = first_y - diff_y*1000.0;
        linesOfLines = cutShapes(plus_x, plus_y, minus_x, minus_y);
        isAnimate = true;
    }
    else if (!isFirstPlaced) {
    const x = e.clientX;
    const y = e.clientY;
    first_x = x;
    first_y = y;
    isFirstPlaced = true;
    }
});

function rhsOrLhs(lines, plus_x, plus_y, minus_x, minus_y ){
    for(let i = 0; i < lines.points.length; i++){
        area = getArea(lines.points[i],  new Point(plus_x, plus_y), new Point(minus_x, minus_y));
        if (Math.abs(area) < 0.01 ){
            continue;
        }
        else if (area > 0){
            return 1;
        }
        else {
            return -1;
        }
    }
}


// a function that returns true if two lines intersect
function doLinesIntersect(point_a, point_b, point_c, point_d) {
    const a = point_a.x;
    const b = point_a.y;
    const c = point_b.x;
    const d = point_b.y;
    const p = point_c.x;
    const q = point_c.y;
    const r = point_d.x;
    const s = point_d.y;
    var det, gamma, lambda;
    det = (c - a) * (s - q) - (r - p) * (d - b);
    if (det === 0) {
      return false;
    } else {
      lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
      gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
      return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
    }
}
function line_intersect(point_a, point_b, point_c, point_d)
{
    const x1 = point_a.x;
    const y1 = point_a.y;
    const x2 = point_b.x;
    const y2 = point_b.y;
    const x3 = point_c.x;
    const y3 = point_c.y;
    const x4 = point_d.x;
    const y4 = point_d.y;
    var ua, ub, denom = (y4 - y3)*(x2 - x1) - (x4 - x3)*(y2 - y1);
    if (denom == 0) {
        return null;
    }
    ua = ((x4 - x3)*(y1 - y3) - (y4 - y3)*(x1 - x3))/denom;
    ub = ((x2 - x1)*(y1 - y3) - (y2 - y1)*(x1 - x3))/denom;
    return {
        x: x1 + ua * (x2 - x1),
        y: y1 + ua * (y2 - y1),
        seg1: ua >= 0 && ua <= 1,
        seg2: ub >= 0 && ub <= 1
    };
}
// a function that returns the area of a triangle using determinant
function getArea(point_a, point_b, point_c) {
    const x1 = point_a.x;
    const y1 = point_a.y;
    const x2 = point_b.x;
    const y2 = point_b.y;
    const x3 = point_c.x;
    const y3 = point_c.y;
    return (x1*(y2-y3) + x2*(y3-y1)+ x3*(y1-y2))/2;
}
// a function that cuts the lines at the intersection point
function cutShapes(plus_x, plus_y, minus_x, minus_y) {
    var newLinesOfLines = [];
    for (let i = 0; i < linesOfLines.length; i++) {
        let first_index = -1;
        let second_index = -1
        for (let j = 0; j < linesOfLines[i].points.length-1; j++) {
            if (doLinesIntersect(linesOfLines[i].points[j], linesOfLines[i].points[j+1], new Point(plus_x, plus_y), new Point(minus_x, minus_y))) {
                if (first_index == -1) {
                    first_index = j;
                }
                else if (second_index == -1) {
                    second_index = j;
                    break;
                }
            }
        }
        if (doLinesIntersect(linesOfLines[i].points[linesOfLines[i].points.length-1], linesOfLines[i].points[0], new Point(plus_x, plus_y), new Point(minus_x, minus_y))) {
            if (second_index == -1) {
                second_index = linesOfLines[i].points.length-1;
            }
        }
        console.log(first_index, second_index);
        if (first_index != -1 && second_index != -1) {
            let newLinesFirst = new Lines();
            let newLinesSecond = new Lines();
            var first_index_pair = first_index + 1;
            var second_index_pair = second_index == linesOfLines[i].points.length-1 ? 0 : second_index + 1; 
            var first_intersect = line_intersect(linesOfLines[i].points[first_index], linesOfLines[i].points[first_index_pair], new Point(plus_x, plus_y), new Point(minus_x, minus_y));
            var second_intersect = line_intersect(linesOfLines[i].points[second_index], linesOfLines[i].points[second_index_pair], new Point(plus_x, plus_y), new Point(minus_x, minus_y));
            for (let k = first_index + 1; k <= second_index; k++) {
                let mod_k = k % linesOfLines[i].points.length;
                newLinesFirst.addPoint(linesOfLines[i].points[mod_k]);
            }
            if (getArea( linesOfLines[i].points[second_index], new Point(first_intersect.x, first_intersect.y), new Point(second_intersect.x, second_intersect.y)) > 0) {
                newLinesFirst.addPoint(new Point(first_intersect.x, first_intersect.y));
                newLinesFirst.addPoint(new Point(second_intersect.x, second_intersect.y));
            }
            else{
                newLinesFirst.addPoint(new Point(second_intersect.x, second_intersect.y));
                newLinesFirst.addPoint(new Point(first_intersect.x, first_intersect.y));
            }
            for (let k = second_index+1; k <= first_index+linesOfLines[i].points.length; k++) {
                let mod_k = k % linesOfLines[i].points.length;
                newLinesSecond.addPoint(linesOfLines[i].points[mod_k]);
            }
            if (getArea( linesOfLines[i].points[first_index], new Point(first_intersect.x, first_intersect.y), new Point(second_intersect.x, second_intersect.y)) > 0) {
                newLinesSecond.addPoint(new Point(first_intersect.x, first_intersect.y));
                newLinesSecond.addPoint(new Point(second_intersect.x, second_intersect.y));
            }
            else{
                newLinesSecond.addPoint(new Point(second_intersect.x, second_intersect.y));
                newLinesSecond.addPoint(new Point(first_intersect.x, first_intersect.y));
            }
            newLinesFirst.setSide(rhsOrLhs(newLinesFirst, plus_x, plus_y, minus_x, minus_y));
            newLinesSecond.setSide(rhsOrLhs(newLinesSecond, plus_x, plus_y, minus_x, minus_y));
            newLinesOfLines.push(newLinesFirst);
            newLinesOfLines.push(newLinesSecond);
            console.log(newLinesFirst);
            console.log(newLinesSecond);
        }
        else{
            linesOfLines[i].setSide(rhsOrLhs(linesOfLines[i], plus_x, plus_y, minus_x, minus_y));
            newLinesOfLines.push(linesOfLines[i]);

        }
    }
    return newLinesOfLines;
}

function init() {
    window.requestAnimationFrame(draw);
}
function draw() {
  
    clearCanvas();
    // draw the lines in a for
    for (let i = 0; i < linesOfLines.length; i++) {
        linesOfLines[i].draw();
    }
    if (isFirstPlaced){
        drawCircle(first_x, first_y, 3);
    }
    if (isSecondPlaced && isFirstPlaced){
        drawCircle(second_x, second_y, 3);
        const diff_x = second_x - first_x;
        const diff_y = second_y - first_y;
        const plus_x = first_x + diff_x*1000.0;
        const plus_y = first_y + diff_y*1000.0;

        const minus_x = first_x - diff_x*1000.0;
        const minus_y = first_y - diff_y*1000.0;
        drawLine(minus_x, minus_y, plus_x, plus_y);
    }
    if (isAnimate && isFirstPlaced && isSecondPlaced) {
        const diff_x = second_x - first_x;
        const diff_y = second_y - first_y;
        const normal_x = diff_x / Math.sqrt(diff_x*diff_x + diff_y*diff_y);
        const normal_y = diff_y / Math.sqrt(diff_x*diff_x + diff_y*diff_y);
        for (let i = 0; i < linesOfLines.length; i++) {
            for (let j = 0; j < linesOfLines[i].points.length; j++) {
                linesOfLines[i].points[j].x += normal_x*0.8*linesOfLines[i].side;
                linesOfLines[i].points[j].y += normal_y*0.8*linesOfLines[i].side;
            }
        }
        animated += 1;
        if (animated > 30){
            isAnimate = false;
            isFirstPlaced = false;
            isSecondPlaced = false;
            animated = 0;
        }
    }
    window.requestAnimationFrame(draw);
}
let first_x = 0;
let first_y = 0;
let isFirstPlaced = false;
let second_x = 0;
let second_y = 0;
let isSecondPlaced = false;
let animated = 0;
let isAnimate = false;
const center_x = getCenter().x;
const center_y = getCenter().y;
const square_size = 200;
const lines = new Lines();
lines.add(center_x-square_size, center_y-square_size);
lines.add(center_x+square_size, center_y-square_size);
lines.add(center_x+square_size, center_y+square_size);
lines.add(center_x-square_size, center_y+square_size);

let linesOfLines = [lines];  
init();