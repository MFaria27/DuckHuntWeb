var i = 0;
var rounds = 0;
var roundMax;
var col = "blue";
var x1;
var y1;
var x2;
var y2;
var velo;
var j;
var repeat;

var ready;
var readytxt;
var onetxt;
var twotxt;
var threetxt;
var gotxt;

var scoreNum;
var scoreN;
var score = 0;

var shotsMiss;
var missText;
var missed = 0;

var svgns = "http://www.w3.org/2000/svg";
var svg = document.getElementById("gameboard");

var shotsHit;
var hitText;
var hit = 0;

var explosion = document.getElementById("e").childNodes[0];
var imageUrl = "explo.png";

function start(){
	shotsMiss.replaceChild(document.createTextNode("Shots Missed: 0"), shotsMiss.childNodes[0]);
	shotsHit.replaceChild(document.createTextNode("Shots Hit: 0"), shotsHit.childNodes[0]);
	scoreNum.replaceChild(document.createTextNode("0"), scoreNum.childNodes[0]);
	score = 0;
	missed = 0;
	hit = 0;

	roundMax = prompt("How many rounds of ducks will fly by? (One round is 10 ducks)");
	ready = document.createElementNS(svgns, "text");
	ready.setAttributeNS(null, "font-size", 100);
	ready.setAttributeNS(null, "font-weight", "bold");
	ready.setAttributeNS(null, "x", 360);
	ready.setAttributeNS(null, "y", 300);
	ready.setAttributeNS(null, "fill", "white");
	ready.setAttributeNS(null, "font-family", "ARCADECLASSIC");
	ready.setAttributeNS(null, "letter-spacing", "5");
	readytxt = document.createTextNode("READY?");
	onetxt = document.createTextNode("1...");
	twotxt = document.createTextNode("2...");
	threetxt = document.createTextNode("3...");
	gotxt = document.createTextNode("GO!");
	ready.appendChild(readytxt);
	svg.appendChild(ready);
	setTimeout(function(){ 
		ready.replaceChild(onetxt, ready.childNodes[0]);
		setTimeout(function(){ 
			ready.replaceChild(twotxt, ready.childNodes[0]);
			setTimeout(function(){ 
				ready.replaceChild(threetxt, ready.childNodes[0]);
				setTimeout(function(){ 
					ready.replaceChild(gotxt, ready.childNodes[0]);
					line();
					setTimeout(function(){ 
						ready.replaceChild(document.createTextNode(""), ready.childNodes[0]);
					}, 1000);
				}, 1000);
			}, 1000);
		}, 1000);
	}, 1000);
}

function line() {
	document.getElementById("startButton").disabled = "disabled";
	if (i >= 10) {
		i = 0;
		rounds++;
		console.log("Round #"+ rounds);
		if (rounds >= roundMax) {
			document.getElementById("startButton").disabled = "";
			rounds = 0;
		} else line();
	}
	else {
		console.log("Duck #"+ (i+1));
		var chance = Math.floor(Math.random()*2);
		x1 = 0;
		if (chance == 0){
			y1 = Math.floor(Math.random()*250)+300;
			x2 = Math.floor(Math.random()*500)+500;
			y2 = 0;
		} else {
			y1 = Math.floor(Math.random()*550);
			x2 = 1000;
			y2 = Math.floor(Math.random()*550);
		}
		move(x1,y1,x2,y2);
		i++;
	}
}

function move() {
	var disc = document.getElementById("d" + i);
	var duck = document.getElementById("du" + i);
	duck.setAttribute("x", x1);
	duck.setAttribute("y", y1);

	disc.setAttribute("style", "top:" + x1 + "px; left:" + y1 + "px; visibility:visible;");

	var xCurr = x1;
	var yCurr = y1;
	var yM = y2 - y1;
	var xM = x2 - x1;
	if (yM == 0) yM++;
	if (yM > xM){
		yInc = yM / xM;
		xInc = 1;
	} else {
		yInc = 1;
		xInc = xM / yM;
	}

	if (Math.abs(xInc) > 60) {
		velo = 1;
		xInc = 60;
	}
	else if (Math.abs(xInc) > 25) velo = 1;
	else if (Math.abs(xInc) > 18) velo = 2;
	else if (Math.abs(xInc) > 7) velo = 3;
	else if (Math.abs(xInc) > 3) velo = 8;
	else velo = 15;
	if (xInc < 0) yInc = yInc *-1;
	xInc = Math.abs(xInc) * velo;
	yInc = yInc * velo;
	repeat = setInterval(startDisc, 50);
	function startDisc() {
		if (xCurr >= 1000 || yCurr <= 0 || yCurr >= 600) {
			clearInterval(repeat);
			resetDisc(disc, duck);
			line();
		} 
		else {
			xCurr = xCurr + xInc;
			yCurr = yCurr + yInc;
			disc.setAttribute("style", "top:" + Math.floor(xCurr) + "px; left:" + Math.floor(yCurr) + "px; visibility:visible;");
			duck.setAttribute("x", Math.floor(xCurr));
			duck.setAttribute("y", Math.floor(yCurr));
		}
	}
}

