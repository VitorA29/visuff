'use strict';

var myApp = {};

myApp.data    = undefined;

myApp.chart01 = undefined;
myApp.chart02 = undefined;

myApp.brush01 = [];
myApp.brush02 = [];

myApp.createCirclesData = function(n)
{
    let circles1 = [];
    let circles2 = [];
    
    for(var id=0; id<n; id++)
    {
        circles1.push({'x': Math.random(), 'y': Math.random(), 'r': Math.random()*8+2});
        circles2.push({'x': Math.random(), 'y': Math.random(), 'r': Math.random()*8+2});
    }
    
    return [ circles1, circles2 ];
}

myApp.createBarsData = function(n)
{
    let bars = [];
    
    for(var id=0; id<n; id++)
    {
        var x = Math.ceil(Math.random()*1000);
        var y = Math.random();

        var c = {'x': x, 'y': y};
        
        bars.push(c);
    }
    bars = bars.sort( (a, b) => a.x - b.x);
    return [ bars, bars.map(b => { return {'x':b.x, 'y':Math.random()} }) ];
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
    myApp.barsData = myApp.createBarsData(15);
    
    myApp.chart01 = new ScatterChart('chart01').setData(myApp.circlesData).setCallback(myApp.linkedScatterBrush).build();
    myApp.chart02 = new ScatterChart('chart02').setData(myApp.circlesData).setCallback(myApp.linkedScatterBrush).build();
    myApp.chart03 = new BarChart('chart03').setData(myApp.barsData).build();
    myApp.chart03 = new LineChart('chart04').setData(myApp.barsData).build();
}

window.onload = myApp.run;