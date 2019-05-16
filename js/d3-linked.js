'use strict';

var myApp = {};

myApp.data    = undefined;

myApp.chart01 = undefined;
myApp.chart02 = undefined;

myApp.brush01 = [];
myApp.brush02 = [];

myApp.createCirclesData = function(n)
{
    var circles = [];
    
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

myApp.linkedBrush = function(div, selection)
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
    myApp.data = myApp.createCirclesData(100);
    
    myApp.chart01 = new scatterPlot();
    myApp.chart01.run("#chart01", myApp.data, myApp.linkedBrush);

    myApp.chart02 = new scatterPlot();
    myApp.chart02.run("#chart02", myApp.data, myApp.linkedBrush);
}


window.onload = myApp.run;