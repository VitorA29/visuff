'use strict';

class BaseChart {

    constructor (id)
    {
        this.id = id;
        this.class = "generic-chart-graph";
        this.margins = {top: 10, bottom: 30, left: 25, right: 15};
        this.width = 350;
        this.height = 350;
        this.colors = [ '#FF6C00', '#FFE000', '#13FF00', '#00FFC5', '#00F0FF', '#000CFF', '#C900FF', '#FF00AE' ]
        this.creation = true;
    }

    setWidth (val)
    {
        this.width = val;
    }

    setHeight (val)
    {
        this.height = val;
    }

    setClass (name)
    {
        this.class = name;
        return this;
    }

    setData (data)
    {
        this.data = data.map(d => d.values);
        this.legend = data.map(d => d.name);
        this.multDataQtd = data.length;
        return this;
    }

    setCallback (callback)
    {
        this.callback = callback;
        return this;
    }

    prepareScale ()
    {
        this.xScale.range([0,this.width]);
        this.yScale.range([this.height,0]);
    }

    appendSvg ()
    {
        let node = d3.select('#'+this.id).append('svg')
            .attr('width', this.width + this.margins.left + this.margins.right)
            .attr('height', this.height + this.margins.top + this.margins.bottom);
        return node;
    }

    appendChartGroup (svg)
    {
        let chart = svg.append('g')
            .attr('width', this.width)
            .attr('height', this.height)
            .attr('transform', 'translate('+ this.margins.left +','+ this.margins.top +')' );
        return chart;
    }

    createAxes (svg)
    {
        let xAxisGroup = svg.append('g')
            .attr('class','xAxis')
            .attr('transform', 'translate('+ this.margins.left +','+ (this.height+this.margins.top) +')');

        let yAxisGroup = svg.append('g')
            .attr('class','yAxis')
            .attr('transform', 'translate('+ this.margins.left +','+ this.margins.top +')');

        this.xAxis = d3.axisBottom(this.xScale);
        this.yAxis = d3.axisLeft(this.yScale);

        xAxisGroup.call(this.xAxis);
        yAxisGroup.call(this.yAxis);
    }

    addBrush (svg)
    {
        if(!this.callback){
            return;
        }
        this.brush = d3.brush()
            .on("start brush", () => {
                let select = d3.event.selection;
                this.callback('#'+this.id, select);
            });

        svg.append("g")
            .attr("class", "brush")
            .call(this.brush);   
    }
    
    appendLegend (cht)
    {
        cht.selectAll('text')
            .data(this.legend)
            .enter()
            .append('text')
            .attr('x', this.width - 52)
            .attr('y', (d, i) => i * 20 + 9)
            .attr('style', (d,i) => 'z-index:10;fill:'+this.colors[i]+';')
            .text( d => d);
    }

    updateBrush (selection, currBrush)
    {
        let s = selection,
           x0 = s[0][0],
           y0 = s[0][1],
           x1 = s[1][0],
           y1 = s[1][1];

        let svg = d3.select('#'+this.id)
                    .select('svg');

        svg.selectAll('.data-element')
            .each((d,i) =>
            {
                let pos = currBrush.indexOf(i);
        
                if (this.xScale(d.x) >= x0 && this.xScale(d.x) <= x1 &&
                    this.yScale(d.y) >= y0 && this.yScale(d.y) <= y1)
                { 
                    if(pos === -1) currBrush.push(i);
                }
                else
                {
                    if(pos  >=  0) currBrush.splice(pos, 1);
                }
            });
    }

    highlight (currBrush, crosBrush, currColor, crossColor)
    {
        let cht = d3.select('#'+this.id).select('svg');
        cht.selectAll('.data-element').style("fill", (d, i) => {
            if(currBrush.indexOf(i) >= 0 && crosBrush.indexOf(i) >= 0) return "#0000FF";
            else if(currBrush.indexOf(i) >= 0) return currColor;
            else if(crosBrush.indexOf(i) >= 0) return crossColor
            else return this.colors[d.groupIndex];
        });
    }

    baseBuild ()
    {
        this.prepareScale();
        let svg = this.appendSvg();
        this.createAxes(svg);

        let cht = this.appendChartGroup(svg);
        this.appendData(cht);
        this.appendLegend(cht);
        this.addBrush(cht);
        this.creation = false;
        return this;
    }
}