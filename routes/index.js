var SSE = require('../utils/SSE');

exports.index = function(req, res){
  res.render('index');
};

/**
 * Server-Sent Events Stream Endpoint
 * http://dev.w3.org/html5/eventsource/
 */
exports.stream = function(req, res){
	var sse = new SSE({
		response: res
	});

	sse.send('Hello, World');

	sse.send(100);

	sse.send({
		data: {
			string: 'world',
			'int': 1,
			obj: {
				foo: 'bar'
			}
		}
	});

	sse.send({
		'event': 'ping',
		data: {
			message: 'Hello, world!'
		}
	})

};