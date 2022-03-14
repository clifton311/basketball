import { useEffect, useState } from 'react';
import TeamTable from './components/Table';
import { Spinner } from 'react-bootstrap';
import SlidingPanel from 'react-sliding-side-panel';
import 'react-sliding-side-panel/lib/index.css';

import './App.css';

function App() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openPanel, setOpenPanel] = useState(false);

  const [teamInfo, setTeamInfo] = useState([]);
  const [game, setGame] = useState([]);

  const baseUrl = `https://www.balldontlie.io/api/v1/`;

  const getTeams = async () => {
    setLoading(true);
    const response = await fetch(`${baseUrl}/teams`);
    const json = await response.json();
    setLoading(false);
    return json;
  };

  const getTeamInfo = async (id) => {
    const response = await fetch(
      `https://www.balldontlie.io/api/v1/teams/${id}`
    );
    const json = await response.json();
    return Promise.all([json]).then((values) => {
      return values;
    });
  };

  const getRandomNum = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  };

  const getRandomGame = async (teamID, season = '2021') => {
    const response = await fetch(
      `https://www.balldontlie.io/api/v1/games/?seasons[]=${season}&team_ids[]=${teamID}`
    );
    const json = await response.json();
    return Promise.all([json]).then((values) => {
      let randomGame = values[0].data[getRandomNum(1, values[0].data.length)];
      setGame(randomGame);
    });
  };

  useEffect(() => {
    getTeams().then((team) => {
      setTeams(team.data);
    });
  }, []);

  const labels = [
    'ID',
    'Team Name',
    'City, Abbreviation',
    'Conference',
    'Division',
  ];

  const handlePanel = (id) => {
    console.log(id);
    getTeamInfo(id).then((info) => {
      setTeamInfo(info);
    });

    getRandomGame(id);
    setOpenPanel(!openPanel);
  };

  if (loading)
    return (
      <>
        <h1>Loading...</h1>
        <Spinner animation="border" />;
      </>
    );

  console.log('game', game);
  console.log('teamInfo', teamInfo);

  return (
    <div className="App">
      <h1>NBA Teams</h1>
      <label>Search Team</label>
      <input type="text"></input>

      <br></br>

      <TeamTable teams={teams} labels={labels} handlePanel={handlePanel} />
      {/* <SlidingPanel
        openPanel={openPanel}
        game={game}
        setOpenPanel={setOpenPanel}
      /> */}

      {game && (
        <SlidingPanel type={'right'} isOpen={openPanel} size={40}>
          <div className="sliding-panel">
            <div className="sliding-panel-header">
              <h3>{teamInfo[0]?.name} </h3> <div>X</div>
            </div>
            <p>Team Full Name: {teamInfo && teamInfo[0]?.full_name}</p>

            <p>Total Games in 2021: </p>

            <h3>Random Game Details</h3>
            <div className="random_game_details">
              <div>Date: {game?.date}</div>
              <div>Home Team: {game?.home_team?.name}</div>
              <div>Home Team Score: {game?.home_team_score}</div>
              <div>Vistor Team: {game?.visitor_team?.name}</div>
              <div>Vistor Team Score: {game?.visitor_team_score}</div>
            </div>

            <button onClick={() => setOpenPanel(false)}>Close</button>

            <div className="random-details"></div>
          </div>
        </SlidingPanel>
      )}
    </div>
  );
}

export default App;
