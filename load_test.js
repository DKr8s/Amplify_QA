
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '10s', target: 1000 }, // ramp-up to 1000 users
    { duration: '30s', target: 1000 }, // stay at 1000 users
    { duration: '10s', target: 0 },    // ramp-down to 0 users
  ],
};

export default function () {
  const res = http.get('https://main.dlqmv78ti9l9h.amplifyapp.com');
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  sleep(1);
}
