'use strict';

var myApp = {};

myApp.data    = undefined;

myApp.chart01 = undefined;
myApp.chart02 = undefined;

myApp.brush01 = [];
myApp.brush02 = [];

myApp.createCirclesData = function(n)
{
    let circles = [];
    for(var i=0; i<2*n; i++)
        circles.push( { 'x': Math.random(), 'values': [ { 'y': Math.random(), 'r': Math.random()*8+2, 'name': i % n } ] } );
    return circles;
}

myApp.createBarsData = function(n, i)
{
    let bars = [];
    for(var id=0; id<n; id++)
        bars.push( { 'x': Math.ceil(Math.random()*1000), 'y': Math.random() } );
    bars = bars.sort( (a, b) => a.x - b.x)
    let resultBars = [ bars ];
    for(var id=1; id<i; id++)
        resultBars.push( bars.map( b => { return { 'x': b.x, 'y': Math.random() } } ) );
    return resultBars;
}

myApp.createLinesData = function(n)
{
    let dots = [];
    for(var i=0; i<2*n; i++)
        dots.push( { 'x': Math.random(), 'values': [ { 'y': Math.random(), 'name': i % n } ] } );
    return dots;
}

myApp.linkedScatterBrush = function(div, selection)
{    
    if(div === "#chart01")
        myApp.chart01.updateBrush(selection, myApp.brush01);
    else
        myApp.chart02.updateBrush(selection, myApp.brush02);

    myApp.chart01.highlight(myApp.brush01, myApp.brush02, "#ec7014", "#a2cd5a");
    myApp.chart02.highlight(myApp.brush02, myApp.brush01, "#ec7014", "#a2cd5a");
}

myApp.run = function()
{
    myApp.circlesData = myApp.createCirclesData(100);
    myApp.barsData = myApp.createBarsData(15,2);
    myApp.linesData = myApp.createLinesData(15);
    
    // myApp.chart01 = new ScatterChart('chart01').setData(myApp.circlesData).setCallback(myApp.linkedScatterBrush).build();
    // myApp.chart02 = new ScatterChart('chart02').setData(myApp.circlesData).setCallback(myApp.linkedScatterBrush).build();
    myApp.chart03 = new BarChart('chart03').setData(myApp.barsData).build();
    // myApp.chart04 = new LineChart('chart04').setData(myApp.barsData).build();
}

window.onload = myApp.run;