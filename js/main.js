'use strict';

var myApp = {};

myApp.data    = undefined;

myApp.chart01 = undefined;
myApp.chart02 = undefined;

myApp.brush01 = [];
myApp.brush02 = [];

myApp.createCirclesData = function(n, i)
{
    let resultCircles = [];
    for(var j=0; j<i; j++){
        let circles = [];
        for(var k=0; k<n; k++)
            circles.push( { 'x': Math.random(), 'y': Math.random(), 'r': Math.random()*8+2 } );
        resultCircles.push(circles);
    }
    return resultCircles;
}

myApp.createBarsData = function(n, i)
{
    let bars = [];
    for(var j=0; j<n; j++)
        bars.push( { 'x': Math.ceil(Math.random()*1000), 'y': Math.random() } );
    bars = bars.sort( (a, b) => a.x - b.x)
    let resultBars = [ bars ];
    for(var j=1; j<i; j++)
        resultBars.push( bars.map( b => { return { 'x': b.x, 'y': Math.random() } } ) );
    return resultBars;
}

myApp.createLinesData = function(n, i)
{
    let resultDots = [];
    for(var j=0; j<i; j++){
        let dots = [];
        for(var k=0; k<n; k++)
            dots.push( { 'x': Math.ceil(Math.random()*1000), 'y': Math.random() } );
        resultDots.push(dots.sort( (a,b) => a.x-b.x ));
    }
    return resultDots;
}

myApp.linkedScatterBrush = function(div, selection)
{    
    if(div === "#chart01")
        myApp.chart01.updateBrush(selection, myApp.brush01);
    else
        myApp.chart02.updateBrush(selection, myApp.brush02);

    myApp.chart01.highlight(myApp.brush01, myApp.brush02, "#696969", "#FF00FF");
    myApp.chart02.highlight(myApp.brush02, myApp.brush01, "#696969", "#FF00FF");
}

myApp.run = function()
{
    myApp.circlesData = myApp.createCirclesData(100, 4);
    myApp.barsData = myApp.createBarsData(5,4);
    myApp.linesData = myApp.createLinesData(15, 4);
    
    myApp.chart01 = new ScatterChart('chart01').setData(myApp.circlesData).setCallback(myApp.linkedScatterBrush).build();
    myApp.chart02 = new ScatterChart('chart02').setData(myApp.circlesData).setCallback(myApp.linkedScatterBrush).build();
    myApp.chart03 = new BarChart('chart03').setData(myApp.barsData).build();
    myApp.chart04 = new LineChart('chart04').setData(myApp.linesData).build();
}

window.onload = myApp.run;