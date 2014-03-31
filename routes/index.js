
exports.index = function(req, res){
  res.render('index');
};

/**
 * Server-Sent Events facade
 * @param {Object} options Options for the SSE instance
 */
var SSE = function( options ){
	this.response 	= options.response;
	this.retry		= options.retry || 10000;		

	this.response.set({
		'Content-Type'	: 'text/event-stream',
		'Cache-Control'	: 'no-cache',
		'Connection'	: 'keep-alive'
	});

	return this;
};

/**
 * Convert a Server-Sent Event message to Buffe
 * @param  {Mixed} msg The message to be converted to a buffer (passed to SSE.toStream)
 * @return {Buffer}
 */
SSE.prototype.toBuffer = function( msg ) {
	var id, data, retry, buffer;

	/**
	 * Allow "simple" messages to be sent
	 */
	if (typeof msg === 'string' || typeof msg === 'number') {
		msg = {
			data: msg
		};
	}

	// allow override of the id attribute, or just make one.
	id = msg.id || (new Date()).toLocaleTimeString();

	var streamObject = {
		// inject the SSE instance's retry variable.
		retry: this.retry,
		id: id,
		data: msg.data
	};

	// allow for passing custom events
	if (msg.event) {
		streamObject.event = msg.event;
	};

	buffer = new Buffer(
		// convert the streamObject to a proper stream string
		this.toStream(streamObject)
	);

	return buffer;
};

/**
 * Converts a JSON object to a stream to be output by the server
 * @param  {Object} obj JSON object representing various properties of the stream message
 * @return {String}     The formatted string to be outpout as the Server-Sent Event
 */
SSE.prototype.toStream = function( obj ) {
	var stream = '';
	
	for (var k in obj) {

		// if it's under the data key, and it's an object convert
		// it to a string so it can be JSON.parse-d on the frontend
		if (k === 'data' && typeof obj[k] === 'object') {
			// start the object in the string
			stream += 'data: {\n';

			var json = [];
			for (var p in obj[k]) {
				// add each key of the data object to a line
				json.push('data: "'+ p +'": ' + JSON.stringify(obj[k][p]));
			}

			// join using a "," and a new line to make the JSON valid, as
			// well as making it a valid event message
			stream += json.join(',\n') + '\n';

			// close the data object for the event
			stream += 'data: }\n';

		} else {
			// for all other keys (not "data"), assume it's a string AND
			// should be placed under it's key.
			stream += k + ': ' + obj[k] + '\n';
		}
	}

	// end the stream
	stream += '\n\n';

	// logging
	console.log('\nSSE : toStream ========\n', stream);

	return stream;
};

/**
 * Send data over the SSE instance
 * @param  {Object} data The event to be sent over the wire
 * @return {SSE}     
 */
SSE.prototype.send 	= function(data){

	// write to the internal response object
	// with the provided data.
	this.response.write(
		this.toBuffer(data)
	);

	// allow chaining
	return this;
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