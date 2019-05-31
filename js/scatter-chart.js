'use strict';

class ScatterChart extends BaseChart
{
    constructor (id)
    {
        super(id);
    }

    appendData ()
    {
        let group = this.chart.selectAll('.datum')
            .data(this.data)
            .enter()
            .append('g')
            .attr('class', 'datum');

        group.selectAll('circle')
            .data((d, i) => d.map( b => {b.groupIndex=i;return b;} ) )
            .enter()
            .append('circle')
            .attr('cx', d => this.xScale(d.x))
            .attr('cy', d => this.yScale(d.y))
            .attr('r' , d => d.r)
            .attr('class', 'data-element')
            .style('fill', d => this.creation ? this.colors[d.groupIndex] : '#000000');
    }

    repositionXValues ()
    {
        this.chart.selectAll('.datum')
            .selectAll('.data-element')
            .attr('cx', d => this.xScale(d.x));
    }

    build ()
    {
        this.xScaleDefault = d3.scaleLinear().domain([d3.min(this.data.flat(), d => d.x), d3.max(this.data.flat(), d => d.x)]);
        this.yScale = d3.scaleLinear().domain([d3.min(this.data.flat(), d => d.y), d3.max(this.data.flat(), d => d.y)]);
        return this.baseBuild();
    } 
}