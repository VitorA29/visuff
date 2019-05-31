'use strict';

class BarChart extends BaseChart
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

        let barData = d =>
        {
            let barSize = this.xScale.bandwidth()/this.multDataQtd;
            let index = d.groupIndex;
            let center = this.xScale(d.x) + this.margins.left;
            return center + barSize*(d.groupIndex - this.multDataQtd/2);
        }

        group.selectAll('rect')
            .data( (d, i) => d.map( b => {b.groupIndex=i;return b;} ))
            .enter()
            .append('rect')
            .attr('x', d => barData(d) )
            .attr('width', this.xScale.bandwidth()/this.multDataQtd)
            .attr('y', d => this.yScale(d.y))
            .attr('height', d => this.height - this.yScale(d.y))
            .attr('class', 'data-element')
            .style('fill', d => this.creation ? this.colors[d.groupIndex] : '#000000');
    }

    addZoom (_)
    {
        return;
    }

    build ()
    {
        this.xScaleDefault = d3.scaleBand().domain(this.data.flat().map( d => d.x )).padding(0.3);
        this.yScale = d3.scaleLinear().domain([ 0, d3.max(this.data.flat(), d => d.y ) ]);

        return this.baseBuild();
    } 
}