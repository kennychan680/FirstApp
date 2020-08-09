import axios from 'axios';

const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['x-auto-token'] = token;
  } else {
    delete axios.default.headers.common['x-auto-token'];
  
  }
};

export default setAuthToken;
