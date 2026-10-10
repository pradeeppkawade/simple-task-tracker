// Comprehensive API Test Script for Simple Task Tracker
// Uses native Node.js fetch (Node 18+)

const BASE_URL = 'http://localhost:5000/api';

const results = [];
function recordResult(testName, passed, details = '') {
  results.push({ testName, passed, details });
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${status}: ${testName} ${details ? `(${details})` : ''}`);
}

async function runTests() {
  console.log('==============================================');
  console.log('Starting Simple Task Tracker Backend API Tests');
  console.log('==============================================\n');

  const timestamp = Date.now();
  const user1Data = {
    name: 'Alice Tester',
    email: `alice_${timestamp}@test.edu`,
    password: 'password123',
  };

  const user2Data = {
    name: 'Bob Security',
    email: `bob_${timestamp}@test.edu`,
    password: 'password456',
  };

  let user1Token = '';
  let user2Token = '';
  let task1Id = '';

  // 1. Health check
  try {
    const res = await fetch('http://localhost:5000/');
    const data = await res.json();
    recordResult('Root API Health Check', res.status === 200 && data.message.includes('running'));
  } catch (err) {
    recordResult('Root API Health Check', false, err.message);
  }

  // 2. Register User 1
  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user1Data),
    });
    const data = await res.json();
    const passed = res.status === 201 && data.token && data.user.email === user1Data.email && !data.user.password;
    if (passed) user1Token = data.token;
    recordResult('Register User 1', passed, `Status: ${res.status}`);
  } catch (err) {
    recordResult('Register User 1', false, err.message);
  }

  // 3. Reject Duplicate Email Registration (409)
  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user1Data),
    });
    recordResult('Reject Duplicate Email Registration (409)', res.status === 409, `Status: ${res.status}`);
  } catch (err) {
    recordResult('Reject Duplicate Email Registration (409)', false, err.message);
  }

  // 4. Reject Bad Password Login (401)
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user1Data.email, password: 'wrongpassword' }),
    });
    recordResult('Reject Wrong Password Login (401)', res.status === 401, `Status: ${res.status}`);
  } catch (err) {
    recordResult('Reject Wrong Password Login (401)', false, err.message);
  }

  // 5. Successful Login User 1
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user1Data.email, password: user1Data.password }),
    });
    const data = await res.json();
    const passed = res.status === 200 && data.token && !data.user.password;
    if (passed) user1Token = data.token;
    recordResult('Successful User 1 Login', passed, `Status: ${res.status}`);
  } catch (err) {
    recordResult('Successful User 1 Login', false, err.message);
  }

  // 6. Reject Task Creation with Missing Token (401)
  try {
    const res = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Unauthorized Task' }),
    });
    recordResult('Reject Task Creation with Missing Token (401)', res.status === 401, `Status: ${res.status}`);
  } catch (err) {
    recordResult('Reject Task Creation with Missing Token (401)', false, err.message);
  }

  // 7. Reject Task Creation with Invalid Token (401)
  try {
    const res = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer invalid_garbage_token_123',
      },
      body: JSON.stringify({ title: 'Fake Token Task' }),
    });
    recordResult('Reject Task Creation with Invalid Token (401)', res.status === 401, `Status: ${res.status}`);
  } catch (err) {
    recordResult('Reject Task Creation with Invalid Token (401)', false, err.message);
  }

  // 8. Reject Task Creation with Missing Title (400)
  try {
    const res = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user1Token}`,
      },
      body: JSON.stringify({ title: '', priority: 'High' }),
    });
    recordResult('Reject Task Creation with Missing Title (400)', res.status === 400, `Status: ${res.status}`);
  } catch (err) {
    recordResult('Reject Task Creation with Missing Title (400)', false, err.message);
  }

  // 9. Create Task 1 as User 1
  try {
    const res = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user1Token}`,
      },
      body: JSON.stringify({
        title: 'Complete Lab Report 3',
        description: 'Finish questions 1 through 5 for Operating Systems',
        priority: 'High',
        category: 'College',
        dueDate: '2026-10-15',
      }),
    });
    const data = await res.json();
    const passed = res.status === 201 && data._id && data.title === 'Complete Lab Report 3' && data.completed === false;
    if (passed) task1Id = data._id;
    recordResult('Create Task 1 for User 1', passed, `Task ID: ${task1Id}`);
  } catch (err) {
    recordResult('Create Task 1 for User 1', false, err.message);
  }

  // 10. View Tasks as User 1
  try {
    const res = await fetch(`${BASE_URL}/tasks`, {
      headers: { Authorization: `Bearer ${user1Token}` },
    });
    const data = await res.json();
    const passed = res.status === 200 && Array.isArray(data) && data.some((t) => t._id === task1Id);
    recordResult('Fetch Tasks for User 1', passed, `Found ${data.length} tasks`);
  } catch (err) {
    recordResult('Fetch Tasks for User 1', false, err.message);
  }

  // 11. Edit Task 1 (Update title and category)
  try {
    const res = await fetch(`${BASE_URL}/tasks/${task1Id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user1Token}`,
      },
      body: JSON.stringify({
        title: 'Complete Lab Report 3 - Final Draft',
        category: 'College',
      }),
    });
    const data = await res.json();
    const passed = res.status === 200 && data.title === 'Complete Lab Report 3 - Final Draft';
    recordResult('Edit Task 1 as User 1', passed);
  } catch (err) {
    recordResult('Edit Task 1 as User 1', false, err.message);
  }

  // 12. Toggle Task 1 Complete (completed: true)
  try {
    const res = await fetch(`${BASE_URL}/tasks/${task1Id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user1Token}`,
      },
      body: JSON.stringify({ completed: true }),
    });
    const data = await res.json();
    const passed = res.status === 200 && data.completed === true;
    recordResult('Toggle Task 1 Completion to True', passed);
  } catch (err) {
    recordResult('Toggle Task 1 Completion to True', false, err.message);
  }

  // 13. Register and Login User 2
  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user2Data),
    });
    const data = await res.json();
    const passed = res.status === 201 && data.token;
    if (passed) user2Token = data.token;
    recordResult('Register User 2', passed);
  } catch (err) {
    recordResult('Register User 2', false, err.message);
  }

  // 14. PRIVACY CHECK: User 2 cannot see User 1's tasks
  try {
    const res = await fetch(`${BASE_URL}/tasks`, {
      headers: { Authorization: `Bearer ${user2Token}` },
    });
    const data = await res.json();
    const passed = res.status === 200 && Array.isArray(data) && data.length === 0;
    recordResult('Privacy Check: User 2 cannot see User 1 tasks', passed, `User 2 tasks count: ${data.length}`);
  } catch (err) {
    recordResult('Privacy Check: User 2 cannot see User 1 tasks', false, err.message);
  }

  // 15. SECURITY CHECK: User 2 attempting to PUT User 1's task ID is rejected (404)
  try {
    const res = await fetch(`${BASE_URL}/tasks/${task1Id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user2Token}`,
      },
      body: JSON.stringify({ title: 'Hacked by User 2' }),
    });
    recordResult('Security Check: User 2 PUT on User 1 task rejected (404)', res.status === 404, `Status: ${res.status}`);
  } catch (err) {
    recordResult('Security Check: User 2 PUT on User 1 task rejected (404)', false, err.message);
  }

  // 16. SECURITY CHECK: User 2 attempting to DELETE User 1's task ID is rejected (404)
  try {
    const res = await fetch(`${BASE_URL}/tasks/${task1Id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${user2Token}`,
      },
    });
    recordResult('Security Check: User 2 DELETE on User 1 task rejected (404)', res.status === 404, `Status: ${res.status}`);
  } catch (err) {
    recordResult('Security Check: User 2 DELETE on User 1 task rejected (404)', false, err.message);
  }

  // 17. User 1 Deletes Task 1 (200)
  try {
    const res = await fetch(`${BASE_URL}/tasks/${task1Id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${user1Token}`,
      },
    });
    recordResult('User 1 Deletes Their Own Task (200)', res.status === 200);
  } catch (err) {
    recordResult('User 1 Deletes Their Own Task (200)', false, err.message);
  }

  // 18. Verify Task is deleted for User 1
  try {
    const res = await fetch(`${BASE_URL}/tasks`, {
      headers: { Authorization: `Bearer ${user1Token}` },
    });
    const data = await res.json();
    const passed = res.status === 200 && data.length === 0;
    recordResult('Verify User 1 Tasks List is now empty', passed, `Tasks count: ${data.length}`);
  } catch (err) {
    recordResult('Verify User 1 Tasks List is now empty', false, err.message);
  }

  console.log('\n==============================================');
  const allPassed = results.every((r) => r.passed);
  console.log(`Test Summary: ${results.filter((r) => r.passed).length}/${results.length} passed.`);
  if (allPassed) {
    console.log('🎉 ALL BACKEND API TESTS PASSED SUCCESSFULLY!');
  } else {
    console.log('⚠️ Some tests failed. Please review above logs.');
  }
  console.log('==============================================\n');
}

runTests();
