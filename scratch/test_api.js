const http = require('http');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMDRhYTdhODcyNmY5ZjRhYTY4YjQ0NSIsImlhdCI6MTc3ODk0NDIyNCwiZXhwIjoxNzc4OTQ3ODI0fQ.XLC4PagtcCPgRmf8dvQt85QSTyMQgVOpwkN8VSk1U3g';
const incidentId = '6a04aeacabfe944c249cab9f';

const data = JSON.stringify({ text: 'Test comment from script' });

const options = {
  hostname: 'localhost',
  port: 5000,
  path: `/api/incidents/${incidentId}/comments`,
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let body = '';
  console.log('Response status:', res.statusCode);
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(body);
      console.log('Response data:', JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.log('Raw response:', body);
    }
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