function shotDown(){
	addHit();
	var cd = document.getElementById("d" + (i-1));
	var cdu = document.getElementById("du" + (i-1));
	var ce = document.getElementById("e");
	var ceu = document.getElementById("eu");
	score = score + 100;
	setScore(score);
	clearInterval(repeat);
	xC = cdu.getAttribute("x");
	yC = cdu.getAttribute("y");
	cStyle = cd.getAttribute("style");
	resetDisc(cd, cdu);
	explode(cStyle, ce, ceu, xC, yC);
	explosion.src = "";
	explosion.src = imageUrl;
	var time = 300;
	
	setTimeout(function(){ 
		resetExplo(ce, ceu);
		line();
	}, time);
}

function explode(cStyle, ce, ceu, xC, yC) { 

	ceu.setAttribute("x", xC);
	ceu.setAttribute("y", yC);
	ce.setAttribute("style", cStyle);
}

function resetDisc(d, du) {
	du.setAttribute("x", -1000);
	du.setAttribute("y", -1000);
	d.setAttribute("style", "top:-1000px; left:-1000px; visibility:hidden;");
}

function resetExplo(e, eu) {
	e.setAttribute("style", "top:-1000px; left:-1000px; visibility:hidden;");
	eu.setAttribute("x", -1000); 
	eu.setAttribute("y", -1000);
}

