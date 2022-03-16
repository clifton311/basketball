import {
  render,
  screen,
  fireEvent,
  hasInputValue,
} from '@testing-library/react';
import App from './App';
import { setupWorker, rest } from 'msw';
import { setupServer } from 'msw/node';

  const baseUrl = `https://www.balldontlie.io/api/v1/`;



const teamResponse = rest.get(`https://www.balldontlie.io/api/v1/teams`, (req,res,ctx) => {
  return res(
    ctx.json({
      id: 1,
      abbreviation: 'ATL',
      city: 'Atlanta',
      conference: 'East',
      division: 'Southeast',
      full_name: 'Atlanta Hawks',
      name: 'Hawks',
    })
  );
});


const getTeamResponse = rest.get(`${baseUrl}teams/5`, (req, res, ctx) => {
  return res(
    ctx.json({
      id: 5,
      abbreviation: 'CHI',
      city: 'Chicago',
      conference: 'East',
      division: 'Central',
      full_name: 'Chicago Bulls',
      name: 'Bulls',
    })
  );
});



const server = new setupServer();

beforeAll(() => {server.listen();});
afterEach(() => server.resetHandlers());
afterAll(() => {server.close();});

test('fetch teams with a city name of Atlanta', async () => {
  render(<App />);
  const team = await screen.findByText('ATL');
  expect(team).toBeVisible(); 
});


test('fetch team with full_name of Chicago Bulls', async () => {
  render(<App />);
  const bulls = await screen.findByText('Chicago Bulls');
  expect(bulls).toBeVisible();
});
