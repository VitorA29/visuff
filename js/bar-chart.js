'use strict';

class BarChart extends BaseChart
{
    constructor (id)
    {
        super(id);
    }

    appendData (div, data, i)
    {
        div.selectAll('rect'+i)
            .data(data)
            .enter().append('rect')
            .attr('x', d => this.xScale(d.x))
            .attr('y', d => this.yScale(d.y))
            .attr('width', this.xScale.bandwidth())
            .attr('height', d => this.height - this.yScale(d.y))
            .style('fill', this.colors[i])
            .style("opacity", 0.6);
    }

    build ()
    {
        this.xScale = d3.scaleBand().domain(this.data.flat().map( d => d.x ));
        this.yScale = d3.scaleLinear().domain([0, d3.max(this.data.flat(), d => d.y)]);

        return this.baseBuild();
    } 
}