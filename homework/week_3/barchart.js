/* Bas Kuiken
*	10776990
*	UvA, minor Programmeren
*	Opdracht Dataprocessing, week 3
*	
*	Dit script maakt een grafiek aan de hand van d3.js. De grafiek is een 
*	barchart en er worden tooltips met data gemaakt als er met de muis
*	bewogen wordt over de grafiek.

*/

window.onload = function() {

	var width = 960,
		height = 500;

	// initialize inner and outer size
	var margin = {top: 20, right: 30, bottom: 30, left: 40},
		width = width - margin.left - margin.right,
		height = height - margin.top - margin.bottom;

	var file = 'bitcoinprice.json';

	// calculate the transformation
	var x = d3.scaleLinear().range([0, width]),
	y = d3.scaleLinear().range([height, 0]);

	// make a stamp for x and y axis
	var xAxis = d3.axisBottom()
		.scale(x)

	var yAxis = d3.axisLeft()
		.scale(y)

	// make a tooltip stamp
	var tip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-10, 0])
		.html(function(d) {
		return "<strong>Price</strong> <span style='color:black'>" + d.Open + "</span>";
	})

	// initialize chart on which graph will be rendered
	var chart = d3.select('.chart')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
	.append('g')
		.attr('transform', 'translate(' + margin.left + ',' 
			+ margin.top + ')');

	chart.call(tip);

	// load in data and do stuff when data has loaded
	d3.json(file, function(data) {

		// make a number of each d.open value
		data.forEach(function(d) {
			d.Open = +d.Open;
		});
		x.domain([0, data.length]);
		y.domain([0, d3.max(data, function(d) {return d.Open;})]);

		barWidth = width / data.length

		// add an element for the axes
		chart.append('g')
			.attr('class', 'x axis')
			.attr('transform', 'translate(0, ' + height + ')')
			.call(xAxis)

		chart.append('g')
			.attr('class', 'y axis')
			.call(yAxis)
		.append('text')
			.attr('class', 'title')
			.attr('y', -margin.left * 1.5)
			.attr('dy', '.71em')
			.style ('text-anchor', 'end')
			.style('font', '12px sans-serif')
			.text('Dollars ($)');

		// place the text of ticks on y axis to the left
		d3.select('g.y.axis')
			.selectAll('text')
			.attr('transform', 'translate(-10, 0)');

		// rotate the title
		d3.select('.title')
			.attr('transform', 'rotate(-90)');

		// make a g element for each bar
		var bar = chart.selectAll('g')
			.data(data)
		.enter().append('g')
			.attr('class', 'bar')
			.attr('transform', function(d, i) {
				console.log(i)
				return 'translate(' + 
				i * barWidth + ', 0)';})
			.on('mouseover', tip.show)
			.on('mouseout', tip.hide);

		// make a rect element for each bar
		bar.append('rect')
			.attr('y', function(d) {return y(d.Open);})
			.attr('height', function (d) {return height - y(d.Open);})
			.attr('width', barWidth - 1);

	});
}