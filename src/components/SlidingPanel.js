import React from 'react';
import './SlidingPanel.css'

import SlidingPanel from 'react-sliding-side-panel';
import 'react-sliding-side-panel/lib/index.css';

const Panel = ({ openPanel, games, setOpenPanel }) => {




  const getRandomNum = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  };

  const handleOpen = () => {
    setOpenPanel(!openPanel)
  }
  
  let randomGame = games[0]?.data[getRandomNum(1, games[0].data.length)];

  console.log('randomGame', randomGame);


  return (
    <div>
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
            Date:{' '}
            {games[0]?.data &&
              Date.parse(games[0]?.data[getRandomNum(1, 25)].date)}
            <h3>
              Home Team:{' '}
              {games[0]?.data &&
                games[0]?.data[getRandomNum(1, 25)].home_team.name}
            </h3>
            <h3>
              Home Team Score:{' '}
              {games[0]?.data &&
                games[0]?.data[getRandomNum(1, 25)].home_team_score}
            </h3>
            <h3>
              Vistor Team:{' '}
              {games[0]?.data &&
                games[0]?.data[getRandomNum(1, 25)].visitor_team.name}
            </h3>
            <h3>
              Vistor Team Score:{' '}
              {games[0]?.data &&
                games[0]?.data[getRandomNum(1, 25)].visitor_team_score}
            </h3>
          </div>

          <button onClick={() => setOpenPanel(false)}>Close</button>

          <div className="random-details"></div>
        </div>
      </SlidingPanel>
    </div>
  );
};

export default Panel;
