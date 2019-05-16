'use strict';

function scatterPlot()
{
    var scope = this;
    var exports = {};
    
    scope.margins = {top: 10, bottom: 30, left: 25, right: 15};
    scope.cw = 350;
    scope.ch = 350;
    
    scope.div      = undefined;
    scope.xScale   = undefined;
    scope.yScale   = undefined;
    scope.xAxis    = undefined;
    scope.yAxis    = undefined;
    scope.brush    = undefined;
    
    scope.data     = undefined;
    scope.callback = undefined;

    scope.appendSvg = function(div)
    {
        var node = d3.select(div).append('svg')
            .attr('width', scope.cw + scope.margins.left + scope.margins.right)
            .attr('height', scope.ch + scope.margins.top + scope.margins.bottom);

        return node;
    }

    scope.appendChartGroup = function(svg)
    {
        var chart = svg.append('g')
            .attr('width', scope.cw)
            .attr('height', scope.ch)
            .attr('transform', 'translate('+ scope.margins.left +','+ scope.margins.top +')' );

        return chart;
    }

    scope.createAxes = function(svg)
    {
        scope.xScale = d3.scaleLinear().domain([0,1]).range([0,scope.cw]);
        scope.yScale = d3.scaleLinear().domain([0,1]).range([0,scope.ch]);

        var xAxisGroup = svg.append('g')
            .attr('class', 'xAxis')
            .attr('transform', 'translate('+ scope.margins.left +','+ (scope.ch+scope.margins.top) +')');

        var yAxisGroup = svg.append('g')
            .attr('class', 'yAxis')
            .attr('transform', 'translate('+ scope.margins.left +','+ scope.margins.top +')');

        scope.xAxis = d3.axisBottom(scope.xScale);
        scope.yAxis = d3.axisLeft(scope.yScale);

        xAxisGroup.call(scope.xAxis);
        yAxisGroup.call(scope.yAxis);
    }

    scope.addBrush = function(svg)
    {
        function brushed()
        {
            var select = d3.event.selection;
            scope.callback(scope.div, select);
        };

        scope.brush = d3.brush()
            .on("start brush", brushed);

        svg.append("g")
            .attr("class", "brush")
            .call(scope.brush);   
    }

    scope.appendCircles = function(div)
    {
        var arr = scope.data;

        var circle = div.selectAll('circle')
            .data(arr)
            .enter()
            .append('circle')
            .attr('cx', function(d){ return scope.xScale(d.cx); })
            .attr('cy', function(d){ return scope.yScale(d.cy); })
            .attr('r' , function(d){ return d.r;  })
            .style('fill', 'rgb(150,150,190)');

        return circle;
    }

    //------------- exported API -----------------------------------
    
    exports.updateBrush = function(selection, currBrush)
    {
        var s = selection,
           x0 = s[0][0],
           y0 = s[0][1],
           x1 = s[1][0],
           y1 = s[1][1];

    
        var svg = d3.select(scope.div)
                    .select('svg');

        svg.selectAll('circle')
            .each(function(d,i)
            {
                var pos = currBrush.indexOf(i);
            
                if (scope.xScale(d.cx) >= x0 && scope.xScale(d.cx) <= x1 && 
                    scope.yScale(d.cy) >= y0 && scope.yScale(d.cy) <= y1)
                { 
                    if(pos === -1) currBrush.push(i);                    
                }
                else
                {
                    if(pos  >=  0) currBrush.splice(pos, 1);
                }
            });
    }
    
    
    exports.highlight = function(currBrush, crosBrush, currColor, crossColor)
    {
        var svg = d3.select(scope.div).select('svg');

        svg.selectAll('circle')
            .style("fill", function(d, i) 
            {
                if(currBrush.indexOf(i) >= 0 && crosBrush.indexOf(i) >= 0) return "#fecdca";
                else if(currBrush.indexOf(i) >= 0) return currColor;
                else if(crosBrush.indexOf(i) >= 0) return crossColor
                else return 'rgb(150,150,190)';            
            });        
    }
    
    exports.run = function(div, data, callback) 
    {
        scope.div = div;
        scope.data = data;
        scope.callback = callback;

        var svg = scope.appendSvg(div);
        var cht = scope.appendChartGroup(svg); 

        scope.createAxes(svg);    
        scope.appendCircles(cht);
        scope.addBrush(cht);
    }
    
    return exports;
};

