/* Bas Kuiken
*  10776990
*  UvA
*  Opdracht Dataprocessing, minor Programmeren, week 2

*  Dit is een script dat gebruikt wordt door index.html om een lijngrafiek te
*  tekenen op een canvas. Het gebruikt daarbij data die in het html bestand
*  staat.
*/


window.onload = function() {
	// get the element with the temperature data and split each line
	var data = document.getElementById("rawdata");
	splitData = data.value.split("\n");

	// split temperatures from dates, make them javascript dates and numbers
	var dataArray = [];
	var day = []
	var dates = []
	var temps = []
	var arrayLength = splitData.length
	for(var i = 0; i < arrayLength - 1; i++) {
		if(i === 0) {
			i++
		}
		var day = splitData[i].split(",")
		day[0] = day[0].substr(0, 5) + "-" + day[0].substr(5, 2) + 
			"-" + day[0].substr(7);
		day[0] = new Date(day[0]);
		dates.push(day[0]);
		day[1] = (parseFloat(day[1]));
		temps.push(day[1]);
	}
	drawCanvas(temps, dates)
}

function drawCanvas(temps, dates) {
	// get canvas, assign properties and context
	var canvas = document.getElementById("canvas");
	canvas.width = 600;
	canvas.height = 400;
	canvas.style.width  = '600px';
	canvas.style.height = '400px';	
	var margin = 100;
	var graphMargin = 150;
	var offset = 30;
	var c = canvas.getContext("2d");

	// set size of graph
	var graphHeight = canvas.height - margin
	var graphWidth = canvas.width - margin

	// calculate start of graph
	var domain = [Math.min.apply(null,temps), Math.max.apply(null, temps)];
	var range = [graphWidth, graphHeight];
	var startAxis = createTransform(domain, range);
	var start = startAxis(temps[0]);

	// create linegraph out of data
	c.beginPath();
	c.moveTo(margin, start - graphMargin);
	days = temps.length;
	var dateDomain = [Math.min.apply(null, dates), Math.max.apply(null, dates)];
	transformer = createTransform(dateDomain, range);
	stepMod = transformer(dates[0].getTime())
	/* divided amount of days in year by difference of first and last step
	*  gives dayMod, to spread the graph*/
	dayMod = 1.825
	for(i = 0; i < days; i++) {
		step = transformer(dates[i].getTime());
		console.log(step);
		c.lineTo(margin + (stepMod - step) * dayMod, 
			startAxis(temps[i]) - graphMargin);
	}

	// create framework for graph
	c.moveTo(margin - offset, canvas.height - margin);
	c.lineTo(graphWidth, canvas.height - margin);
	c.moveTo(margin, margin);
	c.lineTo(margin, graphHeight + offset);

	// draw text on x- and y-axis
	var xAxisText = "Days";
	var yAxisText = "Degrees (Celsius)";
	c.font = '48px Serif';
	c.fillText(xAxisText, 400, 350);
	console.log(90*Math.PI/180)
	c.font = '36px Serif'
	c.rotate(270*Math.PI/180);
	c.fillText(yAxisText, -350, 50)

	c.stroke();
}

function createTransform(domain, range){
	// domain is a two-element array of the data bounds [domain_min, domain_max]
	// range is a two-element array of the screen bounds [range_min, range_max]
	// this gives you two equations to solve:
	// range_min = alpha * domain_min + beta
	// range_max = alpha * domain_max + beta
 		// a solution would be:

    var domain_min = domain[0]
    var domain_max = domain[1]
    var range_min = range[0]
    var range_max = range[1]

    // formulas to calculate the alpha and the beta
   	var alpha = (range_max - range_min) / (domain_max - domain_min)
    var beta = range_max - alpha * domain_max
    
    // returns the function for the linear transformation (y= a * x + b)
    return function(x){
      return alpha * x + beta;
    }
}