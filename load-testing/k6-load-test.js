// K6 Load Testing Script
// Install: https://k6.io/docs/getting-started/installation/
// Run: k6 run k6-load-test.js

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');

// Test configuration
export const options = {
  stages: [
    { duration: '1m', target: 10 },   // Ramp up to 10 users
    { duration: '3m', target: 50 },   // Ramp up to 50 users
    { duration: '5m', target: 50 },   // Stay at 50 users
    { duration: '2m', target: 100 },  // Spike to 100 users
    { duration: '2m', target: 0 },    // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    http_req_failed: ['rate<0.05'],   // Error rate must be below 5%
    errors: ['rate<0.1'],             // Custom error rate below 10%
  },
};

const BASE_URL = 'http://localhost:8080';

export default function () {
  // Test 1: Get all items
  let response = http.get(`${BASE_URL}/api/items`);
  check(response, {
    'items list status is 200': (r) => r.status === 200,
    'items list has data': (r) => r.json().length > 0,
  }) || errorRate.add(1);
  
  sleep(1);

  // Test 2: Get categories
  response = http.get(`${BASE_URL}/api/categories`);
  check(response, {
    'categories status is 200': (r) => r.status === 200,
  }) || errorRate.add(1);
  
  sleep(1);

  // Test 3: Get featured items
  response = http.get(`${BASE_URL}/api/items/featured`);
  check(response, {
    'featured items status is 200': (r) => r.status === 200,
  }) || errorRate.add(1);
  
  sleep(2);

  // Test 4: Get specific item
  const itemId = Math.floor(Math.random() * 20) + 1;
  response = http.get(`${BASE_URL}/api/items/${itemId}`);
  check(response, {
    'item detail status is 200 or 500': (r) => r.status === 200 || r.status === 500,
  });
  
  sleep(1);

  // Test 5: Health check
  response = http.get(`${BASE_URL}/actuator/health`);
  check(response, {
    'health check is UP': (r) => r.status === 200 && r.json('status') === 'UP',
  }) || errorRate.add(1);
  
  sleep(2);
}

// Setup function (runs once before test)
export function setup() {
  console.log('Starting load test...');
  const response = http.get(`${BASE_URL}/actuator/health`);
  if (response.status !== 200) {
    throw new Error('Application is not healthy!');
  }
}

// Teardown function (runs once after test)
export function teardown(data) {
  console.log('Load test completed!');
}
