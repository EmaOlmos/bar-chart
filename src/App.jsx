import * as d3 from "d3";
import { useEffect, useRef } from "react";

function App() {
  const svgRef = useRef();

  useEffect(() => {
    console.log(svgRef.current);
  }, []);

  return (
    <>
      <svg ref={svgRef}></svg>
    </>
  );
}

export default App;
