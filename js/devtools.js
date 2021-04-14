
function req (type, ...args) {
	try {
		chrome.extension.sendRequest({
			tabId: tabId,
			type: type,
			args: args
		})
	} catch (err) {
		console.error
	}
}


localStorage.setItem("IDs", '')
var tabId

chrome.runtime.onConnect.addListener(function (portFrom) {
	
	if (portFrom.name === 'devtools-content') {
		portFrom.onMessage.addListener(function (message) {
			console.log("portFrom message", message)
			if(message.type == "updateTabId") {
				tabId = parseInt(message.tabId)
			}
			if(message.type == "download") {
				download()
			}
			return true
		});
	}
	return true

});

// Register the callback, which is triggered after every http request response
chrome.devtools.network.onRequestFinished.addListener(async (...args) => {
	try {
		const [{
			request: { method, postData, url },
			getContent,
		}] = args;
		if (!url.includes('api/graphql')) return
		// req('log', method, postData, url);
		let fb_api_req_friendly_name = postData['params'].find(p => p.name == 'fb_api_req_friendly_name').value
		if(fb_api_req_friendly_name != "GroupsCometMembersPageNewMembersSectionRefetchQuery") return
		// req('log', method, postData, url);
		const content = await new Promise((res, rej) => getContent(res));
		if (!content) return req('log', 'no content response');
		// let IDs = content.split('\"category\":').slice(1).filter(c => c.includes("SPONSORED")).map(c => atob(c.split("feedback_id")[1].split(",")[0].replaceAll('"', '').replace(':', '')).split(':')[1]);
		let IDs = content.split('node\":{\"__typename\":\"User\",\"id\":\"').slice(1).map(c => c.split('"')[0])
		req('log', IDs.toString());
		if (!IDs.length) return req('log', 'no IDs')
			// req('log', 'no IDs')
		let arrStr = localStorage.getItem('IDs')
		IDs.forEach(id => {
			if (!arrStr.includes(id)) {
				arrStr += id + ";"
			}
		})
		localStorage.setItem("IDs", arrStr)
	} catch (err) {
		req('log', err.stack || err.toString());
	}
	return true
});

function download() {
	var myString = localStorage.IDs;
	chrome.downloads.download({
	    url: "data:text/plain," + myString,
	    filename: "data.txt",
	    conflictAction: "uniquify", // or "overwrite" / "prompt"
	    saveAs: false, // true gives save-as dialogue
	}, function(downloadId) {
	    console.log("Downloaded item with ID", downloadId);
	});
}
