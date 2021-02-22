let marsData;
let imgMars;
let ruweDatum;
let datum;
let dagen;
let dag;
let maanden;
let maand;
let klik = 0;
let fontRound;
let imgSnowflake;
let imgFlower;
let imgSun;
let imgLeaf;
let animationDurationFrames = 60;
let animationFrame = 1;
let seasonY;
let r = 0;
let minPressure = 1000;
let maxPressure = 0;
let temperature;

function preload() {
    imgMars = loadImage('assets/marsplaatje.jpg');
    fontRound = loadFont('assets/arlrdbd.TTF');
    imgSnowflake = loadImage('assets/snowflake.svg');
    imgFlower = loadImage('assets/flower.svg');
    imgSun = loadImage('assets/sun.png');
    imgLeaf = loadImage('assets/leaf.svg');
    loadJSON("https://api.nasa.gov/insight_weather/?api_key=zuItMELXxg7371HlWdaQ9OYpNOGqZcCdckYEJ4g0&feedtype=json&ver=1.0", finishedLoadingData);
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    strokeWeight(2);
    stroke('black');
    textFont(fontRound);
    temperature = random(-100, -10);
        // some p5 magic ;-) to determine a nice round number based on the input
    temperature = round(temperature);
    seasonY = height / 1.50;
    
    if (marsData){
        for (let i = 0; i < marsData.sol_keys.length; i++){
            
            if (marsData[marsData.sol_keys[i]].PRE.mx > maxPressure){
                maxPressure = marsData[marsData.sol_keys[i]].PRE.mx + 1;  
                
            }
            if (marsData[marsData.sol_keys[i]].PRE.mn < minPressure){
                minPressure = marsData[marsData.sol_keys[i]].PRE.mn - 1; 
                
            }
            // +1 en -1 toegevoegd zodat je ze nog zichtbaar zijn
        }
    }
}

