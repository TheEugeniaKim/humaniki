import React, { useState, useEffect, useRef } from "react";
import { select } from "d3";
import { Row } from "react-bootstrap";
import SingleBarChart from "../Components/SingleBarChart";
import "../App.css";
import "../Sk.css";
import { colors, loadingDiv, QIDs, months } from "../utils";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import NumericLabel from "react-pretty-numbers";
import ErrorDiv from "../Components/ErrorDiv";

function DefaultView({ API }) {
  const svgRef = useRef();
  const [totalMen, setTotalMen] = useState();
  const [totalWomen, setTotalWomen] = useState();
  const [totalOthers, setTotalOthers] = useState();
  const [womenPercent, setWomenPercent] = useState();
  const [total, setTotal] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isErrored, setIsErrored] = useState(false);
  const [snapshotMonth, setSnapshotMonth] = useState();
  const [snapshotYear, setSnapshotYear] = useState();

  const prettyNumParams = {
    shortFormat: true,
    shortFormatMinValue: 1000,
    shortFormatPrecision: 1,
    justification: "C",
  };

  function processFetchData(errors, data) {
    if (errors) {
      setIsErrored(errors);
    } else {
      const total = Object.values(data.metrics[0].values).reduce(
        (a, b) => a + b
      );
      setTotal(total);
      let totalMen = data.metrics[0].values[QIDs.male];
      let totalWomen = data.metrics[0].values[QIDs.female];
      let totalOthers = data.metrics[0].values;
      totalOthers[QIDs.male] = 0;
      totalOthers[QIDs.female] = 0;
      totalOthers = Object.values(totalOthers).reduce((a, b) => a + b);
      setSnapshotMonth(months[data.meta.snapshot.slice(5, 7)]);
      setSnapshotYear(data.meta.snapshot.slice(0, 4));
      setTotalMen(totalMen);
      setTotalWomen(totalWomen);
      setTotalOthers(totalOthers);
      setWomenPercent((totalWomen / total) * 100);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    API.get(
      {
        bias: "gender",
        metric: "gap",
        snapshot: "latest",
        population: "gte_one_sitelink",
        property_obj: null,
      },
      processFetchData
    );

    const svg = select(svgRef.current);

    svg
      .selectAll("rect")
      .data([totalWomen, totalMen, totalOthers])
      .join("rect")
      .attr("fill", function (d, i) {
        return colors[i];
      })
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("x", (value) => value);
  }, [totalMen, totalOthers, totalWomen, API]);

  const viz = (
    <div className="default-data-container">
      <h5> Global Gender Gap </h5>
      <h6> Distribution of content of humans in all Wikimedia Projects </h6>
      <div className="list-gender-gap">
        <div className="col-gender">
          <h4>
            <NumericLabel params={prettyNumParams}>{totalWomen}</NumericLabel>
          </h4>
          <h6> Female Content </h6>
        </div>
        <div className="col-male">
          <h4>
            <NumericLabel params={prettyNumParams}>{totalMen}</NumericLabel>
          </h4>
          <h6> Male Content </h6>
        </div>
        <div className="col-gender">
          <h4>
            <NumericLabel params={prettyNumParams}>{totalOthers}</NumericLabel>
          </h4>
          <h6> Σ Other Genders Content (sum) </h6>
        </div>
      </div>
      <SingleBarChart
        genderTotals={[
          (totalWomen / total) * 100,
          (totalMen / total) * 100,
          (totalOthers / total) * 100,
        ]}
      />
      <p>
        All time, as of {snapshotMonth} {snapshotYear}
      </p>
    </div>
  );

  return (
    <div className="default-main">
      <div className="default">
        <Row className="default-content">
          <h4 className="default-title">
            Humaniki provides statistics about the gender gap in the content of
            all Wikimedia projects
          </h4>
          <h6>
            For example, as of {snapshotMonth ? snapshotMonth : null}{" "}
            {snapshotYear ? snapshotYear : null}, only{" "}
            <NumericLabel>{womenPercent}</NumericLabel>% of content in all
            Wikimedia projects including biographies on Wikipedia are about
            women.
          </h6>
        </Row>
        {isLoading ? loadingDiv : null}
        {isErrored ? <ErrorDiv errors={isErrored} /> : null}
        {!isLoading && !isErrored ? viz : null}
      </div>
      <div className="visualization-collection sub-container">
        <h4> Visualization Collection </h4>
        <h6>
          {" "}
          Humaniki allows you to explore the gender gap by several dimensions:{" "}
        </h6>
        <div className="row-viz-button">
          <Link to={`/gender-by-country`} className="col-button-container">
            <div className="col-button col-worldmap">
              <h5> Gender by Country </h5>
              <h6> What is the spatial distribution of gender data? </h6>
            </div>
          </Link>
          <Link to={`/gender-by-language`} className="col-button-container">
            <div className="col-button col-scatterplot">
              <h5> Gender by Wikimedia Project </h5>
              <h6>
                {" "}
                How do different language Wikimedia projects compare in terms of
                gender diversity?
              </h6>
            </div>
          </Link>
          <Link to={`/gender-by-dob`} className="col-button-container">
            <div className="col-button col-timeseries">
              <h5> Gender by Date of Birth </h5>
              <h6> What is the temporal distribution of gender data? </h6>
            </div>
          </Link>
        </div>
      </div>
      <div className="search sub-container">
        <h4> Search </h4>
        <h6>
          {" "}
          View cumulative gender metrics for different data dimensions at a
          time.{" "}
        </h6>
        <div className="row-search">
          <div className="col-search search-text">
            <p>
              You can mix these three dimensions, for example to gather data
              about the biographies in the German Wikipedia about French people
              born in the 19th century.
            </p>
          </div>
          <div className="col-search search-button">
              <Link to={`/search`}>
                <Button> Search </Button>
              </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DefaultView;
