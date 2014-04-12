## Server-Sent Events

A basic NodeJS implementation of the [Server-Sent Events](http://www.w3.org/TR/eventsource/) specification.

### Usage

#### Server

See `./routes/index.js` for more in-depth server code (using Express). Including
submitting custom events.

```
	var SSE = require('server-sent-events');

	var routeHandler = function(request, response) {
		
		var sse = new SSE({
			response: response
		});

		sse.send('Hello, world.');

		setTimeout(function(){
			sse.send(100);
		}, 5000);

		sse.send({
			foo: 'bar'
		});
	}
```

#### Client

See `./public/javascripts/main.js` for more in-depth client code. Including
handling custom events.

```
	var route	= '/stream' // the route that the SSE is being sent on
		source	= new EventSource(route);


	source.on('message', function(){
		console.log(arguments);
	});
```


#### Running the built-in demo Express application
`npm install && npm start` 

The server should then be available at [http://localhost:3000](http://localhost:3000)
