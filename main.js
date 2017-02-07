var initMap = [
    [0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0], 
    [1,1,1,1,1,1,1,1,0,1,0,0,0,0,0,0,1,0,0,0],
    [0,0,0,0,0,0,0,1,0,1,1,0,1,1,1,0,1,0,0,0],
    [0,0,0,0,0,0,0,1,1,0,1,0,1,0,1,0,1,1,1,1],
    [0,1,1,1,1,0,0,0,1,1,1,0,1,0,1,0,0,0,0,1],
    [0,1,0,0,1,0,0,0,0,0,0,0,1,0,1,1,1,1,1,1],
    [0,1,0,0,1,0,1,1,1,1,1,0,1,0,0,0,0,0,0,0],
    [0,1,0,0,1,1,1,0,0,0,1,0,1,1,1,1,1,1,0,0],
    [0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0],
    [0,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0]];
var squares = [];
var c = document.getElementById('canvasOne');
var ctx = c.getContext('2d');
var cw = c.width = 1100;
var ch = c.height = 600;
var PI2 = Math.PI*2;
var particles = [];
var towers = []; 
var shots = [];
var partiID = 0;
var money = 500;
var health = 15;
var level = 0;

var boxOpened = false;
var boxDirectionX = "right"; //(left, right)
var boxDirectionY = "up"; //(up, down)
var boxXY = [0,0];
var hoverBox = [0,0];
var hoverText = [];
var hover = false;

var lastSquare = [0,0];
var selected = 0;
var shopStrokeStyle = ["rgb(0,0,0)","rgb(0,0,0)","rgb(0,0,0)"];

Array.prototype.clone = function() {
	return this.slice(0);
};

var rand = function(a, b) {
    return (Math.random())*b+a;
}
var drawArc = function(x, y, colorFill, colorStroke, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, PI2, false);
    ctx.fillStyle = colorFill;
    ctx.fill();
    ctx.strokeStyle = colorStroke;
    ctx.stroke();
    ctx.closePath();
}
var drawText = function( text, x, y, fill, fontRules) {
    ctx.font=fontRules;
    ctx.fillStyle = fill;
    ctx.fillText(text, x, y);
}
var drawBox = function( x, y, width, height, fill, strokeVar) {
    ctx.beginPath();
    ctx.fillStyle = fill;
    ctx.rect(x, y, width, height);
    ctx.fill();
    ctx.strokeStyle = strokeVar;
    ctx.stroke();
    ctx.closePath();
}
var resetStrokeStyle = function() {
    shopStrokeStyle = ["rgb(0,0,0)","rgb(0,0,0)","rgb(0,0,0)"];
}
var render = function() {
    ctx.clearRect(0, 0, c.width, c.height);
    
    //background
    for (var i = 0; i < squares.length; i++) {
        for (var q = 0; q < squares[i].length; q++) {
            drawBox(squares[i][q].X, squares[i][q].Y, squares[i][q].width, squares[i][q].height, squares[i][q].fill, "rgb(0,0,0)");
        }
    }
    
    //Sidebar
    ctx.beginPath();
    ctx.fillStyle = "rgb(20,20,20)";
    ctx.fillRect(1000, 0, 100, ch);
    ctx.fill();
    ctx.closePath();
    
    //Money
    drawText("Money ", 1010, 80, "rgb(255,255,255)", "11px Arial");
    drawText(money, 1010, 110, "rgb(255,255,255)", "10px Arial");
    
    //Health
    drawText("Health ", 1010, 150, "rgb(255,255,255)", "11px Arial");
    drawText(health + " / 15", 1010, 180, "rgb(255,255,255)", "10px Arial");
    
    //Level
    drawText("Level ", 1010, 240, "rgb(255,255,255)", "11px Arial");
    drawText(level+ " / 15", 1010, 270, "rgb(255,255,255)", "10px Arial");
    
    //Next Level
    drawBox(1010, 320, 80, 50, "rgba(46,56,66, 1.0)", "rgb(0,0,0)");
    drawText("Next Wave", 1020, 350, "rgb(255,255,255)", "11px Arial");

    for (var i = 0; i < particles.length; i++) {
        particles[i].update();
        drawArc(particles[i].x, particles[i].y, particles[i].fillS,"rgb(0,0,0)", particles[i].radius );
        if (particles[i].y >= 650) {
            particles.splice(i, 1);
            i--;
            health -= 1;
            if (health <= 0) {
                console.log("dead");
            }
        }
    }
    for (var i = 0; i < towers.length; i++) {
        towers[i].update();
        towers[i].fire();
        drawArc(towers[i].x+25, towers[i].y+25, towers[i].radiusFillStyle, towers[i].radiusStrokeStyle, towers[i].radius );
        drawBox(towers[i].x+5, towers[i].y+5, towers[i].width-10, towers[i].height-10, towers[i].fill, "rgb(0,0,0)");
        if (towers[i].upgradeCost[towers[i].upgradeLevel] <= money) {
            drawText("+", towers[i].x+10, towers[i].y+20, "rgb(255,255,255)", "14px Arial");
            if (towers[i].hovered ) {
                var tx = 0;
                var ty = 0;
                if (towers[i].y <= ch/2) {
                    if (towers[i].x <= cw/2) {
                        drawBox(towers[i].x+5, towers[i].y+45, 100, 100, "rgb(0,0,0)", "rgb(0,0,0)");
                        tx = towers[i].x+5;
                        ty = towers[i].y+45;
                    }
                    else {
                        drawBox(towers[i].x-55, towers[i].y+45, 100, 100, "rgb(0,0,0)", "rgb(0,0,0)");
                        tx = towers[i].x-55;
                        ty = towers[i].y+45;
                    }
                }
                else {
                    if (towers[i].x <= cw/2) {
                        drawBox(towers[i].x+5, towers[i].y-95, 100, 100, "rgb(0,0,0)", "rgb(0,0,0)");
                        tx = towers[i].x+5;
                        ty = towers[i].y-95;
                    }
                    else {
                        drawBox(towers[i].x-55, towers[i].y-95, 100, 100, "rgb(0,0,0)", "rgb(0,0,0)");
                        tx = towers[i].x-55;
                        ty = towers[i].y-95;
                    }
                }
                drawText(towers[i].upgradeText[0], tx+5, ty+25, "rgb(255,255,255)", "11px Arial");
                drawText(towers[i].upgradeText[1], tx+5, ty+45, "rgb(255,255,255)", "11px Arial");
                drawText(towers[i].upgradeText[2], tx+5, ty+60, "rgb(255,255,255)", "11px Arial");
                drawText(towers[i].upgradeText[3], tx+5, ty+85, "rgb(255,255,255)", "9px Arial");
            }
        }
    }
    for (var i = 0; i < shots.length; i++) {
        //does target still exist
        var tempBool = false;
        for (var x = 0; x < particles.length; x++) {
            if (particles[x].id == shots[i].targetID) {
                tempBool = true;
                //dont need to run through the rest of the particles, the shot should be near the start of the array anyways.
                break;
            }
        }
        if (!tempBool) {
            shots.splice(i,1);
            i--;
        }
        else {
            shots[i].update();
            drawArc(shots[i].x, shots[i].y, "rgb(200,100,0)", "rgb(0,0,0)", shots[i].radius );
        }
    }
    if (boxOpened) {
        if (boxDirectionX == "right") {
            drawBox(boxXY[0], boxXY[1], 200, 50, "rgba(46,56,66,.7)", "rgb(0,0,0)");
            drawStoreBoxes(boxXY[0], boxXY[1]);
        }
        else {
            drawBox((boxXY[0]-150), boxXY[1], 200, 50, "rgba(46,56,66,.7)", "rgb(0,0,0)");
            drawStoreBoxes(boxXY[0]-200, boxXY[1]);
        }
    }
    
    if (hover) {
        drawBox(hoverBox[0], hoverBox[1], 200, 200, "rgba(46,46,46,.9)", "rgb(0,0,0)");
        drawText(hoverText[0], hoverBox[0]+5, hoverBox[1]+25, "rgb(255,255,255)", "11px Arial");
        drawText(hoverText[1], hoverBox[0]+5, hoverBox[1]+50, "rgb(255,255,255)", "11px Arial");
        drawText(hoverText[2], hoverBox[0]+5, hoverBox[1]+65, "rgb(255,255,255)", "11px Arial");
        drawText(hoverText[3], hoverBox[0]+5, hoverBox[1]+80, "rgb(255,255,255)", "11px Arial");
    }
    
}

