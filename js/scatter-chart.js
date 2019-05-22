'use strict';

class ScatterChart extends BaseChart
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

        group.selectAll('circle')
            .data((d, i) => d.map( (b) => {b.groupIndex=i;return b;} ) )
            .enter()
            .append('circle')
            .attr('cx', d => this.xScale(d.x))
            .attr('cy', d => this.yScale(d.y))
            .attr('r' , d => d.r)
            .style('fill', d => this.creation ? this.colors[d.groupIndex] : '#000000');

        this.addBrush(cht);
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

        svg.selectAll('circle')
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

    highlight (currBrush, crosBrush, currColor, crossColor)
    {
        let cht = d3.select('#'+this.id).select('svg');
        cht.selectAll('circle').style("fill", (d, i) => {
            if(currBrush.indexOf(i) >= 0 && crosBrush.indexOf(i) >= 0) return "#0000FF";
            else if(currBrush.indexOf(i) >= 0) return currColor;
            else if(crosBrush.indexOf(i) >= 0) return crossColor
            else return this.colors[d.groupIndex];
        });
    }

    build ()
    {
        this.xScale = d3.scaleLinear().domain([d3.min(this.data.flat(), d => d.x), d3.max(this.data.flat(), d => d.x)]);
        this.yScale = d3.scaleLinear().domain([d3.min(this.data.flat(), d => d.y), d3.max(this.data.flat(), d => d.y)]);
        return this.baseBuild();
    } 
}