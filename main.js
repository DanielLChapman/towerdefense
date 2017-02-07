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
var Parti = function(id, partiLevel) {
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
    this.fillS = "rgb(255,255,255)";
    this.strokeS = "rgb(0,0,0)";
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
    this.value = 25;
    if (partiLevel == 2) {
        this.health = 125;
        this.value = 40;
        this.speed = 10;
    }
    if (partiLevel == 3) {
        this.health = 225;
        this.value = 60;
        this.speed = 2.5;
    }
    if (partiLevel == 4) {
        this.health = 1000;
        this.value = 150;
        this.speed = 1;
    }
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
    this.fill = 'rgb(146,0,100)';
    this.radius = 120;
    this.exist = 100;
    this.radiusFillStyle = 'rgba(100,100,100,' + this.exist / 100 + ")";
    this.radiusStrokeStyle = 'rgba(0,0,00,' + this.exist / 100 + ")";
    this.sellCost = 50;
    this.hovered = true;
    this.maxFiring = 60;
    this.firing = 0;
    this.isFire = false;
    this.damage = 25;
    this.level = level;
    this.upgradeLevel = 0;
    this.upgradeCost = [180, 275];
    this.upgradeText = ["Cost: 180", "Damage: +25", "Radius: +35", "Fire Rate Increased"];
    if (this.level == 2) {
        this.radius = 300;
        this.sellCost = 75;
        this.damage = 50;
        this.maxFiring = 100; 
        this.upgradeCost = [200, 300];
        this.fill = 'rgb(146,146,200)';
        this.upgradeText = ["Cost: 200", "Damage: +30", "Radius: +100", "Fire Rate Increased"];
    }
    if (this.level == 3) {
        this.radius = 100;
        this.maxFiring = 30;
        this.damage = 20;
        this.sellCost = 70;
        this.upgradeCost = [180, 280];
        this.fill = 'rgb(200,146,200)';
        this.upgradeText = ["Cost: 180", "Damage: +20", "Radius: +30", "Fire Rate Increased"];
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
        //incase the particle is nil
        try {
            while (particles[i].id <= this.targetID) {
                if (particles[i].id == this.targetID) {
                    mX = particles[i].x;
                    mY = particles[i].y;
                }
                i++;
            }
        }catch( err) {
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
    fire: function(i) {
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
    },
    upgrade: function(i) {
        console.log(this.upgradeCost[this.upgradeLevel]);
        money -= this.upgradeCost[this.upgradeLevel];
        switch (this.level) {
            case 1: 
                if (this.upgradeLevel == 0) {
                    this.damage += 25;
                    this.radius += 35;
                    this.maxFiring -= 10;
                    this.sellCost += this.upgradeCost[this.upgradeLevel]*.75;
                    this.upgradeText = ["Cost: 275", "Damage: +50", "Radius: +50", "Fire Rate Increased"];
                }
                else {
                    this.damage += 50;
                    this.radius += 50;
                    this.sellCost += this.upgradeCost[this.upgradeLevel]*.75;
                    this.maxFiring -= 10;
                }
                break;
            case 2:
                if (this.upgradeLevel == 0) {
                    this.damage += 30;
                    this.radius += 100;
                    this.maxFiring -= 10;
                    this.sellCost += this.upgradeCost[this.upgradeLevel]*.75;
                    this.upgradeText = ["Cost: 300", "Damage: +50", "Radius: +200", "Fire Rate Increased"];
                }
                else {
                    this.damage += 50;
                    this.radius += 200;
                    this.maxFiring -= 10;
                    this.sellCost += this.upgradeCost[this.upgradeLevel]*.75;
                }
                break;
            case 3:
                if (this.upgradeLevel == 0) {
                    this.damage += 20;
                    this.radius += 30;
                    this.maxFiring -= 10;
                    this.sellCost += this.upgradeCost[this.upgradeLevel]*.75;
                    this.upgradeText = ["Cost: 280", "Damage: +50", "Radius: +50", "Fire Rate Fast"];
                }
                else {
                    this.damage += 50;
                    this.radius += 50;
                    this.maxFiring -= 15;
                    this.sellCost += this.upgradeCost[this.upgradeLevel]*.75;
                }
                break;
        }
        this.upgradeLevel++;
    }
}
var startLevels = function(palevel, i) {
    var i = i;
    switch (palevel) {
        case 1: 
            if ( i < 10) {
                particles.push(new Parti(partiID, 1));
                partiID++;
                i++;
                setTimeout(function() {
                    startLevels(palevel, i);
                }, 500);
            }
            break;
        case 2:
            if ( i < 15) {
                var plevel = 1;
                if (i%5 == 3) {plevel =2;}
                particles.push(new Parti(partiID, plevel));
                partiID++;
                i++;
                setTimeout(function() {
                    startLevels(palevel, i);
                }, 400);
            }
            break;
        case 3:
            if ( i < 20) {
                var plevel = 1;
                if (i%5 == 3) {plevel =2;}
                else if (i%6 == 0) { plevel = 3;}
                particles.push(new Parti(partiID, plevel));
                partiID++;
                i++;
                setTimeout(function() {
                    startLevels(palevel, i);
                }, 400);
            }
            break;
        case 3:
            if ( i < 20) {
                var plevel = 1;
                if (i == 18) {plevel = 4;}
                else if (i%5 == 3) {plevel =2;}
                else if (i%6 == 0) { plevel = 3;}
                                    
                particles.push(new Parti(partiID, plevel));
                partiID++;
                i++;
                setTimeout(function() {
                    startLevels(palevel, i);
                }, 300);
            }
            break;
        case 4:
            if ( i < 22) {
                var plevel = 1;
                if (i == 10 || i == 20) {plevel = 4;}
                else if (i%5 == 3 || i%7 == 2) {plevel =2;}
                else if (i%6 == 0) { plevel = 3;}
                                    
                particles.push(new Parti(partiID, plevel));
                partiID++;
                i++;
                setTimeout(function() {
                    startLevels(palevel, i);
                }, 300);
            }
            break;
        case 5:
            if ( i < 25) {
                var plevel = 1;
                if (i == 14 || i == 20 || i == 25) {plevel = 4;}
                else if (i%5 == 3 || i%7 == 2) {plevel =2;}
                else if (i%6 == 0 || i%4 == 0) { plevel = 3;}
                                    
                particles.push(new Parti(partiID, plevel));
                partiID++;
                i++;
                setTimeout(function() {
                    startLevels(palevel, i);
                }, 300);
            }
            break;
        case 6:
            if ( i < 30) {
                var plevel = 1;
                if (i == 10 || i == 20) {plevel = 4;}
                else if (i%5 == 3 || i%7 == 2) {plevel =2;}
                else if (i%6 == 0) { plevel = 3;}
                                    
                particles.push(new Parti(partiID, plevel));
                partiID++;
                i++;
                setTimeout(function() {
                    startLevels(palevel, i);
                }, 300);
            }
            break;
        case 7:
            if ( i < 40) {
                var plevel = 1;
                if (i == 10 || i == 20 || i == 35) {plevel = 4;}
                else if (i%5 == 3 || i%7 == 2) {plevel =2;}
                else if (i%6 == 0 || i%4 == 0) { plevel = 3;}
                                    
                particles.push(new Parti(partiID, plevel));
                partiID++;
                i++;
                setTimeout(function() {
                    startLevels(palevel, i);
                }, 250);
            }
            break;
        case 8: 
            if ( i < 50) {
                var plevel = 1;
                if (i == 10 || i == 20 || i == 35 || i == 40) {plevel = 4;}
                else if (i%5 == 3 || i%7 == 2) {plevel =2;}
                else if (i%6 == 0 || i%4 == 0) { plevel = 3;}
                                    
                particles.push(new Parti(partiID, plevel));
                partiID++;
                i++;
                setTimeout(function() {
                    startLevels(palevel, i);
                }, 250);
            }
            break;
        case 9:
            if ( i < 55) {
                var plevel = 1;
                if (i == 0 || i == 10 || i == 20 || i == 35 || i == 40) {plevel = 4;}
                else if (i%5 == 3 || i%7 == 2) {plevel =2;}
                else if (i%6 == 0 || i%4 == 0) { plevel = 3;}
                                    
                particles.push(new Parti(partiID, plevel));
                partiID++;
                i++;
                setTimeout(function() {
                    startLevels(palevel, i);
                }, 200);
            }
            break;
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
$( 'canvas' ).mousemove(function( e ) {
    var xValue = $(document).width()-cw;
    xValue /= 2;
    var tempX = e.pageX-xValue;
    if (boxOpened) {
        resetStrokeStyle();
        hover = false;
        var valsX = boxXY[0];
        var valsY = boxXY[1];
        if (boxDirectionX == "left") {
            valsX-=200;
        }
        if (boxDirectionY == "up") {
            valsY-=250;
        }
        var tempMinus = 0;
        if (boxDirectionX == "right") {
            tempMinus = 50;
        }
        if (e.pageY-10 >= boxXY[1]+5 && e.pageY-10 <= boxXY[1]+45) {
            if (tempX >= valsX+55 && tempX <= valsX+95) {
                shopStrokeStyle[0] = "rgb(140,140,140)";
                hover = true;
                hoverBox = [valsX+50-tempMinus, (valsY+50)];
            }
            else if (tempX >=valsX+105 && tempX <= valsX+145) {
                shopStrokeStyle[1] = "rgb(140,140,140)";
                hover = true;   
                hoverBox = [valsX+50-tempMinus, (valsY+50)];
            }
            else if (tempX >= valsX+155 && tempX <= valsX+195) {
                shopStrokeStyle[2] = "rgb(140,140,140)";
                hover = true;
                hoverBox = [valsX+50-tempMinus, (valsY+50)];
            }
        }
    }

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

    var tempX = e.pageX-pW;

    var valsX = boxXY[0];
    var valsY = boxXY[1];
    var tempMinus = 0;
    if (boxDirectionX == "left") {
        valsX-=200;
        tempMinus = 50;
    }
    if (boxDirectionX == "right") {
        tempMinus = 0;
    }
    
    //Box logic.1010, 320, 80, 50
    if (tempX >= 1010 && tempX <= 1090 && e.pageY-10 >= 320 && e.pageY-10 <= 370) {
        level += 1;
        startLevels(level, 0);
    }
    else if (boxOpened && e.pageY-10 >= boxXY[1]+5 && e.pageY-10 <= boxXY[1]+45 && tempX >= valsX && tempX <= valsX+195+tempMinus ) {
        if (tempX >= valsX+55 && tempX <= valsX+95 && money >= 75) {
            towers.push(new Tower(lastSquare[0], lastSquare[1], 1));
            squares[lastSquare[1]/50][lastSquare[0]/50].towerHere = true;
            money -= 75;
            hover = false;
            boxOpened = false;
        }
        else if (tempX >=valsX+105 && tempX <= valsX+145 && money >= 100) {
            towers.push(new Tower(lastSquare[0], lastSquare[1], 2));
            squares[lastSquare[1]/50][lastSquare[0]/50].towerHere = true;
            money -= 100;
            hover = false;
            boxOpened = false;
        }
        else if (tempX >= valsX+155 && tempX <= valsX+195 && money >= 90) {
            towers.push(new Tower(lastSquare[0], lastSquare[1], 3));
            squares[lastSquare[1]/50][lastSquare[0]/50].towerHere = true;
            money -= 90;
            hover = false;
            boxOpened = false;
        }
        else if (tempX >= valsX && tempX <= valsX + 50 && boxDirectionX == "right" ) {

            hover = false;
            boxOpened = false;
        }
        else if (tempX >= valsX+195 && tempX <= valsX + 195+tempMinus && boxDirectionX == "left" ) {

            hover = false;
            boxOpened = false;
        }
        resetStrokeStyle();
    }
    else if ( tempX <= 1000) {
        if (!squares[row/50][colum/50].movableBool && !squares[row/50][colum/50].towerHere) {
            boxOpened = true;
            if (row <= 250) {
                boxDirectionY = "down";
            }
            else {
                boxDirectionY = "up";
            }
            if (colum <= 500) {
                boxDirectionX = "right";
            }
            else {
                boxDirectionX = "left";
            }
            boxXY = [colum,row];
            lastSquare = [colum, row];
        }
    }
    
    for (var x = 0; x < towers.length; x++) {
        if (towers[x].isInside(tempX, e.pageY-10) && towers[x].upgradeCost[towers[x].upgradeLevel] <= money) {
            towers[x].upgrade();
        }
    }
});
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