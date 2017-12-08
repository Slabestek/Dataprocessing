/*  Bas Kuiken
*	10776990
*	UvA, minor Programmeren
*	Opdracht Dataprocessing, week 6
*
*	Dit script laadt een linked view in een html pagina. Dit wordt
*	gedaan aan de hand van d3.js.
*/

window.onload = function() {

	var fileMap = 'unemploymentRate.json';
	var fileGraph = 'countryInfo.json';

	queue()
	.defer(d3.json, fileMap)
	.defer(d3.json, fileGraph)
	.await(mainFunc)

};

function mainFunc(error, dataMap, dataGraph) {
	var map = new Datamap({
		element: document.getElementById('container'),
		fills: {
			defaultFill: 'grey'
		},
		projection: 'mercator',
	});

	dataMap.forEach(function (d) {
		d['2010'] = +d['2010'];
		d['2011'] = +d['2011'];
		d['2012'] = +d['2012'];
		d['2013'] = +d['2013'];
		d['2014'] = +d['2014'];
		console.log(typeof(d['2010']), typeof(d['2014']))
	});

	dataGraph.forEach(function(d) {
		d.MeanSchooling = +d.MeanSchooling;
	});

	var nestData = d3.nest()
		.key(function (d) { return d['Country Code']; })
		.entries(dataMap);



	var color = d3.scale.linear()
		.domain(d3.min(dataMap, function(d) {
			console.log([d['2010'], d['2011'], d['2012'], d['2013'], d['2014']])
			return [d['2010'], d['2011'], d['2012'], d['2013'], d['2014']]
		}))
		.range([d3.rgb("#007AFF"), d3.rgb('#FFF500')]);

	var countries = d3.select
};