var drawStoreBoxes = function(posX, posY) {
    if (money > 75) {
        drawBox(posX+55, posY+5, 40, 40, 'rgb(146,0,100)', shopStrokeStyle[0]);
    }
    if (money > 100) {
        drawBox(posX+105, posY+5, 40, 40, 'rgb(146,146,200)', shopStrokeStyle[1]);
    }
    if (money > 90) {
        drawBox(posX+155, posY+5, 40, 40, 'rgb(200,146,200)', shopStrokeStyle[2]);
    }

}
var compareShots = function(x2, y2, radius) {
    for (var x = 0; x < shots.length; x++) { 
        var dX2 = x2 - (shots[x].x+shots[x].velocityX);
        var dY2 = y2 - (shots[x].y+shots[x].velocityY);
        var dist2 = Math.sqrt(dX2*dX2 + dY2 * dY2);
        if (dist2 < radius) {
            return [true, x];
            alert("here");
        }
   }
   return [false, 0];
}
$(document).ready(function() {

    ctx.clearRect(0, 0, c.width, c.height);

    //initializing 
    for (var x = 0; x < 12; x++ ) {
        var temp = [];
        var tempY = (x*50);
        for (var i = 0; i < 20; i++) {
            if (initMap[x][i] == 0) {
                temp.push(new Spot((i*50), tempY, false));
            }
            else {
                temp.push(new Spot((i*50), tempY, true));
            }
        }
        squares.push(temp);
    }
    
    
    
    setInterval(function() {
        render();
        for (var i = 0; i < particles.length; i++) {
            var tempArr = compareShots(particles[i].x, particles[i].y, 9);
            if (tempArr[0]) {
                particles[i].health -= shots[tempArr[1]].damage;
                shots.splice(tempArr[1], 1);
                if (particles[i].health <= 0) {
                    money += particles[i].value;
                    particles.splice(i, 1);
                    i--;
                }
            }
        }
    }, 1000/60);
});