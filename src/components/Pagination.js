import React from 'react';

const TeamsPagination = ({ teamsPerPage, totalTeams, paginate }) => {
  const pageNumbers = [1,2,3,4];

  console.log('totalTeams', totalTeams)
    console.log('teamsPerPage', teamsPerPage);
  for (let i = 1; i <= Math.ceil(totalTeams/teamsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination">
        {pageNumbers.map((number) => (
          <li key={number} className="page-item">
            <a href="!#" onClick={() => paginate(number)} className="page-link">
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TeamsPagination;
