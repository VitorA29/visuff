'use strict';

class BaseChart {

    constructor (id)
    {
        this.id = id;
        this.class = "generic-chart-graph";
        this.margins = {top: 10, bottom: 30, left: 25, right: 15};
        this.width = 350;
        this.height = 350;
        this.fontSize = 10;
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
        this.colors = data.map(d => d.color);
        this.multDataQtd = data.length;
        return this;
    }

    setCallback (callback)
    {
        this.callback = callback;
        return this;
    }

    setFontSize (val)
    {
        this.fontSize = val;
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
        this.legendSvg = d3.select('#'+this.id).append('svg')
            .attr('width', (this.fontSize/2)*10 + this.margins.right)
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

    addBrush ()
    {
        if(!this.callback){
            return;
        }
        this.brush = d3.brush()
            .on("start brush", () => {
                let select = d3.event.selection;
                this.callback('#'+this.id, select);
            });

        this.chart.append("g")
            .attr("class", "brush")
            .call(this.brush);
    }
    
    appendLegend ()
    {
        let radius = this.fontSize/2
        this.legendSvg.selectAll('circle')
            .data(this.legend)
            .enter()
            .append('circle')
            .attr('cx', radius + this.margins.left)
            .attr('cy', (d, i) => this.margins.top + (radius + this.margins.top)*i - radius/2)
            .attr('r', radius)
            .style('fill', (d,i) => this.colors[i]);
            
        this.legendSvg.selectAll('text')
            .data(this.legend)
            .enter()
            .append('text')
            .attr('x', radius + this.margins.left + this.margins.right)
            .attr('y', (d, i) => this.margins.top + (radius + this.margins.top)*i )
            .attr('style', 'font-size:'+ this.fontSize + ';')
            .text( d => d );
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

    highlight (currBrush, crosBrush, currColor, crossColor, interColor)
    {
        let cht = d3.select('#'+this.id).select('svg');
        cht.selectAll('.data-element').style("fill", (d, i) => {
            if(currBrush.indexOf(i) >= 0 && crosBrush.indexOf(i) >= 0) return interColor;
            else if(currBrush.indexOf(i) >= 0) return currColor;
            else if(crosBrush.indexOf(i) >= 0) return crossColor
            else return this.colors[d.groupIndex];
        });
    }

    addZoom (svg)
    {
        let resetZoom = () =>
        {
            this.xScale = this.xScaleDefault;
            this.xAxis.scale(this.xScaleDefault);

            let xAxisGroup = svg.select('.xAxis');
            xAxisGroup.call(this.xAxis);

            this.repositionXValues();
            
            d3.select('.zoom')
            .call(zoom.transform, d3.zoomIdentity);
        }

        d3.select('#'+this.id)
        .append('button')
        .on('click', resetZoom)
        .text("reset");

        let zoomed = () => 
        {
            let transform = d3.event.transform;
            
            this.xScale = transform.rescaleX(this.xScaleDefault);
            this.xAxis.scale(this.xScale);
                    
            let xAxisGroup = svg.select('.xAxis');
            xAxisGroup.call(this.xAxis);

            this.repositionXValues();
        }
        
        this.zoom = d3.zoom()
            .on("zoom", zoomed);

        svg.append("rect")
            .attr("class", "zoom")
            .attr("width", this.width)
            .attr("height", this.margins.bottom)
            .attr('transform', 'translate('+ this.margins.left +','+ (this.height+this.margins.top) +')')
            .attr('style', 'fill: none;pointer-events: all;z-index: 1000;')
            .call(this.zoom);
    }

    populateData ()
    {
        this.appendData()
        this.appendLegend();
        this.creation = false;
        return this;
    }

    baseBuild ()
    {
        this.xScale = this.xScaleDefault;
        this.prepareScale();
        let svg = this.appendSvg();
        this.createAxes(svg);
        
        this.chart = this.appendChartGroup(svg);
        this.addBrush();
        this.addZoom(svg);
        this.creation = true;
        return this;
    }
}