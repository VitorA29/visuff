'use strict';

class LineChart extends BaseChart
{
    constructor (id)
    {
        super(id);
    }

    appendData (svg)
    {
        for (let i=0;i<this.multDataQtd;i++){
            let cht = this.appendChartGroup(svg).attr('class', 'datum index_'+i)

            let line = d3.line()
                    .x(d => this.xScale(d.x))
                    .y(d => this.yScale(d.y));

            cht.append('path')
                .datum( this.data[i] )
                .attr('fill', 'none')
                .attr('stroke', this.colors[i])
                .attr('stroke-width', '3')
                .attr('d', line);
    
            let dots = cht.selectAll('.circle'+i).data(this.data[i]);

            dots.enter()
                .append('circle')
                .attr('class', 'circle'+i)
                .attr('cx', d => this.xScale(d.x))
                .attr('cy', d => this.yScale(d.y))
                .attr('r', 3)
                .style('fill', this.creation ? this.colors[i] : '#000000');
        }
    }

    build ()
    {
        this.xScale = d3.scaleLinear().domain([ d3.min(this.data.flat(), d => d.x), d3.max(this.data.flat(), d => d.x) ]);
        this.yScale = d3.scaleLinear().domain([ 0, d3.max(this.data.flat(), d => d.y) ]);
        return this.baseBuild();
    } 
}