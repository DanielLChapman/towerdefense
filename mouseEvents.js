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
                hoverText = ["Cost: 75", "Damage: 25", "Radius: 120", "Fire Rate Normal"];
            }
            else if (tempX >=valsX+105 && tempX <= valsX+145) {
                shopStrokeStyle[1] = "rgb(140,140,140)";
                hover = true;   
                hoverBox = [valsX+50-tempMinus, (valsY+50)];
                hoverText = ["Cost: 100", "Damage: 50", "Radius: 300", "Fire Rate Slow"];
            }
            else if (tempX >= valsX+155 && tempX <= valsX+195) {
                shopStrokeStyle[2] = "rgb(140,140,140)";
                hover = true;
                hoverBox = [valsX+50-tempMinus, (valsY+50)];
                hoverText = ["Cost: 90", "Damage: 20", "Radius: 100", "Fire Rate Fast"];
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