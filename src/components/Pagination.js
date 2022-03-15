import React from 'react';
import './Table.css';

const TeamsPagination = ({
  teamsPerPage,
  totalTeams,
  paginate,
  searchTerm,
}) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalTeams / teamsPerPage.length); i++) {
    pageNumbers.push(i);
  }

  return (
    <div>
      <nav>
        <ul className="pagination">
          {searchTerm === '' &&
            pageNumbers.map((number) => (
              <li key={number} className="page-item">
                <a
                  href="!#"
                  onClick={() => paginate(number)}
                  className="page-link"
                >
                  {number}
                </a>
              </li>
            ))}
          {/* <li class="page-item">
            <a class="page-link" href="#" onClick={() => paginate(number)}>
              Next
            </a>
          </li> */}
        </ul>
      </nav>
    </div>
  );
};

export default TeamsPagination;
