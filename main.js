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
var cw = c.width = 1000;
var ch = c.height = 600;
var PI2 = Math.PI*2;
var particles = [];
var towers = []; 
var shots = [];
var partiID = 0;
Array.prototype.clone = function() {
	return this.slice(0);
};

var rand = function(a, b) {
    return (Math.random())*b+a;
}
var Spot = function(x, y, mapBool) {
    this.X = x;
    this.Y = y;
    this.width = 50;
    this.height = 50;
    this.movableBool = mapBool;
    this.towerHere = false;
    this.fill = "";
    if (!this.movableBool) {
        this.fill = "rgba(0,0,0, .9)";
    }
    else {
        this.fill = "rgba(46,46,46, .9)";
    }
    this.centerX = this.X + this.width/2;
    this.centerY = this.Y + this.height/2;
}
var Parti = function(id) {
    this.x = 25;
    this.oldX = 0;
    this.y = 75;
    this.oldY = 75;
    this.speed = 5;
    this.moveX = this.speed;
    this.movedX = 0;
    this.moveY = this.speed;
    this.movedY = 0;
    this.inMap = [];
    //slicing isnt working
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
        this.inMap.push(temp);
    }
    //for (var x = 0; x < squares.length; x++) {
    //    this.inMap.push(squares[x].slice(0));
    //}
    this.squareRow = 1;
    this.squareColumn = 0;
    this.moving = true;
    this.radius = 5;
    this.id = id;
    this.health = 75;
}
Parti.prototype = {
    update: function(i) {
        //this.x += this.moveX;
        //this.y += this.moveY;
        this.inMap[this.squareRow][this.squareColumn].movableBool = false;
        try {
            if (this.inMap[this.squareRow+1][this.squareColumn].movableBool) {
                this.moveX = 0;
                this.moveY = this.speed;
                this.movedY += this.speed;
            }
        } 
        catch(err) {
        }
        try {
            if (this.inMap[this.squareRow-1][this.squareColumn].movableBool) {
                this.moveX = 0;
                this.moveY = -1*this.speed;
                this.movedY -= this.speed;
            }
        } 
        catch(err) {
        }
        try {
            if (this.inMap[this.squareRow][this.squareColumn-1].movableBool) {
                this.moveX = -1*this.speed;
                this.moveY = 0;
                this.movedX += -1*this.speed;
            }
        } 
        catch(err) {
        }
        try {
            if (this.inMap[this.squareRow][this.squareColumn+1].movableBool) {
                this.moveX = this.speed;
                this.moveY = 0;
                this.movedX += this.speed;
            }
        } 
        catch(err) {
        }

        
        this.x += this.moveX;
        this.y += this.moveY;
        
        if (this.movedX == 50) {
            this.movedX = 0;
            this.movedY = 0;
            this.squareColumn+=1
        }
        if (this.movedX == -50) {
            this.movedX = 0;
            this.movedY = 0;
            this.squareColumn-=1
        }
        if (this.movedY == 50) {
            this.movedX = 0;
            this.movedY = 0;
            this.squareRow+=1
        }
        if (this.movedY == -50) {
            this.movedX = 0;
            this.movedY = 0;
            this.squareRow-=1
        }
    }
}
var Tower = function(vX,vY,level) {
    this.x = vX;
    this.y = vY;
    this.width = 50;
    this.height = 50;
    this.currentTarget = 100;
    this.fill = 'hsl(' + rand(0,360) + ', 50%, 50%)';
    this.radius = 120;
    this.exist = 100;
    this.radiusFillStyle = 'rgba(100,100,100,' + this.exist / 100 + ")";
    this.radiusStrokeStyle = 'rgba(0,0,00,' + this.exist / 100 + ")";
    this.hovered = true;
    this.maxFiring = 60;
    this.firing = 0;
    this.isFire = false;
    this.damage = 25;
    this.level = level;
    if (this.level == 2) {
        this.radius = 300;
        this.damage = 50;
        this.maxFiring = 100; 
    }
    if (this.level == 3) {
        this.radius = 100;
        this.maxFiring = 30;
        this.damage = 20;
    }
}
var Shot = function(pID, towerX, towerY, damage) {
    this.x = towerX + 25;
    this.y = towerY + 25;
    this.targetID = pID;
    //this is to make sure the particle we are going for is the correct one.
    this.speed = 10;
    this.radius = 5;
    this.velocityX = 5;
    this.velocityY = 5;
    this.damage = damage;
}
Shot.prototype = {
    update: function(i) {
        var i = 0;
        var mX = 0;
        var mY = 0;
        try {
            while (particles[i].id <= this.targetID) {
                if (particles[i].id == this.targetID) {
                    mX = particles[i].x;
                    mY = particles[i].y;
                }
                i++;
            }
        }catch( err) {
            console.log(err);
        }
        var dX = mX - this.x;
        var dY = mY - this.y;
        var dist = Math.sqrt(dX * dX + dY * dY);
    //Changes the velocity of the bubbles/spheres to move towards the center of the magnet
        this.velocityX = (dX)/(this.speed-7);
        this.velocityY = (dY)/(this.speed-7);

        
        this.x += this.velocityX;
        this.y += this.velocityY;
    }
}
Tower.prototype = {
    update: function(i) {
        if (this.exist > 0) {
            this.exist -= 1;
        }
        this.radiusFillStyle = 'rgba(100,100,100,' + this.exist / 100 + ")";
        this.radiusStrokeStyle = 'rgba(0,0,00,' + this.exist / 100 + ")";
    },
    isInside: function(x,y) {
        if (x >= this.x && x <= this.x+this.width) {
            if (y >= this.y && y <= this.y+this.height) {
                return true;
            }
        }
        return false;
    },
    fire: function() {
        //Finding the oldest particle that is near us.
        if (this.firing == 0 && !this.isFire) {
            for (var p = 0; p < particles.length; p++) {
                //+25 for the center of tower
                var dX = particles[p].x - (this.x+25);
                var dY = particles[p].y - (this.y+25);
                var dist = Math.sqrt(dX * dX + dY * dY);
                if (dist < this.radius && !this.isFire) {
                    shots.push(new Shot(particles[p].id, this.x, this.y, this.damage));
                    this.isFire = true;
                    this.firing = this.maxFiring;
                }
            }
        }
        else {
            this.firing -= 1;
            if (this.firing == 0 ){ 
                this.isFire = false;
            }
        }
    }
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
$( 'canvas' ).mousemove(function( e ) {
    var xValue = $(document).width()-cw;
    xValue /= 2;
    for (var x = 0; x < towers.length; x++) {
        if (towers[x].isInside(e.pageX-xValue, e.pageY-10)) {
            towers[x].hovered = true;
            towers[x].exist = 100;
        }
        else {
            towers[x].hovered = false;
        }
    }
});
$('canvas').click(function(e) {
    var pW = $(document).width()-cw;
    pW /=2;
    var row = (Math.floor((e.pageY-10)/50)*50);
    var colum = (Math.floor((e.pageX-pW)/50)*50);
    if (!squares[row/50][colum/50].movableBool && !squares[row/50][colum/50].towerHere) {
        var temp = Math.floor(rand(1,3));
        towers.push(new Tower(colum, row, temp));
        squares[row/50][colum/50].towerHere = true;
        console.log(temp);
    }
});
var render = function() {
    ctx.clearRect(0, 0, c.width, c.height);
    
    for (var i = 0; i < squares.length; i++) {
        for (var q = 0; q < squares[i].length; q++) {
            ctx.beginPath();
            ctx.fillStyle = squares[i][q].fill;
            ctx.rect(squares[i][q].X,squares[i][q].Y,squares[i][q].width,squares[i][q].height);
            ctx.fill();
            ctx.strokeStyle = "rgb(0,0,0)";
            ctx.stroke();
            ctx.closePath();
        }
    }
    for (var i = 0; i < particles.length; i++) {
        particles[i].update();
        drawArc(particles[i].x, particles[i].y, "rgb(250,250,250)","rgb(0,0,0)", particles[i].radius );
        if (particles[i].x == 500 && particles[i].y == 600) {
            particles[i].speed = 0;
        }
    }
    for (var i = 0; i < towers.length; i++) {
        towers[i].update();
        towers[i].fire();
        drawArc(towers[i].x+25, towers[i].y+25, towers[i].radiusFillStyle, towers[i].radiusStrokeStyle, towers[i].radius );
        ctx.beginPath();
        ctx.fillStyle = towers[i].fill;
        ctx.rect(towers[i].x,towers[i].y,towers[i].width,towers[i].height);
        ctx.fill();
        ctx.strokeStyle = "rgb(0,0,0)";
        ctx.stroke();
        ctx.closePath();
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
        particles.push(new Parti(partiID));
        partiID++;
    }, 40);
    setInterval(function() {
        render();
        for (var i = 0; i < particles.length; i++) {
            var tempArr = compareShots(particles[i].x, particles[i].y, 9);
            if (tempArr[0]) {
                particles[i].health -= shots[tempArr[1]].damage;
                shots.splice(tempArr[1], 1);
                if (particles[i].health <= 0) {
                    particles.splice(i, 1);
                    i--;
                }
            }
        }
    }, 1000/60);
});