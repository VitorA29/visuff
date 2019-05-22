'use strict';

class BarChart extends BaseChart
{
    constructor (id)
    {
        super(id);
    }

    appendData (svg)
    {
        let cht = this.appendChartGroup(svg)
        let group = cht.selectAll('.datum')
            .data(this.data)
            .enter()
            .append('g')
            .attr('class', 'datum');

        group.selectAll('rect')
            .data( (d, i) => d.map( (b) => {b.groupIndex=i;return b;} ))
            .enter()
            .append('rect')
            .attr('x', d => this.xScale(d.x) + this.xScale.bandwidth() / this.multDataQtd * (1 + d.groupIndex - Math.floor(this.multDataQtd/2)))
            .attr('width', this.xScale.bandwidth()/this.multDataQtd)
            .attr('y', d => this.yScale(d.y))
            .attr('height', d => this.height - this.yScale(d.y))
            .attr('class', 'bar')
            .style('fill', d => this.creation ? this.colors[d.groupIndex] : '#000000');
    }

    build ()
    {
        this.xScale = d3.scaleBand().domain(this.data.flat().map( d => d.x )).padding(0.3).align(0.3);
        this.yScale = d3.scaleLinear().domain([ 0, d3.max(this.data.flat(), d => d.y ) ]);

        return this.baseBuild();
    } 
}