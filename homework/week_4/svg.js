/* Bas Kuiken
*	10776990
*	UvA, minor Programmeren
*	Opdracht Dataprocessing, week 4
*	
*	Dit script laadt een svg element in aan de hand van d3.js. Het is een 
*	legenda. 
*/
window.onload = function() {

	var data1 = [100, 1000, 10000, 100000, 1000000, 10000000],
	dataColor = [1, 2, 3],
	dataText = [2, 3],
	widthRect = 21,
	heightRect = 29,
	widthRect2 = 119.1,
	xColor = 13,
	xText = 46.5
	xMargin = 10,
	yMargin = 20,
	yStart = 96.8,
	yStart2 = 13.5
	yIncrement = 41.9,
	legendColors = d3.scaleOrdinal()
		.range(['#ccece6','#99d8c9','#66c2a4','#41ae76','#238b45','#005824']);

	// Load SVG to javascript
	d3.xml('test.svg', function(error, xml) {
		if (error) throw error;    
		document.body.appendChild(xml.documentElement);

		var legend = d3.select('svg')

		var printText = legend.append('g')
			.selectAll('g')
			.data(data1)
			.enter()
				.append('text')
				.attr('transform', function(d, i) {
					var x = xText + xMargin,
					y = yStart2 + (yIncrement * i) + yMargin;
					return 'translate(' + x + ', ' + y + ')';
				})
				.text(function(d) {
					return d;
				})
				.style('font-size', '20px')
				.style('fill', '#145A32 ');

		var colorElement = legend.append('g')
			.selectAll('g')
			.data(dataColor)
			.enter()
				.append('rect')
				.attr('class', 'st1')
				.attr('width', widthRect)
				.attr('height', heightRect)
				.attr('transform', function(d) {
					var x = xColor,
					y = yStart + (yIncrement * d);
					return 'translate(' + x + ', ' + y + ')';
				})
				.attr('id', function(d) {
					return 'kleur' + (+d + +dataColor[2]);
				})
				.attr('stroke', 'black');

		var textElement = legend.append('g')
			.selectAll('rect')
			.data(dataText)
			.enter()
				.append('g')
				.append('rect')
				.attr('class', 'st2')
				.attr('width', widthRect2)
				.attr('height', heightRect)
				.attr('transform', function (d) {
					var x = xText,
					y = yStart + (yIncrement * d);
					return 'translate(' + x + ', ' + y + ')';
				})
				.attr('id', function(d) {
					return 'text' + (+d + +dataText[1]);
				})
				.style('stroke', 'black');

		var fillColor = legend.selectAll('.st1')
			.style('fill', function (d, i) {
				return legendColors(i);
			});





	});


};