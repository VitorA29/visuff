'use strict';

class BarChart extends BaseChart
{
    constructor (id)
    {
        super(id);
    }

    appendData (div)
    {
        div.selectAll('rect')
            .data(this.data)
            .enter().append('rect')
            .attr('x', d => this.xScale(d.name))
            .attr('y', d => this.yScale(d.value))
            .attr('width', this.xScale.bandwidth())
            .attr('height', d => this.height - this.yScale(d.value))
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