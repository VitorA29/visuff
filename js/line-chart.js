'use strict';

class LineChart extends BaseChart
{
    constructor (id)
    {
        super(id);
    }

    appendData (div)
    {
        let line = d3.line()
                    .x(d => this.xScale(d.name))
                    .y(d => this.yScale(d.value));

        div.append('path')
            .datum(this.data)
            .attr("fill", 'none')
            .attr("stroke", 'rgb(150,150,190)')
            .attr("stroke-width", '3')
            .attr('d', line);

        div.selectAll("circle")
            .data(this.data)
            .enter().append("circle")
            .attr("cx", d => this.xScale(d.name))
            .attr("cy", d => this.yScale(d.value))
            .attr("r", 3)
            .style('fill', 'rgb(150,150,190)');
    }

    build ()
    {
        let svg = this.appendSvg();
        let cht = this.appendChartGroup(svg);

        this.xScale = d3.scaleBand()
                        .domain(this.data.map( d => d.name ))
                        .range([0,this.width]);

        this.yScale = d3.scaleLinear()
                        .domain([ 0, d3.max(this.data, d => d.value) ])
                        .nice()
                        .range([this.height,0]);

        this.createAxes(svg);
        this.appendData(cht);
        return this;
    } 
}