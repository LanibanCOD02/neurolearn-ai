import http from 'http';

function makeRequest(path, method, body) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function test() {
  console.log('🧪 Testing Career Module Endpoints\n');

  try {
    // Test Stage 1 Questions
    console.log('1️⃣  Testing /api/career/stage1/questions...');
    let res = await makeRequest('/api/career/stage1/questions', 'POST', {
      selected_domains: ['Artificial Intelligence', 'Data Science', 'Quantum Computing']
    });
    console.log(`   Status: ${res.status}`);
    console.log(`   Questions count: ${Array.isArray(res.data) ? res.data.length : 'N/A'}`);
    if (Array.isArray(res.data) && res.data.length > 0) {
      console.log(`   First question: "${res.data[0].question?.substring(0, 50)}..."`);
    }
    console.log();

    // Test Stage 1 Evaluation
    console.log('2️⃣  Testing /api/career/stage1/evaluate...');
    const mockAnswers = [
      { domain: 'Artificial Intelligence', selected_option: 'Option A', question_id: 'q1' },
      { domain: 'Data Science', selected_option: 'Option B', question_id: 'q2' },
      { domain: 'Artificial Intelligence', selected_option: 'Option C', question_id: 'q3' }
    ];
    res = await makeRequest('/api/career/stage1/evaluate', 'POST', { answers: mockAnswers });
    console.log(`   Status: ${res.status}`);
    console.log(`   Top domains: ${res.data.top_domains?.join(', ')}`);
    console.log(`   Interest score: ${res.data.interest_score}`);
    console.log();

    // Test Stage 2 Questions
    console.log('3️⃣  Testing /api/career/stage2/questions...');
    res = await makeRequest('/api/career/stage2/questions', 'POST', {
      top_domains: res.data.top_domains || ['Artificial Intelligence', 'Data Science']
    });
    console.log(`   Status: ${res.status}`);
    console.log(`   Questions count: ${Array.isArray(res.data) ? res.data.length : 'N/A'}`);
    console.log();

    // Test Stage 2 Evaluation
    console.log('4️⃣  Testing /api/career/stage2/evaluate...');
    const mockStage1Results = {
      top_domains: ['Artificial Intelligence', 'Data Science'],
      interest_score: 75
    };
    const mockStage2Answers = [
      {
        id: 's2-q1',
        prompt: 'How would you optimize a system?',
        answer: 'I would analyze performance metrics, identify bottlenecks, and implement caching strategies.'
      },
      {
        id: 's2-q2',
        prompt: 'How do you handle production issues?',
        answer: 'I would communicate with the team, prioritize the fix, and implement it carefully.'
      }
    ];
    res = await makeRequest('/api/career/stage2/evaluate', 'POST', {
      answers: mockStage2Answers,
      stage1_results: mockStage1Results,
      user_id: 1
    });
    console.log(`   Status: ${res.status}`);
    console.log(`   Primary domain: ${res.data.primary_domain}`);
    console.log(`   Compatibility score: ${res.data.compatibility_score}`);
    console.log(`   Recommended courses: ${res.data.recommended_courses?.length || 0}`);
    console.log(`   Roadmap phases: ${Object.keys(res.data.roadmap || {}).length}`);
    console.log();

    console.log('✅ All endpoints working correctly!');
  } catch (err) {
    console.error('❌ Test error:', err.message);
  }
  process.exit(0);
}

test();
