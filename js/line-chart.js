'use strict';

class LineChart extends BaseChart
{
    constructor (id)
    {
        super(id);
    }

    appendData ()
    {
        let line = d3.line()
            .x(d =>this.xScale(d.x))
            .y(d => this.yScale(d.y));

        let group = this.chart.selectAll('.datum')
            .data(this.data)
            .enter()
            .append('g')
            .attr('class', 'datum');

        group.append('path')
            .attr('fill', 'none')
            .attr('stroke', (d, i) => this.colors[i])
            .attr('stroke-width', '3')
            .attr('class', 'path')
            .attr('d', line);

        group.selectAll('circle')
            .data((d, i) => d.map( b => {b.groupIndex=(i % this.colors.length);return b;} ) )
            .enter()
            .append('circle')
            .attr('cx', d => this.xScale(d.x))
            .attr('cy', d => this.yScale(d.y))
            .attr('r' , 3)
            .attr('class', 'data-element')
            .style('fill', d => this.creation ? this.colors[d.groupIndex] : '#000000');
    }

    build ()
    {
        this.xScale = d3.scaleLinear().domain([ d3.min(this.data.flat(), d => d.x), d3.max(this.data.flat(), d => d.x) ]);
        this.yScale = d3.scaleLinear().domain([ 0, d3.max(this.data.flat(), d => d.y) ]);
        return this.baseBuild();
    } 
}