'use strict';

class LineChart extends BaseChart
{
    constructor (id)
    {
        super(id);
    }

    appendData (div, data, i)
    {
        let line = d3.line()
                    .x(d => this.xScale(d.x))
                    .y(d => this.yScale(d.y));

        div.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', this.colors[i])
            .attr('stroke-width', '3')
            .attr('d', line);

        div.selectAll('circle'+i)
            .data(data)
            .enter().append('circle')
            .attr('cx', d => this.xScale(d.x))
            .attr('cy', d => this.yScale(d.y))
            .attr('r', 3)
            .style('fill', this.colors[i]);
    }

    build ()
    {
        this.xScale = d3.scaleBand().domain(this.data.flat().map(d => d.x));
        this.yScale = d3.scaleLinear().domain([ 0, d3.max(this.data.flat(), d => d.y) ]);
        return this.baseBuild();
    } 
}