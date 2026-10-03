const http = require('http');

const csrfReq = http.request('http://localhost:3000/api/v1/auth/csrf', { method: 'GET' }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const token = JSON.parse(data).token;
    const cookie = res.headers['set-cookie'] ? res.headers['set-cookie'][0].split(';')[0] : '';
    
    const body = JSON.stringify({ business_name: 'Test', email: 'test1@test.com', password: 'Password123!' });
    
    const req = http.request('http://localhost:3000/api/v1/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': token,
        'Cookie': cookie
      }
    }, res2 => {
      console.log('Status:', res2.statusCode);
      let data2 = '';
      res2.on('data', d => data2 += d);
      res2.on('end', () => console.log('Body:', data2));
    });
    req.write(body);
    req.end();
  });
});
csrfReq.end();
