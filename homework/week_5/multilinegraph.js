/*  Bas Kuiken
*	10776990
*	UvA, minor Programmeren
*	Opdracht Dataprocessing, week 5
*
*	Dit script laadt een multi-series linegraph in een svg element. Dit wordt
*	gedaan aan de hand van d3.js. Er wordt gebruik gemaakt van data in 2
*	verschillende jaren, 2015 en 2016. Deze zijn afwisselend te bekijken.
*	Ook kunnen de waarden bekeken worden met een 'crosshair'.
*/

window.onload = function() {

	var margin = {top: 20, right: 200, bottom: 30, left: 40},
	width = 960 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;

	var file15 = 'bitcoinprice2015.json',
		file16 = 'bitcoinprice2016.json';

	var parseTime = d3.timeParse('%b %d, %Y')

	var x = d3.scaleTime()
		.rangeRound([0, width]);

	var y = d3.scaleLinear()
		.rangeRound([height, 0]);

	var xAxis = d3.axisBottom()
		.scale(x);

	var yAxis = d3.axisLeft()
		.scale(y);

	var colorOpen = '#3498DB',
		colorHigh = '#1ABC9C',
		colorClose = '#F1C40F',
		colorLow = '#E74C3C';

	var svg = d3.select('body').append('svg')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom),
		g = svg.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


	// load data and then run makeLines
	d3.queue()
		.defer(d3.json, file15)
		.defer(d3.json, file16)
		.await(makeLines);

	// convert data to right format and create graph
	function makeLines(error, data15, data16) {
		if (error) throw 'Error loading data';

		data15.forEach(function(d) {
			d.Date = parseTime(d.Date);
			console.log(d.Date);
			d.Open = +d.Open;
			d.Close = +d.Close;
			d.High = +d.High;
			d.Low = +d.Low;
		});

		data16.forEach(function(d) {
			d.Date = parseTime(d.Date);
			console.log(d.Date);
			d.Open = +d.Open;
			d.Close = +d.Close;
			d.High = +d.High;
			d.Low = +d.Low;
		});

		var lineOpen = d3.line()
			.curve(d3.curveBasis)
			.x(function(d) { return x(d.Date); })
			.y(function(d) { return y(d.Open); });

		var lineClose = d3.line()
			.curve(d3.curveBasis)
			.x(function(d) { return x(d.Date); })
			.y(function(d) { return y(d.Close); });

		var lineHigh = d3.line()
			.curve(d3.curveBasis)
			.x(function(d) { return x(d.Date); })
			.y(function(d) { return y(d.High); });

		var lineLow = d3.line()
			.curve(d3.curveBasis)
			.x(function(d) { return x(d.Date); })
			.y(function(d) { return y(d.Low); });

		xTent = d3.extent(data15, function(d) { return d.Date; });

		yMin = d3.min(data15, function(d)
			{ return d.Low; });

		yMax = d3.max(data15, function(d)
			{ return d.High; });

		x.domain(xTent);
		y.domain([yMin, yMax]);

		// draw x and y axes
		g.append('g')
			.attr('class', 'xAxis')
			.attr('transform', 'translate(0,' + height + ')')
			.call(xAxis
				.tickFormat(d3.timeFormat('%B')))
			.selectAll('text')
				.attr('dx', '2.95em');

		g.append('g')
			.attr('class', 'yAxis')
			.call(yAxis)
		.append('text')
			.attr('transform', 'rotate(-90)')
			.attr('y', 6)
			.attr('dy', '0.71em')
			.attr('fill', '#000')
			.text('Price ($)');

		// draw lines of data
		var lineOpen = g.append('g')
			.append('path')
			.attr('d', lineOpen(data15))
			.attr('class', 'line')
			.attr('id', 'Open')
			.style('stroke', colorOpen)
			.attr('stroke-width', 1.5)
			.attr('fill', 'None');

		var lineHigh = g.append('g')
			.append('path')
			.attr('d', lineHigh(data15))
			.attr('class', 'line')
			.attr('id', 'High')
			.style('stroke', colorHigh)
			.attr('stroke-width', 1.5)
			.attr('fill', 'None');

		var lineClose = g.append('g')
			.append('path')
			.attr('d', lineClose(data15))
			.attr('class', 'line')
			.attr('id', 'Close')
			.style('stroke', colorClose)
			.attr('stroke-width', 1.5)
			.attr('fill', 'None');

		var lineLow = g.append('g')
			.append('path')
			.attr('d', lineLow(data15))
			.attr('class', 'line')
			.attr('id', 'Low')
			.style('stroke', colorLow)
			.attr('stroke-width', 1.5)
			.attr('fill', 'None');

		var crossHair = g.append('g').attr('class', 'crosshair');
		crossHair.append('line').attr('id', 'horCrosshair')
		.attr('x1', 0)
			.attr('y1', 0)
			.attr('x2', 0)
			.attr('y2', 0)
			.style('stroke', 'black')
			.style('display', 'none');

		crossHair.append('line').attr('id', 'verCrosshair')
		.attr('x1', 0)
			.attr('y1', 0)
			.attr('x2', 0)
			.attr('y2', 0)
			.style('stroke', 'black')
			.style('display', 'none');

		crossHair.append('text').attr('id', 'crosshairInfo')
		.style('font-size', '10px')
			.style('stroke', 'gray')
			.style('stroke-width', '0.5px');

		// create listener that reacts to mousemovements
		g.on('mousemove', function () {
			var xPos = d3.mouse(this)[0],
				yPos = d3.mouse(this)[1];
			addCrossHair(xPos, yPos);
		})
			.on('mouseover', function () {
			d3.selectAll('.crosshair').style('display', 'block');
		})
			.on('mouseout', function () {
			d3.selectAll('.crosshair').style('display', 'none');
		})
		.append('rect')
			.style('visibility', 'hidden')
			.attr('x', 0)
			.attr('y', 0)
			.attr('width', width -  margin.left - margin.right)
			.attr('height', height - margin.top + margin.bottom);

		// create a function to be called when crosshair moves
		function addCrossHair(xPos, yPos) {

			d3.select('#horCrosshair')
				.attr('x1', x(xTent[0]))
				.attr('y1', yPos)
				.attr('x2', x(xTent[1]))
				.attr('y2', yPos)
				.style('display', 'block');

			d3.select('#verCrosshair')
				.attr('x1', xPos)
				.attr('y1', y(yMin))
				.attr('x2', xPos)
				.attr('y2', y(yMax))
				.style('display', 'block');


			var crosshairTime = d3.timeFormat('%d-%b-%Y');

			d3.select('#crosshairInfo')
				.attr('transform', 'translate(' + (xPos + 5) + ',' +
					(yPos - 5) + ')')
				.text('Price ($): ' + y.invert(yPos) + ' Date: ' +
				crosshairTime(xPos));
		}

		// print name and data source at bottom of graph
		svg.append('text')
			.attr('x', width)
			.attr('y', height - margin.bottom)
			.attr('text-anchor', 'start')
			.text('Bas Kuiken, 10776990');

		svg.append("a")
			.attr('xlink:href', 'https://www.kaggle.com/sudalairajkumar/cryptocurrencypricehistory/data')
			.append("rect")
			.attr('x', width - 2)
			.attr('y', height - margin.bottom/2)
			.attr("height", 25)
			.attr("width", 175)
			.attr('fill', 'lightgray')

		svg.append('text')
			.attr('x', width)
			.attr('y', height)
			.attr('text-anchor', 'start')
			.attr('pointer-events', 'none')
			.text('Source (bitcoin_price.csv)')
	}
};
