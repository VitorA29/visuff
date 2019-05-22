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
    }

    setClass (name)
    {
        this.class = name;
        return this;
    }

    setData (data)
    {
        this.data = data;
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
        this.xScale.range([0,this.width]).padding(0.3).align(0.3);
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

    baseBuild ()
    {
        this.prepareScale();
        let svg = this.appendSvg();
        this.createAxes(svg);
        let cht = this.appendChartGroup(svg);
        this.appendData(cht);
        this.addBrush(cht);
        return this;
    }
}