var startCountdown = function() {
    waveCountdown-=1;
    if (waveCountdown == 0 && countDown) {
        level += 1;
        startLevels(level, 0);
        waveCountdown = 120;
        countDown = false;
    }
    else {
        setTimeout(function() {
            if (countDown) {
                startCountdown();
            }
        }, 150);
    }
}
var startLevels = function(palevel, i) {
    var i = i;
    if (dead || win) {
        i = 100000000;
    }
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
            else {
                startCountdown();
                countDown = true;
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
            else {
                startCountdown();
                countDown = true;
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
            else {
                startCountdown();
                countDown = true;
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
            else {
                startCountdown();
                countDown = true;
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
            else {
                startCountdown();
                countDown = true;
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
            else {
                startCountdown();
                countDown = true;
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
            else {
                startCountdown();
                countDown = true;
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
            else {
                startCountdown();
                countDown = true;
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
            else {
                startCountdown();
                countDown = true;
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
            else {
                startCountdown();
                countDown = true;
            }
            break;
        case 10:
            if (i < 60) {
                var plevel = 3;
                if (i == 0 || i == 50) {
                    plevel = 5;
                }
                particles.push(new Parti(partiID, plevel));
                partiID++;
                i++;
                setTimeout(function() {
                    startLevels(palevel, i);
                }, 100);
            }
            else {
                startCountdown();
                countDown = true;
            }
            break;
        case 11:
            if (i < 60) {
                var plevel = 3;
                if (i == 0 || i == 50) {
                    plevel = 6;
                }
                else if (i == 40 || i == 59) {
                    plevel = 5;
                }
                particles.push(new Parti(partiID, plevel));
                partiID++;
                i++;
                setTimeout(function() {
                    startLevels(palevel, i);
                }, 100);
            }
            else {
                startCountdown();
                countDown = true;
            }
            break;
        case 12:
            if (i < 100) {
                var plevel = 3;
                if (i == 0 || i == 50 || i == 60 || i == 70 || i == 80 || i == 90 || i == 99) {
                    plevel = 6;
                }
                else if (i%5 == 2) {
                    plevel = 5;
                }
                particles.push(new Parti(partiID, plevel));
                partiID++;
                i++;
                setTimeout(function() {
                    startLevels(palevel, i);
                }, 100);
            }
            else {
                startCountdown();
                countDown = true;
            }
            break;
        case 13:
            if (i < 100) {
                var plevel = 7;
                if (i == 0 || i == 50 || i == 60 || i == 70 || i == 80 || i == 90 || i == 99) {
                    plevel = 6;
                }
                else if (i%5 == 2) {
                    plevel = 5;
                }
                particles.push(new Parti(partiID, plevel));
                partiID++;
                i++;
                setTimeout(function() {
                    startLevels(palevel, i);
                }, 200);
            }
            else {
                startCountdown();
                countDown = true;
            }
            break;
        case 14:
            if (i < 150) {
                var plevel = 7;
                if (i == 0 || i == 50 || i == 60 || i == 70 || i == 80 || i == 90 || i == 99) {
                    plevel = 6;
                }
                else if (i%5 == 2) {
                    plevel = 5;
                }
                else if (i%13 == 0) {
                    plevel = 8;
                }
                particles.push(new Parti(partiID, plevel));
                partiID++;
                i++;
                setTimeout(function() {
                    startLevels(palevel, i);
                }, 100);
            }
            else {
                startCountdown();
                countDown = true;
            }
            break;
        case 15:
            if (i < 150) {
                var plevel = 7;
                if (i == 0 || i == 50 || i == 60 || i == 70 || i == 80 || i == 90 || i == 99) {
                    plevel = 6;
                }
                else if (i%5 == 2 || i%6 == 0) {
                    plevel = 5;
                }
                else if (i%13 == 0 || i%16 == 0) {
                    plevel = 8;
                }
                else if (i%24 == 0) {
                    plevel = 4;
                }
                particles.push(new Parti(partiID, plevel));
                partiID++;
                i++;
                setTimeout(function() {
                    startLevels(palevel, i);
                }, 100);
            }
            else {
                startCountdown();
                countDown = true;
            }
            break;
        case 16:
            if (particles.length <= 0&&health > 0) {
                win = true;
            }
    }
}