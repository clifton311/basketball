import { useEffect, useState } from 'react';
import TeamTable from './components/Table';
import TeamsPagination from './components/Pagination';
import { Spinner } from 'react-bootstrap';
import SlidingPanel from 'react-sliding-side-panel';
import 'react-sliding-side-panel/lib/index.css';
import './App.css';

const pageSize = 5;

function App() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openPanel, setOpenPanel] = useState(false);

  const [teamInfo, setTeamInfo] = useState([]);
  const [game, setGame] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [teamsPerPage, setTeamsPerPage] = useState(5);

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

  const indexOfLastTeam = currentPage * teamsPerPage;
  const indexOfFirstTeam = indexOfLastTeam - teamsPerPage;
  const currentTeams = teams.slice(indexOfFirstTeam, indexOfLastTeam);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  console.log('teams', currentTeams);
   console.log('teams', indexOfLastTeam);
    console.log('teams', indexOfFirstTeam);

  return (
    <div className="App">
      <h1>NBA Teams</h1>

      <div>
        <label>Search Team</label>
        <input type="text"></input>
      </div>

      <TeamTable
        teams={currentTeams}
        labels={labels}
        handlePanel={handlePanel}
      />

      <TeamsPagination
        teamsPerPage={currentTeams}
        totalTeams={teams.length}
        paginate={paginate}
      />

      {game && (
        <SlidingPanel type={'right'} isOpen={openPanel} size={50}>
          <div className="sliding-panel">
            <div className="sliding-panel-header">
              <h3>{teamInfo[0]?.name} </h3>{' '}
              <div className="x" onClick={() => setOpenPanel(false)}>
                <b>X</b>
              </div>
            </div>

            <p>Team Full Name: {teamInfo && teamInfo[0]?.full_name}</p>

            <p>Total Games in 2021: {game.length}</p>

            <h3>Random Game Details</h3>
            <div className="random_game_details">
              <div className="random_game_items">
                Date: <div>{game?.date?.split('T')[0]}</div>
              </div>
              <div>Home Team: {game?.home_team?.name}</div>
              <div>Home Team Score: {game?.home_team_score}</div>
              <div>Vistor Team: {game?.visitor_team?.name}</div>
              <div>Vistor Team Score: {game?.visitor_team_score}</div>
            </div>

            <div className="random-details"></div>
          </div>
        </SlidingPanel>
      )}
    </div>
  );
}

export default App;