function graphicStart() {
	var k;
	for (k = 0; k <= 20; k++) {
		var triangleBlade = document.createElementNS(svgns, "polygon");
		triangleBlade.setAttributeNS(null, "points", (k*50)+",550 "+((k+1)*50)+",550 "+((k*50)+25)+",520");
		triangleBlade.setAttributeNS(null, "style", "stroke:rgb(58, 45, 1); stroke-width:5px; fill:rgb(188, 146, 7)");
		svg.appendChild(triangleBlade);

		var baseGrass = document.createElementNS(svgns, "rect");
		baseGrass.setAttributeNS(null, "width", 50);
		baseGrass.setAttributeNS(null, "height", 50);
		baseGrass.setAttributeNS(null, "x",  (k*50));
		baseGrass.setAttributeNS(null, "y",  550);
		baseGrass.setAttributeNS(null, "fill", "rgb(188, 146, 7)");
		svg.appendChild(baseGrass);

		var edgeLine = document.createElementNS(svgns, "line");
		edgeLine.setAttributeNS(null, "x1", (k*50));
		edgeLine.setAttributeNS(null, "x2", (k*50));
		edgeLine.setAttributeNS(null, "y1", (550));
		edgeLine.setAttributeNS(null, "y2", (600));
		edgeLine.setAttributeNS(null, "style", "stroke:rgb(58, 45, 1); stroke-width:5px;");
		svg.appendChild(edgeLine);

		var centerLine = document.createElementNS(svgns, "line");
		centerLine.setAttributeNS(null, "x1", ((k*50)+25));
		centerLine.setAttributeNS(null, "x2", ((k*50)+25));
		centerLine.setAttributeNS(null, "y1", (560));
		centerLine.setAttributeNS(null, "y2", (590));
		centerLine.setAttributeNS(null, "style", "stroke:rgb(58, 45, 1); stroke-width:5px;");
		svg.appendChild(centerLine);
	}

	var topLine = document.createElementNS(svgns, "line");
	topLine.setAttributeNS(null, "x1", 0);
	topLine.setAttributeNS(null, "x2", 1000);
	topLine.setAttributeNS(null, "y1", 550);
	topLine.setAttributeNS(null, "y2", 550);
	topLine.setAttributeNS(null, "style", "stroke:rgb(188, 146, 7); stroke-width:6px;");
	svg.appendChild(topLine);

	var baseMenu = document.createElementNS(svgns, "rect");
	baseMenu.setAttributeNS(null, "width", 1000);
	baseMenu.setAttributeNS(null, "height", 200);
	baseMenu.setAttributeNS(null, "y", 600);
	baseMenu.setAttributeNS(null, "style", "fill:black;");
	svg.appendChild(baseMenu);

	var scoreMenu = document.createElementNS(svgns, "rect");
	scoreMenu.setAttributeNS(null, "width", 120);
	scoreMenu.setAttributeNS(null, "height", 60);
	scoreMenu.setAttributeNS(null, "x", 770);
	scoreMenu.setAttributeNS(null, "y", 680);
	scoreMenu.setAttributeNS(null, "style", "fill:black; stroke:white; stroke-width:5px;");
	svg.appendChild(scoreMenu);

	var scoreWord = document.createElementNS(svgns, "text");
	scoreWord.setAttributeNS(null, "font-size", 28);
	scoreWord.setAttributeNS(null, "font-weight", "bold");
	scoreWord.setAttributeNS(null, "x", 783);
	scoreWord.setAttributeNS(null, "y", 703);
	scoreWord.setAttributeNS(null, "fill", "white");
	scoreWord.setAttributeNS(null, "font-family", "ARCADECLASSIC");
	scoreWord.setAttributeNS(null, "letter-spacing", "5");
	scoreText = document.createTextNode("SCORE");
	scoreWord.appendChild(scoreText);
	svg.appendChild(scoreWord);

	scoreNum = document.createElementNS(svgns, "text");
	scoreNum.setAttributeNS(null, "font-size", 30);
	scoreNum.setAttributeNS(null, "font-weight", "bold");
	scoreNum.setAttributeNS(null, "x", 800);
	scoreNum.setAttributeNS(null, "y", 730);
	scoreNum.setAttributeNS(null, "fill", "white");
	scoreNum.setAttributeNS(null, "font-family", "ARCADECLASSIC");
	scoreNum.setAttributeNS(null, "letter-spacing", "1");
	svg.appendChild(scoreNum);
	scoreN = document.createTextNode("0");
	scoreNum.appendChild(scoreN);

	var shotsMenu = document.createElementNS(svgns, "rect");
	shotsMenu.setAttributeNS(null, "width", 240);
	shotsMenu.setAttributeNS(null, "height", 60);
	shotsMenu.setAttributeNS(null, "x", 100);
	shotsMenu.setAttributeNS(null, "y", 680);
	shotsMenu.setAttributeNS(null, "style", "fill:black; stroke:white; stroke-width:5px;");
	svg.appendChild(shotsMenu);

	shotsMiss = document.createElementNS(svgns, "text");
	shotsMiss.setAttributeNS(null, "font-size", 28);
	shotsMiss.setAttributeNS(null, "font-weight", "bold");
	shotsMiss.setAttributeNS(null, "x", 110);
	shotsMiss.setAttributeNS(null, "y", 703);
	shotsMiss.setAttributeNS(null, "fill", "white");
	shotsMiss.setAttributeNS(null, "font-family", "ARCADECLASSIC");
	shotsMiss.setAttributeNS(null, "letter-spacing", "1");
	missText = document.createTextNode("Shots Missed: 0");
	shotsMiss.appendChild(missText);
	svg.appendChild(shotsMiss);

	shotsHit = document.createElementNS(svgns, "text");
	shotsHit.setAttributeNS(null, "font-size", 28);
	shotsHit.setAttributeNS(null, "font-weight", "bold");
	shotsHit.setAttributeNS(null, "x", 110);
	shotsHit.setAttributeNS(null, "y", 730);
	shotsHit.setAttributeNS(null, "fill", "white");
	shotsHit.setAttributeNS(null, "font-family", "ARCADECLASSIC");
	shotsHit.setAttributeNS(null, "letter-spacing", "1");
	hitText = document.createTextNode("Shots Hit: 0");
	shotsHit.appendChild(hitText);
	svg.appendChild(shotsHit);
}

function setScore() {
	scoreN = document.createTextNode(score.toString());
	scoreNum.replaceChild(scoreN, scoreNum.childNodes[0]);
}

function addMiss() {
	missed++;
	missText = document.createTextNode("Shots Missed: " + missed.toString());
	shotsMiss.replaceChild(missText, shotsMiss.childNodes[0]);
}

function addHit() {
	hit++;
	hitText = document.createTextNode("Shots Hit: " + hit.toString());
	shotsHit.replaceChild(hitText, shotsHit.childNodes[0]);
}


















