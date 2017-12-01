/*  Bas Kuiken
*	10776990
*	UvA, minor Programmeren
*	Opdracht Dataprocessing, week 4
*
*	Dit script laadt een scatterplot in, die de relatie weergeeft tussen het
*	aantal mobiele abonnementen en de Human Development Index (HDI) in 2014.
*	Scatterplot is gebaseerd op deze code:
*	https://bl.ocks.org/mbostock/3887118
*	Tooltips zijn gebaseerd op deze code:
*	https://bl.ocks.org/d3noob/257c360b3650b9f0a52dd8257d7a2d73
*/

window.onload = function() {
	var margin = {top: 20, right: 200, bottom: 30, left: 40},
	width = 960 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;

	var file = 'countryInfo.csv';

	var x = d3.scaleLinear()
		.range([0, width]);

	var y = d3.scaleLinear()
		.range([height, 0]);

	var xAxis = d3.axisBottom()
		.scale(x);

	var yAxis = d3.axisLeft()
		.scale(y);

	var legendRects = 5;

	var colorRange = ["#DFDFDF", "#A7B0D2", "#6F81C6",
		"#3752B9", "#0023AD"];

	var svg = d3.select('body').append('svg')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
	.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	var div = d3.select("body").append("div")
		.attr("class", "tooltip")
		.style("opacity", 0);

	// load data and run code inside
	d3.csv(file, function(error, data) {
		if (error) throw error;

		data.forEach(function(d) {
			d.HumanDevelopmentIndexHDI =
				+d.HumanDevelopmentIndexHDI;
			d['Mobile phone subscriptions per 100 people 2014'] = +d['Mobile phone subscriptions per 100 people 2014'];
		});

		var color = d3.scaleLinear()
			.range(["#0023AD",
				"#DFDFDF"])
			.domain([0, 188]);

		// define domains
		x.domain([d3.min(data, function(d) {return d['Mobile phone subscriptions per 100 people 2014'];}),
			d3.max(data, function(d) {return d['Mobile phone subscriptions per 100 people 2014'];})]);

		y.domain([
			d3.min(data, function(d) {return (d.HumanDevelopmentIndexHDI - 0.05);}),
			d3.max(data, function(d) {return d.HumanDevelopmentIndexHDI;})
			]);

		// append x-axis
		svg.append('g')
			.attr('class', 'x axis')
			.attr('transform', 'translate(0,' + height + ')')
			.call(xAxis)
		.append('text')
			.attr('class', 'label')
			.attr('x', width)
			.attr('y', -6)
			.style('text-anchor', 'end')
			.style('fill', 'black')
			.text('Mobile phone subscriptions per 100 people (2014)');

		// append y-axis
		svg.append('g')
			.attr('class', 'y axis')
			.call(yAxis)
		.append('text')
			.attr('class', 'label')
			.attr('transform', 'rotate(-90)')
			.attr('y', 6)
			.attr('dy', '.71em')
			.style('text-anchor', 'end')
			.style('fill', 'black')
			.text('Human Development Index HDI (2014)')

		// make dots for each datapoint, color them and add a tooltip
		svg.selectAll(".dot")
			.data(data)
		.enter().append("circle")
			.attr("class", function(d) {
				if (d['Internet users percentage of population 2014'] < 20) {
					return '.dot0'
				} else if (d['Internet users percentage of population 2014'] < 30) {
					return '.dot1'
				} else if (d['Internet users percentage of population 2014'] < 40) {
					return '.dot2'
				} else if (d['Internet users percentage of population 2014'] < 50) {
					return '.dot3'
				} else if (d['Internet users percentage of population 2014'] < 60) {
					return '.dot4'
				} else if (d['Internet users percentage of population 2014'] < 70) {
					return '.dot5'
				} else if (d['Internet users percentage of population 2014'] < 80) {
					return '.dot6'
				} else if (d['Internet users percentage of population 2014'] < 90) {
					return '.dot7'
				} else {
					return '.dot8'
				}
				return color(d['Internet users percentage of population 2014']); })
			.attr("r", 3.5)
			.attr("cx", function(d) {
				return x(d['Mobile phone subscriptions per 100 people 2014']); })
			.attr("cy", function(d) { return y(d.HumanDevelopmentIndexHDI); })
			.style("fill", function(d, i) {
				return color(i)
			})
			.on("mouseover", function(d) {
				div.transition()
					.duration(200)
					.style("opacity", .9);
				div.html('Country: ' + d.Id + "<br/>" + 'HDI: ' +
						(Math.round(d.HumanDevelopmentIndexHDI * 100) / 100 ) +
						'</br>' + 'Mobile subs: ' +
						Math.round(d['Mobile phone subscriptions per 100 people 2014'])
						+ '</br> Internet usage: ' + d['Internet users percentage of population 2014'])
					.style("left", (d3.event.pageX) + "px")
					.style("top", (d3.event.pageY - 28) + "px");
			})
			.on("mouseout", function(d) {
				div.transition()
					.duration(500)
					.style("opacity", 0);
			});


		// append colored rects
		var g = svg.select('g');
		for (var i = 0; i < legendRects; i++) {
			g.append('rect')
				.attr('id', 'rect' + i)
				.attr('x', width + margin.right - 18)
				.attr('y', - height + 20  * i)
				.attr('width', 18)
				.attr('height', 18)
				.style('fill', colorRange[i])
		};

		// place text elements next to legend
		for (var i = 0; i < legendRects; i++) {
		svg.select('#rect' + i)
			.append("g")
			.append('text')
				.style('text-anchor', 'start')
				.text('<' + +20 + (+i * +20) + '%')
				.style('fill', 'black');
		}
	});
};
