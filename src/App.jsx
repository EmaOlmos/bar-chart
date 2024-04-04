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
      const dates = theData.map((e) => {
        return new Date(e[0]);
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
        .attr("transform", `translate(0, ${height - margin})`)
        .call(d3.axisBottom(x));

      const y = d3.scaleLinear([0, dataMax], [height - margin, 10]); // left axis
      d3.select(svg)
        .append("g")
        .attr("transform", `translate(${margin}, 0)`)
        .call(d3.axisLeft(y));

      d3.select(svg)
        .selectAll("rect")
        .data(theData)
        .join("rect")
        .attr("width", 3)
        .attr("height", (d) => height - margin - y(d[1]))
        .attr("x", (d) => x(new Date(d[0])))
        .attr("y", (d) => y(d[1]))
        .attr("fill", "burlywood")
        .attr("class", "bars");
    }
  }, [theData]);

  return (
    <>
      <div className="allWrapper">
        <div className="svgWrapper">
          <div className="lilWrapper">
            <h1 id="title">Data Bar Chart</h1>
            <svg ref={svgRef}></svg>
            <div className="infoWrapper">
              <h3></h3>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
