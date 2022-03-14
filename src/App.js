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
  const [games, setGames] = useState([]);

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
      console.log('games', values);
      setGames(values);
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

  return (
    <div className="App">
      <h1>NBA Teams</h1>
      <label>Search Team</label>
      <input type="text"></input>

      <br></br>

      <TeamTable teams={teams} labels={labels} handlePanel={handlePanel} />
      <SlidingPanel type={'right'} isOpen={openPanel} size={40}>
        <div className="sliding-panel">
          <div className="sliding-panel-header">
            <p>Team Name</p>{' '}
            <span>
              <i>X</i>
            </span>
          </div>

          <p>Team Full Name :</p>

          <p>Total Games in 2021: </p>

          <h3>Random Game Details</h3>
          <div className="random_game_details">
            Date: {games[0]?.data && Date.parse(games[0]?.data[getRandomNum(1, 25)].date)}
            <h3>
              Home Team:{' '}
              {games[0]?.data &&
                games[0].data[getRandomNum(1, 25)].home_team.name}
            </h3>
            <h3>
              Home Team Score:{' '}
              {games[0]?.data &&
                games[0]?.data[getRandomNum(1, 25)].home_team_score}
            </h3>
            <h3>
              Vistor Team:{' '}
              {games[0]?.data &&
                games[0].data[getRandomNum(1, 25)].visitor_team.name}
            </h3>
            <h3>
              Vistor Team Score:{' '}
              {games[0].data &&
                games[0].data[getRandomNum(1, 25)].visitor_team_score}
            </h3>
          </div>

          <button onClick={() => setOpenPanel(false)}>Close</button>

          <div className="random-details"></div>
        </div>
      </SlidingPanel>
    </div>
  );
}

export default App;
