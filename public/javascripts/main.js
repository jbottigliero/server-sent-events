(function(){
	var source;

	if (!!window.EventSource) {
		source = new EventSource('/stream');
	} else {
		alert('Your browser does not support SSEs. This application will not work.');
		return;
	}

	source.onopen =  function(e) {
		console.log('SSE : Connection Opened', e);
	};

	source.onmessage = function(e) {
		var data;

		try {
			data = JSON.parse(e.data);	
		} catch (err) {
			data = e.data;
		}

		console.log('SSE : Message Received', data);
	};

	source.onerror = function(e) {
		console.log('SSE : Connection Error', e);
		if (e.readyState === EventSource.CLOSED) {
			console.log('SSE : Connection Closed');
		}
	};

	/**
	 * Custom SSE 'event' listener
	 */
	source.addEventListener('ping', function(e){
		try {
			data = JSON.parse(e.data);
		} catch (err) {
			data = e.data;
		}

		console.log('SSE : PING Received', data);
	});

}());