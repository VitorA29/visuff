'use strict';

var myApp = {};

myApp.data    = undefined;

myApp.chart01 = undefined;
myApp.chart02 = undefined;

myApp.brush01 = [];
myApp.brush02 = [];

myApp.brush03 = [];
myApp.brush04 = [];

myApp.brush05 = [];
myApp.brush06 = [];

let colors = [ '#FF6C00', '#FFE000', '#13FF00', '#00FFC5', '#00F0FF', '#000CFF', '#C900FF', '#FF00AE' ];

myApp.createCirclesData = function(n, i)
{
    let resultCircles = [];
    for(var j=0; j<i; j++){
        let circles = [];
        for(var k=0; k<n; k++)
            circles.push( { 'x': Math.random(), 'y': Math.random(), 'r': Math.random()*8+2 } );
        resultCircles.push( { 'name':String(j), 'values':circles, 'color': colors[j] } );
    }
    return resultCircles;
}

myApp.createBarsData = function(n, i)
{
    let bars = [];
    for(var j=0; j<n; j++)
        bars.push( { 'x': Math.ceil(Math.random()*1000), 'y': Math.random() } );
    bars = bars.sort( (a, b) => a.x - b.x)
    let resultBars = [ { 'name':'0', 'values':bars, 'color': colors[0] } ];
    for(var j=1; j<i; j++)
        resultBars.push( { 'name':String(j), 'values':bars.map( b => { return { 'x': b.x, 'y': Math.random() } } ), 'color': colors[j] } );
    return resultBars;
}

myApp.createLinesData = function(n, i)
{
    let resultDots = [];
    for(var j=0; j<i; j++){
        let dots = [];
        for(var k=0; k<n; k++)
            dots.push( { 'x': Math.ceil(Math.random()*1000), 'y': Math.random() } );
        resultDots.push( { 'name':String(j), 'values':dots.sort( (a,b) => a.x-b.x ), 'color': colors[j] } );
    }
    return resultDots;
}

myApp.linkedScatterBrush = function(div, selection)
{    
    if(div === "#chart01")
        myApp.chart01.updateBrush(selection, myApp.brush01);
    else
        myApp.chart02.updateBrush(selection, myApp.brush02);

    myApp.chart01.highlight(myApp.brush01, myApp.brush02, "#696969", "#FF00FF", "#0000FF");
    myApp.chart02.highlight(myApp.brush02, myApp.brush01, "#696969", "#FF00FF", "#0000FF");
}

myApp.linkedBarBrush = function(div, selection)
{    
    if(div === "#chart03")
        myApp.chart03.updateBrush(selection, myApp.brush03);
    else
        myApp.chart04.updateBrush(selection, myApp.brush04);

    myApp.chart03.highlight(myApp.brush03, myApp.brush04, "#696969", "#FF00FF", "#0000FF");
    myApp.chart04.highlight(myApp.brush04, myApp.brush03, "#696969", "#FF00FF", "#0000FF");
}

myApp.linkedLineBrush = function(div, selection)
{    
    if(div === "#chart05")
        myApp.chart05.updateBrush(selection, myApp.brush05);
    else
        myApp.chart06.updateBrush(selection, myApp.brush06);

    myApp.chart05.highlight(myApp.brush05, myApp.brush06, "#696969", "#FF00FF", "#0000FF");
    myApp.chart06.highlight(myApp.brush06, myApp.brush05, "#696969", "#FF00FF", "#0000FF");
}

myApp.run = function()
{
    myApp.circlesData = myApp.createCirclesData(100, 4);
    myApp.barsData = myApp.createBarsData(5,4);
    myApp.linesData = myApp.createLinesData(15, 4);
    
    myApp.chart01 = new ScatterChart('chart01').setData(myApp.circlesData).setCallback(myApp.linkedScatterBrush).build().populateData();
    myApp.chart02 = new ScatterChart('chart02').setData(myApp.circlesData).setCallback(myApp.linkedScatterBrush).build().populateData();
    myApp.chart03 = new BarChart('chart03').setData(myApp.barsData).setCallback(myApp.linkedBarBrush).build().populateData();
    myApp.chart04 = new BarChart('chart04').setData(myApp.barsData).setCallback(myApp.linkedBarBrush).build().populateData();
    myApp.chart05 = new LineChart('chart05').setData(myApp.linesData).setCallback(myApp.linkedLineBrush).build().populateData();
    myApp.chart06 = new LineChart('chart06').setData(myApp.linesData).setCallback(myApp.linkedLineBrush).build().populateData();
}

window.onload = myApp.run;