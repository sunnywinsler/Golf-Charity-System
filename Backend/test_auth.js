import axios from 'axios';

const testApi = async () => {
  try {
    const ping = await axios.get('http://localhost:5000/api/ping');
    console.log('Ping Success:', ping.data);

    const signup = await axios.post('http://localhost:5000/api/auth/signup', {
      email: 'test' + Math.random() + '@example.com',
      password: 'password123',
      full_name: 'Test User'
    });
    console.log('Signup Success:', signup.data);
  } catch (err) {
    console.error('Error:', err.response?.status, err.response?.data || err.message);
  }
};

testApi();
