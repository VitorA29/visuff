'use strict';

class ScatterChart extends BaseChart
{
    constructor (id)
    {
        super(id);
    }

    appendCircles (div)
    {
        div.selectAll('circle')
            .data(this.data)
            .enter()
            .append('circle')
            .attr('cx', d => this.xScale(d.cx))
            .attr('cy', d => this.yScale(d.cy))
            .attr('r' , d => d.r)
            .style('fill', 'rgb(150,150,190)');
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
            
                if (this.xScale(d.cx) >= x0 && this.xScale(d.cx) <= x1 &&
                    this.yScale(d.cy) >= y0 && this.yScale(d.cy) <= y1)
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
        let svg = d3.select('#'+this.id).select('svg');

        svg.selectAll('circle')
            .style("fill", (d, i) =>
            {
                if(currBrush.indexOf(i) >= 0 && crosBrush.indexOf(i) >= 0) return "#fecdca";
                else if(currBrush.indexOf(i) >= 0) return currColor;
                else if(crosBrush.indexOf(i) >= 0) return crossColor
                else return 'rgb(150,150,190)';            
            });
    }

    build ()
    {
        let svg = this.appendSvg();
        let cht = this.appendChartGroup(svg);

        this.xScale = d3.scaleLinear().domain([d3.min(this.data, d => d.cx), d3.max(this.data, d => d.cx)]).range([0,this.width]);
        this.yScale = d3.scaleLinear().domain([d3.min(this.data, d => d.cx), d3.max(this.data, d => d.cx)]).range([this.height,0]);

        this.createAxes(svg);
        this.appendCircles(cht);
        this.addBrush(cht);
        return this;
    } 
}