// imports
const express = require('express');
const morgan = require('morgan');
const middleware = require('./middleware');
const logger = require('./logger');
const config = require('./config');

// setup console colors
require('colors');

// setup express middleware
const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({
	extended: true
}));
app.use('/api/*', middleware.validateSignature);
//app.use(middleware.mongo);

// routes setup
const ROUTES = {
	API: {
		getStreams: require('./routes/api/getStreams'),
	}
};

// page map
app.use(ROUTES.API.getStreams);

// 4 parameters required to read the error, cant help the eslint error
app.use((error, request, response, next) => { // eslint-disable-line no-unused-vars
	logger.log('warn', error.stack);
	return response.status(500).send('Something broke!');
});

// startup
app.listen(config.http.port, () => {
	logger.log('debug', `started the server on port: ${config.http.port}`);
	console.log(`started the server on port: ${new String(config.http.port).green}`);
});
