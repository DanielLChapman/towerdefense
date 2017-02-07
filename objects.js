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
    this.value = 15;
    if (partiLevel == 2) {
        this.health = 125;
        this.value = 30;
        this.speed = 10;
    }
    if (partiLevel == 3) {
        this.health = 225;
        this.value = 40;
        this.speed = 2.5;
    }
    if (partiLevel == 4) {
        this.health = 1000;
        this.value = 100;
        this.speed = 1;
    }
    if (partiLevel == 5) {
        this.health = 5000;
        this.value = 100;
        this.speed = 1;
    }
    if (partiLevel == 6) {
        this.health = 10000;
        this.value = 200;
        this.speed = 5;
    }
    if (partiLevel == 7) {
        this.health = 2000;
        this.value = 15;
        this.speed = 5;
    }
    if (partiLevel == 8) {
        this.health = 2000;
        this.value = 150;
        this.speed = 10;
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
        this.upgradeCost = [180, 480];
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
                    this.upgradeText = ["Cost: 480", "Damage: +50", "Radius: +50", "Fire Rate Fast"];
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