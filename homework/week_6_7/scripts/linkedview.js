/*  Bas Kuiken
*	10776990
*	UvA, minor Programmeren
*	Opdracht Dataprocessing, week 6
*
*	Dit script laadt een linked view in een html pagina. Dit wordt
*	gedaan aan de hand van d3.js.
*/

var dict2010 = {};
var dict2011 = {};
var dict2012 = {};
var dict2013 = {};
var dict2014 = {};
var dictBar = {};

window.onload = function() {

    var fileMap = 'data/unemploymentRate.json';
    var fileGraph = 'data/countryInfo.json';

    queue()
    .defer(d3.json, fileMap)
    .defer(d3.json, fileGraph)
    .await(mainFunc);

};

function mainFunc(error, dataMap, dataGraph) {
    if (error) throw error;



    for (var i = 2010; i < 2015; i++) {
        setColors(i, dataMap);
    }



    var map = new Datamap({
    element: document.getElementById('mapContainer'),
    fills: {
    defaultFill: 'grey',
    under10: 'green',
    betw1020: 'yellow',
    betw2030: 'orange',
    over30: 'red'
    },
    data: dict2010,
    projection: 'mercator'
    });

    dataMap.forEach(function (d) {
        d['2010'] = +d['2010'];
        d['2011'] = +d['2011'];
        d['2012'] = +d['2012'];
        d['2013'] = +d['2013'];
        d['2014'] = +d['2014'];
    });

    dataGraph.forEach(function(d) {
        d.MeanSchooling = +d.MeanSchooling;
        d.Consumerpriceindex2013 = +d.Consumerpriceindex2013;
    });

    var nestedInfo = d3.nest()
        .key(function (d) { return d.Id; })
        .entries(dataGraph);

    d3.select('#selectah')
        .on('change', function () {
        var curDataset;
        year = d3.event.target.value;
        if (year == 2010) {
            curDataset = dict2010;
        } else if (year == 2011) {
            curDataset = dict2011;
        } else if (year == 2012) {
            curDataset = dict2012;
        } else if (year == 2013) {
            curDataset = dict2013;
        } else {
            curDataset = dict2014;
        }
        map.updateChoropleth(curDataset);
    });


    // var nestData = d3.nest()
    // .key(function (d) { return d['Country Code']; })
    // .entries(dataMap);



    // var color = d3.scale.linear()
    // .domain(d3.min(dataMap, function(d) {
    // console.log([d['2010'], d['2011'], d['2012'], d['2013'], d['2014']])
    // return [d['2010'], d['2011'], d['2012'], d['2013'], d['2014']]
    // }))
    // .range([d3.rgb("#007AFF"), d3.rgb('#FFF500')]);
    //
    // var countries = d3.select
}


// function drawBarchart(dataset) {
//     var fullWidth = 500,
//     fullHeight = 240;
//
//     // initialize inner and outer size
//     var margin = {top: 10, right: 15, bottom: 15, left: 20},
//     width = fullWidth - margin.left - margin.right,
//     height = fullHeight - margin.top - margin.bottom;
//
//     var x = d3.scale.linear()
//             .rangeRoundBands([0, width]);
//             .domain([])
//     var y = d3.scale.linear()
//             .rangeRoundBands([height, 0]);
//
//     var xAxis = d3.axisBottom()
//             .scale(x);
//     var yAxis = d3.axisLeft()
//             .scale(y);
//
//     var chart = d3.select('.chart')
//         .attr('width', width + margin.left + margin.right)
//         .attr('height', height + margin.top + margin.bottom)
//         .append('g')
//         .attr('transform', 'translate(' + margin.left + ',' +
//             margin.top + ')');
// }


function setColors(year, dataset) {

    var bucketsColours = ['under10', 'betw1020', 'betw2030', 'over30'];

    for (var i = 0; i < dataset.length; i++) {
        var curColour;
        var curCountry = dataset[i]['Country Code'];
        if (dataset[i][2010] < 10) {
            curColour = bucketsColours[0];
            dict2010[curCountry] = {fillkey: curColour};
        } else if (dataset[i][2010] >= 10 && dataset[i][2010] < 20) {
            curColour = bucketsColours[1];
            dict2010[curCountry] = {fillkey: curColour};
        } else if (dataset[i][2010] >= 20 && dataset[i][2010] < 30) {
            curColour = bucketsColours[2];
            dict2010[curCountry] = {fillkey: curColour};
        } else {
            curColour = bucketsColours[3];
            dict2010[curCountry] = {fillkey: curColour};
        }
    }
}
