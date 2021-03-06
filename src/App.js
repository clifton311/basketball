import { useEffect, useState } from 'react';
import TeamTable from './components/Table';
import TeamsPagination from './components/Pagination';
import { Spinner } from 'react-bootstrap';
import SlidingPanel from 'react-sliding-side-panel';
import { Search, XCircleFill } from 'react-bootstrap-icons';
import 'react-sliding-side-panel/lib/index.css';
import './App.css';


function App() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openPanel, setOpenPanel] = useState(false);

  const [order, setOrder] = useState('ASC');

  const [teamInfo, setTeamInfo] = useState([]);
  const [game, setGame] = useState([]);
  const [totalGames, setTotalGames] = useState(0);

  //state for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [teamsPerPage] = useState(5);

  //state for search
  const [searchTerm, setSearchTerm] = useState('');

  const baseUrl = `https://www.balldontlie.io/api/v1/`;

  const getTeams = async () => {
    setLoading(true);
    const response = await fetch(`${baseUrl}teams`);
    const json = await response.json();
    setLoading(false);
    return json;
  };

  const getTeamInfo = async (id) => {
    const response = await fetch(`${baseUrl}teams/${id}`);
    const json = await response.json();
    return Promise.all([json]).then((values) => {
      return values;
    });
  };

  const getRandomNum = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  };

  const getRandomGame = async (teamID, season = '2021') => {
    const response = await fetch(
      `https://www.balldontlie.io/api/v1/games/?seasons[]=${season}&team_ids[]=${teamID}`
    );
    const json = await response.json();
    return Promise.all([json]).then((games) => {
      setTotalGames(games[0].meta.total_count);

      let randomGame = games[0].data[getRandomNum(1, games[0].data.length)];
      setGame(randomGame);
    });
  };

  useEffect(() => {
    getTeams().then((team) => {
      setTeams(team.data);
    });
  }, []);

  const labels = [
    'Team Name',
    'City',
    'Abbreviation',
    'Conference',
    'Division',
  ];

  const sort = (col) => {
    if (order === 'ASC') {
      const sorted = [...teams].sort((a, b) => (a[col] > b[col] ? 1 : -1));
      setTeams(sorted);
      setOrder('DSC');
    }

    if (order === 'DSC') {
      const sorted = [...teams].sort((a, b) => (a[col] < b[col] ? 1 : -1));
      setTeams(sorted);
      setOrder('ASC');
    }
  };

  const handlePanel = (id) => {
    getTeamInfo(id).then((info) => {
      setTeamInfo(info);
    });

    getRandomGame(id);
    setOpenPanel(!openPanel);
  };

  const handleClearInput = () => {
    setSearchTerm('');
  };

  if (loading)
    return (
      <>
        <h1>Loading...</h1>
        <Spinner animation="border" />;
      </>
    );

  /////////////////// Pagination Logic //////////////

  const indexOfLastTeam = currentPage * teamsPerPage;
  const indexOfFirstTeam = indexOfLastTeam - teamsPerPage;
  const filteredCurrentTeams = teams
    .filter((val) => {
      if (searchTerm === '') {
        return val;
      } else if (
        val.full_name.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return val;
      }
    })
    .slice(indexOfFirstTeam, indexOfLastTeam);


  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="App">
      <h1>NBA TEAMS</h1>
      <div className="searchInputs">
        <input
          id="searchBar"
          type="text"
          placeholder="Search Team..."
          value={searchTerm}
          onChange={(event) => {
            setSearchTerm(event.target.value);
          }}
        />
        <div className="searchIcon">
          {searchTerm === '' ? (
            <Search />
          ) : (
            <XCircleFill
              onClick={handleClearInput}
              styles={{ cursor: 'pointer' }}
            />
          )}
        </div>

        {/* <Button variant="primary" className="btn">
          Search
        </Button> */}
      </div>

      <TeamTable
        teams={filteredCurrentTeams}
        labels={labels}
        handlePanel={handlePanel}
        sort={sort}
      />

      <TeamsPagination
        teamsPerPage={filteredCurrentTeams}
        totalTeams={teams.length}
        paginate={paginate}
        searchTerm={searchTerm}
      />

      {game && (
        <SlidingPanel type={'right'} isOpen={openPanel} size={40}>
          <div className="sliding-panel">
            <div className="sliding-panel-header">
              <h3>{teamInfo[0]?.name} </h3>{' '}
              <div className="x" onClick={() => setOpenPanel(false)}>
                <b>X</b>
              </div>
            </div>
            <div className="game_details">
              <div>Team Full Name: </div>
              <div>{teamInfo && teamInfo[0]?.full_name}</div>
            </div>
            <div className="game_details">
              <div>Total Games in 2021: </div>
              <div>{totalGames}</div>
            </div>

            <h4>Random Game Details:</h4>
            <div className="random_game_details">
              <div>
                Date: <div className="date">{game?.date?.split('T')[0]}</div>
              </div>
              <div>
                Home Team: <div>{game?.home_team?.name}</div>{' '}
              </div>
              <div>
                Home Team Score: <div>{game?.home_team_score}</div>
              </div>
              <div>
                Vistor Team: <div>{game?.visitor_team?.name}</div>
              </div>
              <div>
                Vistor Team Score: <div>{game?.visitor_team_score}</div>
              </div>
            </div>
          </div>
        </SlidingPanel>
      )}
    </div>
  );
}

export default App;
