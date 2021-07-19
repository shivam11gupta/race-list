import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import classes from "./RaceList.css";

const RaceList = () => {
  const [isShowWinner, setIsShowWinner] = useState(false);
  const [renderedTableData, setRenderedTableData] = useState([]);

  const fetchRaceList = () => {
    fetch(`https://ergast.com/api/f1/driverStandings/1.json?offset=55`)
      .then((res) => res.json())
      .then((json) => {
        setIsShowWinner(false);
        setRenderedTableData(prepareRaceList(json));
      });
  };

  const prepareRaceList = (data) => {
    const arr = [];
    data.MRData.StandingsTable.StandingsLists.map((row, index) => {
      arr.push({
        year: row.season,
        winnerName:
          row.DriverStandings[0].Driver.givenName +
          " " +
          row.DriverStandings[0].Driver.familyName,
        points: row.DriverStandings[0].points,
        id: index + 1,
      });
    });
    return arr;
  };

  const prepareWinnerList = (data) => {
    const arr = [];
    data.MRData.RaceTable.Races.map((row, index) => {
      arr.push({
        round: row.round,
        winnerName:
          row.Results[0].Driver.givenName +
          " " +
          row.Results[0].Driver.familyName,
        points: row.Results[0].points,
        id: index + 1,
      });
    });
    return arr;
  };

  const onRowClick = (data) => {
    fetch(`https://ergast.com/api/f1/${data.year}/results/1.json`)
      .then((res) => res.json())
      .then((json) => {
        setIsShowWinner(true);
        setRenderedTableData(prepareWinnerList(json));
      });
  };

  useEffect(() => {
    fetchRaceList();
  }, []);

  const raceListBody = renderedTableData.map((row) => (
    <tr key={row.id} onClick={() => onRowClick(row)}>
      <td>{row.id}</td>
      <td>{row.year}</td>
      <td>{row.winnerName}</td>
      <td>{row.points}</td>
    </tr>
  ));

  const raceWinnerListBody = renderedTableData.map((row) => (
    <tr key={row.id}>
      <td>{row.id}</td>
      <td>{row.round}</td>
      <td>{row.winnerName}</td>
      <td>{row.points}</td>
    </tr>
  ));

  return (
    <div>
      {!isShowWinner && (
        <Table bordered hover responsive variant="dark">
          <thead>
            <tr>
              <th>Sr.No.</th>
              <th>Year</th>
              <th>Winner Name</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>{raceListBody}</tbody>
        </Table>
      )}

      {isShowWinner && (
        <div>
          {/* <div onClick={fetchRaceList} className={classes.back}>
            <span className="glyphicon glyphicon-arrow-left"></span>
            <span>Back to winner list</span>
          </div> */}
          <Table bordered hover responsive variant="light">
            <thead>
              <tr>
                <th>Sr.No.</th>
                <th>Round</th>
                <th>Winner Name</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>{raceWinnerListBody}</tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default RaceList;