function draw() {
    //achtergrond
    background(0);
    imageMode(CENTER);
    translate()
    image(imgMars, width/2, height/2, 700, 700);

    //tekst
    textSize(40);
    textAlign(CENTER);
    fill('white');
    text('Weather by InSight at Elysium Planitia', width / 2, 100);

    //data

    if (marsData) {
        //datum
        textSize(25);
        text(dagen[dag] + ' ' + datum.getDate() + ' ' + maanden[maand] + ' ' + datum.getFullYear(), width / 4, 200);
        text('Day ' + (klik + 1) + ' out of ' + marsData.sol_keys.length, width / 1.25, 200);

        //temperature
        let rectHeight;
        textSize(20)
        if (marsData[marsData.sol_keys[klik]].AT) {
            temperature = marsData[marsData.sol_keys[klik]].AT.av;
            text('Average temperature \n' + marsData.validity_checks[marsData.sol_keys[klik]].AT.av + 'C', width / 9, 325);
        } else {
            text('Average temperature: \n' + temperature + ' C', width / 9, 325);
        }

        if (marsData.validity_checks[marsData.sol_keys[klik]].AT) {
            textSize(20);
            text('This data is ' + marsData.validity_checks[marsData.sol_keys[klik]].AT.valid + ' >', width / 9, 410);
        } else {
            textSize(20);
            text('No valid data available >', width / 9, 410);
        }

        let maxRectHeight = 275;
        let minRectHeight = 525;
        rectHeight = map(temperature, -100, 0, minRectHeight, maxRectHeight);

        if (animationFrame < animationDurationFrames) {
            rectHeight = map(animationFrame, 0, animationDurationFrames, minRectHeight, rectHeight);
        }

        text('0 C', width / 4 + 75, maxRectHeight + 10);
        text('- 100 C', width / 4 + 75, minRectHeight + 10);
        
        push()
        rectMode(CENTER);
        noStroke();
        fill('white');
        rect(width / 4, 400, 40, 300, 30);
        rectMode(CORNERS);
        fill(0, 175, 255);
        rect(width / 4 - 20, rectHeight, width / 4 + 20, 550, 0, 0, 30, 30);
        stroke(50);
        strokeWeight(2);
        line(width / 4 - 20, maxRectHeight, width / 4 + 20, maxRectHeight);
        line(width / 4 - 20, minRectHeight, width / 4 + 20, minRectHeight);
        pop()

        //Pressure
        let arcX = width / 1.25;
        let arcY = 400;
        let diameter = 200;  
        let eindeArcAv;
        let eindeArcMx;
        let eindeArcMn;

        if (marsData[marsData.sol_keys[klik]].PRE) {

            eindeArcAv = map(marsData[marsData.sol_keys[klik]].PRE.av, minPressure, maxPressure, -PI, PI);
            eindeArcMx = map(marsData[marsData.sol_keys[klik]].PRE.mx, minPressure, maxPressure, -PI, PI);
            eindeArcMn = map(marsData[marsData.sol_keys[klik]].PRE.mn, minPressure, maxPressure, -PI, PI);

            //dankjewel Luc!
            if (animationFrame < animationDurationFrames) {
                eindeArcAv = map(animationFrame, 0, animationDurationFrames, -PI, eindeArcAv);
                eindeArcMx = map(animationFrame, 0, animationDurationFrames, -PI, eindeArcMx);
                eindeArcMn = map(animationFrame, 0, animationDurationFrames, -PI, eindeArcMn);
            }

            push()
            fill(60, 95)
            arc(arcX, arcY, diameter, diameter, PI, -PI);
            fill('white')
            strokeWeight(2)
            text('Pa', width / 1.25, arcY + 10);
            noFill();
            strokeWeight(13);
            stroke('#9d0208');
            arc(arcX, arcY, diameter, diameter, PI, eindeArcMx);
            stroke('#dc2f02');
            arc(arcX, arcY, diameter, diameter, PI, eindeArcAv);
            stroke('#faa307');
            arc(arcX, arcY, diameter, diameter, PI, eindeArcMn);
            pop()

            if (marsData.validity_checks[marsData.sol_keys[klik]].PRE) {
                text('This data is ' + marsData.validity_checks[marsData.sol_keys[klik]].PRE.valid + ' >', arcX - 225, arcY + 10);
            } else {
                text('No valid data available >', arcX - 225, arcY + 10);
            }

            text('Average pressure: \n'+ round(marsData[marsData.sol_keys[klik]].PRE.av), arcX - 225, arcY - 100)
        }

        //season
        let imgGrootte = 100;
        let imgY = seasonY + 75
        
        text('Season:', width / 2, height / 1.50);
        push()
        translate(width / 2, imgY);
        imageMode(CENTER);
        rotate(r)   
        r = r + 0.01
        
        if (marsData[marsData.sol_keys[klik]].Season === 'winter') {
            image(imgSnowflake, 0, 0, imgGrootte, imgGrootte);
        } else if (marsData[marsData.sol_keys[klik]].Season === 'spring') {
            image(imgFlower, 0, 0, imgGrootte, imgGrootte)
        } else if (marsData[marsData.sol_keys[klik]].Season === 'summer') {
            image(imgSun, 0, 0, imgGrootte, imgGrootte)
        } else if (marsData[marsData.sol_keys[klik]].Season === 'fall') {
            image(imgLeaf, 0, 0, imgGrootte, imgGrootte)
        } else {
            image(imgFlower, 0, 0, imgGrootte, imgGrootte)
        }
        pop()

    }

    if (animationFrame < animationDurationFrames) {
        animationFrame++;
    }

}

function finishedLoadingData(data) {
    marsData = data;
    ruweDatum = marsData[marsData.sol_keys[klik]].First_UTC,
        datum = new Date(ruweDatum);

    dagen = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    maanden = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'Oktober', 'November', 'December']
    dag = datum.getDay();
    maand = datum.getMonth();
}

function mousePressed() {
    loadJSON("https://api.nasa.gov/insight_weather/?api_key=zuItMELXxg7371HlWdaQ9OYpNOGqZcCdckYEJ4g0&feedtype=json&ver=1.0", finishedLoadingData);
    klik++
    if (klik >= marsData.sol_keys.length) {
        klik = 0;
    }
    animationFrame = 1;
    temperature = random(-100, -10);
    temperature = round(temperature);
}

function windowResized() {
    //#gestolenvanLuc
    resizeCanvas(windowWidth, windowHeight);
}