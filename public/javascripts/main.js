(function(){
	var source;

	if (!!window.EventSource) {
		source = new EventSource('/stream');
	} else {
		alert('Your browser does not support SSEs. This application will not work.');
		return;
	}

	var el	= document.querySelector('pre.console'),
		log = function(msg, e) {
			console.log(msg, e);
			el.textContent += msg + ':\n' + JSON.stringify(e, null, '\t') +'\n\n';
		}




	source.onopen =  function(e) {
		log('SSE : Connection Opened', e);
	};

	source.onmessage = function(e) {
		var data;

		try {
			data = JSON.parse(e.data);	
		} catch (err) {
			data = e.data;
		}

		log('SSE : Message Received', data);
	};

	source.onerror = function(e) {
		log('SSE : Connection Error', e);
		if (e.readyState === EventSource.CLOSED) {
			log('SSE : Connection Closed');
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

		log('SSE : PING Received', data);
	});

}());