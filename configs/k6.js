import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 10,          // number of virtual users
  duration: '90m',  // how long the test should run
};

const FRONTEND_URL = 'http://frontend:3000/';
const TALK_URL = 'http://talk-api:8080/api/';
const SPEAKER_URL = 'http://speaker-api:5000/api/';

const HAPPY_FRONTEND_PATHS = [
    () => '', // home
    () => `talk/${Math.floor(Math.random() * 28) + 1}`, // talk details for talk IDs 1-28
    () => `speaker/${Math.floor(Math.random() * 15) + 1}`, // speaker details for speaker IDs 1-28
]

const UNHAPPY_FRONTEND_PATHS = [
    () => 'nonexistentpage', // 404 page
    () => `talk/${Math.floor(Math.random() * 100) + 29}`, // talk details for non-existing talk IDs
    () => `speaker/${Math.floor(Math.random() * 100) + 29}`, // speaker details for non-existing speaker IDs
]

const HAPPY_TALK_PATHS = [
    () => 'talks', // list talks
    () => `talk/${Math.floor(Math.random() * 28) + 1}`, // talk details for talk IDs 1-28
]

const UNHAPPY_TALK_PATHS = [
    () => 'talks/nonexistent', // invalid endpoint
    () => `talk/${Math.floor(Math.random() * 100) + 29}`, // talk details for non-existing talk IDs
]

const HAPPY_SPEAKER_PATHS = [
    () => 'speakers', // list speakers
    () => `speaker/${Math.floor(Math.random() * 28) + 1}`, // speaker details for speaker IDs 1-28
]

const UNHAPPY_SPEAKER_PATHS = [
    () => 'speakers/nonexistent', // invalid endpoint
    () => `speaker/${Math.floor(Math.random() * 100) + 29}`, // speaker details for non-existing speaker IDs
]

export default function () {

  // Get happy/unhappy scenarios in 8/10 cases
  const is_happy =Math.floor(Math.random() * 10) < 8;

  // Hit all three services once per iteration, with happy/unhappy paths
  if (is_happy) {
    // Frontend
    http.get(`${FRONTEND_URL}${HAPPY_FRONTEND_PATHS[Math.floor(Math.random() * HAPPY_FRONTEND_PATHS.length)]()}`);

    // Talk API accepts GET and POST
    http.get(`${TALK_URL}${HAPPY_TALK_PATHS[Math.floor(Math.random() * HAPPY_TALK_PATHS.length)]()}`);
    http.post(`${TALK_URL}${HAPPY_TALK_PATHS[1]()}`);

    // Speaker API accepts only GET
    http.get(`${SPEAKER_URL}${HAPPY_SPEAKER_PATHS[Math.floor(Math.random() * HAPPY_SPEAKER_PATHS.length)]()}`);
  } else {
    http.get(`${FRONTEND_URL}${UNHAPPY_FRONTEND_PATHS[Math.floor(Math.random() * UNHAPPY_FRONTEND_PATHS.length)]()}`);

    http.get(`${TALK_URL}${UNHAPPY_TALK_PATHS[Math.floor(Math.random() * UNHAPPY_TALK_PATHS.length)]()}`);
    http.post(`${TALK_URL}${UNHAPPY_TALK_PATHS[1]()}`);

    http.get(`${SPEAKER_URL}${UNHAPPY_SPEAKER_PATHS[Math.floor(Math.random() * UNHAPPY_SPEAKER_PATHS.length)]()}`);
  }
  sleep(1); // think-time to avoid hammering unrealistically
}
