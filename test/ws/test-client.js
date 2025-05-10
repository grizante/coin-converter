const { io } = require('socket.io-client');

const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('Connected to server');

  socket.emit('startRateStream', { from: 'USD', to: 'EUR' });
  socket.on('rateUpdate', (data) => {
    console.log('Rate update:', data);
  });

  socket.emit('startConvertCurrencyStream', {
    from: 'USD',
    to: 'EUR',
    amount: 100,
  });
  socket.on('amountUpdate', (data) => {
    console.log('Converted amount update:', data);
  });

  socket.emit('getTopTenCryptos', { currency: 'USD' }); // You can change currency as needed
  socket.on('cryptosUpdate', (data) => {
    console.log('Top 10 Cryptos Update:', data);
  });
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

socket.on('connect_error', (err) => {
  console.error('Connection error:', err.message);
});
