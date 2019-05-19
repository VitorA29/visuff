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
    
    for(var id=0; id<n; id++)
    {
        var x = Math.random();
        var y = Math.random();
        var r = Math.random()*8+2;

        var c = {'cx': x, 'cy': y, 'r': r};
        
        circles.push(c);
    }
    
    return circles;
}

myApp.createBarsData = function(n)
{
    let bars = [];
    
    for(var id=0; id<n; id++)
    {
        var name = Math.ceil(Math.random()*1000);
        var value = Math.random();

        var c = {'name': name, 'value': value};
        
        bars.push(c);
    }
    
    return bars.sort( (a, b) => a.name - b.name);
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