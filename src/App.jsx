import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import "./index.css";

function App() {
  const svgRef = useRef();
  const url =
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
  const svg = svgRef.current;

  const [theData, setTheData] = useState([]);
  const [fetched, setFetched] = useState(false);

  // fetch data
  const fetchData = async (url) => {
    const response = await fetch(url);
    const data = response.json();
    data.then((d) => {
      setTheData(d.data);
    });
  };

  useEffect(() => {
    const height = 400;
    const width = 1000;
    const margin = 50;
    const secondMargin = 30;

    if (!fetched) {
      fetchData(url);
      setFetched(true);
    } else {
      d3.select(svg)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -250)
        .attr("y", 70)
        .text("Gross Domestic Product");

      const tooltip = d3
        .select(".svgWrapper")
        .append("div")
        .attr("id", "tooltip")
        .attr("class", "tooltip")
        .style("opacity", 0);

      const overlay = d3
        .select(".svgWrapper")
        .append("div")
        .attr("class", "overlay")
        .style("opacity", 0);

      const dates = theData.map((e) => {
        return new Date(e[0]);
      });

      const years = theData.map((e) => {
        return e[0].slice(0, 4);
      });

      const gdp = theData.map((e) => {
        return e[1];
      });

      const dataMax = d3.max(theData, (d) => d[1]);

      const yearsMin = d3.min(dates);
      const yearsMax = d3.max(dates);

      // bottom axis
      const x = d3.scaleTime(
        [yearsMin, yearsMax],
        [margin, width - secondMargin]
      );

      d3.select(svg)
        .attr("height", height)
        .attr("width", width)
        .append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(0, ${height - margin})`)
        .call(d3.axisBottom(x));

      // left axis
      const y = d3.scaleLinear([0, dataMax], [height - margin, 10]);
      d3.select(svg)
        .append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(${margin}, 0)`)
        .call(d3.axisLeft(y));

      // create rectangles to represent data
      d3.select(svg)
        .selectAll("rect")
        .data(theData)
        .join("rect")
        .attr("width", width / 275)
        .attr("height", (d) => height - margin - y(d[1]))
        .attr("x", (d) => x(new Date(d[0])))
        .attr("y", (d) => y(d[1]))
        .attr("fill", "burlywood")
        .attr("class", "bar")
        .attr("index", (d, i) => i)
        .on("mouseover", (e, d) => {
          let i = e.currentTarget.getAttribute("index");
          const mouseX = e.pageX;
          const mouseY = e.pageY;

          overlay // overlay for tooltip
            .transition()
            .duration(0)
            .style("height", d + "px")
            .style("width", width / 275 + "px")
            .style("opacity", 0.8)
            .style("left", mouseX + "px")
            .style("top", height - d + "px")
            .style("transform", "translateX(-100px)");

          tooltip.transition().duration(200).style("opacity", 0.8); // tooltip following mouse and displaying data
          tooltip
            .html(years[i] + "<br>" + "$" + gdp[i] + " Billion")
            .attr("data-date", theData[i][0])
            .attr("data-gdp", theData[i][1])
            .style("left", mouseX + 10 + "px")
            .style("top", mouseY - 80 + "px")
            .style("transform", "translateX(-100px)");
        })
        // on mouse out, hide overlay and tooltip
        .on("mouseout", () => {
          tooltip.transition().duration(200).style("opacity", 0);
          overlay.transition().duration(200).style("opacity", 0);
        });
    }
  }, [theData]);

  return (
    <>
      <div className="allWrapper">
        <div className="svgWrapper">
          <div className="lilWrapper">
            <h1 id="title">Data Bar Chart</h1>
            <svg ref={svgRef}></svg>
            <h4 id="link">
              more information at{" "}
              <span>
                <a
                  href="http://www.bea.gov/national/pdf/nipaguid.pdf"
                  target="_blank"
                >
                  http://www.bea.gov/national/pdf/nipaguid.pdf
                </a>
              </span>
            </h4>
            <br />
            <h3>Made By 🍒</h3>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
