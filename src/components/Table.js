import React from 'react';
import './Table.css'
import { Table } from 'react-bootstrap';

function TeamTable({ teams, labels, handlePanel, sort }) {

  console.log("labels", labels)

  const handleClick = (id) => {
    
   
    handlePanel(id)
  }


  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          {labels.map((label, idx) => {
            return <th key={idx} onClick={() =>sort(label)}>{label}</th>;
          })}
        </tr>
      </thead>
      <tbody>
          {teams && teams.map((team, index) => {
            return (
              <tr key={team.id} onClick={() => handleClick(team.id)}>
                <td>{team.id}</td>
                <td>{team.full_name}</td>
                <td>{team.city}</td>
                <td>{team.abbreviation}</td>
                <td>{team.conference}</td>
                <td>{team.division}</td>
              </tr>
            );
          })}
        
      </tbody>
    </Table>
  );
}

export default TeamTable;
