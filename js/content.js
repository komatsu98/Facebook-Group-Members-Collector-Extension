var intervalID;
var intervalID2;
var intervalID3;

// Register callback, triggered when a request is received
localStorage.setItem("IDs", '')

chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {

	if (request.action == 'start') {

		const groups = request.groups.split(',')
		var listURL = []

		groups.map(function (keyword) {
			if (keyword.trim() != '' && keyword.trim() != null && typeof keyword.trim() != 'undefined') {
				listURL.push(`https://facebook.com/groups/${keyword}/members`)
			}
		})
		console.log(request.tabId, listURL)
		sessionStorage.setItem("tabId", request.tabId)
		sessionStorage.setItem("listURL", listURL.toString());
		sessionStorage.setItem("hard_listURL", listURL.toString());
		sessionStorage.setItem("countPostNotFound", 0);
		sessionStorage.setItem("stop", false);
		sessionStorage.setItem("countRequest", 0);
		sessionStorage.setItem("c_user", getCookie('c_user'));
		setCookie("listURL", listURL.toString(), 30)
		setCookie("hard_listURL", listURL.toString(), 30)
		postTabId()
		location.replace(listURL[0])

	} else if (request.action == 'stop') {
		sessionStorage.setItem("stop", true);
		clearInterval(intervalID)
		clearInterval(intervalID2)
		isRunning = false
		console.log('FGMC Extension Stopped !')
		alert('FGMC Extension Stopped !')

	} else if (request.action == 'clear') {
		clearInterval(intervalID)
		clearInterval(intervalID2)
		try {
			sessionStorage.clear();
			alert('Đã clear toàn bộ dữ liệu ! Vui lòng thao tác lại từ đầu !')
		} catch {
			alert('Có chút vấn đề xảy ra ! Vui lòng f5 và thử lại !')
		}

	} else if (request.action == 'continue') {

		sessionStorage.setItem("stop", false);

	} else if (request.action == 'countNoRes') {
		let curCount = parseInt(sessionStorage.getItem("countPostNotFound"))
		curCount++
		sessionStorage.setItem("countPostNotFound", curCount)
		console.log('countNoRes', curCount)
	} else if (request.action == 'clearNoRes') {
		console.log('clearNoRes')
		sessionStorage.setItem("countPostNotFound", 0)
	} else if (request.action = 'download') {
		download()
	}

	return true;

});

var isRunning = false
intervalID3 = setInterval(function() {
	if (!isRunning && sessionStorage.getItem("stop") == 'false') {
		isRunning = true
		scrollStart()
	}
}, 1000)


// Scroll auto
function scrollStart(time = 5, pause = 3, wait = 1000) {

	sessionStorage.setItem("c_user", getCookie('c_user'));
	console.log('FGMC Scrolling !')

	intervalID = setInterval(function () {

		console.log('-------Cookie đang sử dụng: ' + getCookie('c_user'))

		window.scrollTo(0, document.body.scrollHeight)

	}, wait);

}

function postDB() {

	console.log('Send message insert DB')
	chrome.runtime.sendMessage({
		tabId: parseInt(sessionStorage.getItem("tabId")),
		script: `console.log("START INSERT DATABASE");`,
		data: JSON.stringify({
			username: sessionStorage.getItem("username"),
			wait: sessionStorage.getItem("wait"),
			time: sessionStorage.getItem("time"),
			pause: sessionStorage.getItem("pause"),
			url: window.location.href,
			cookie: getCookie('c_user'),
		})
	});
}


function postTabId() {
	chrome.runtime.sendMessage({
		tabId: parseInt(sessionStorage.getItem("tabId")),
		script: `console.log("STORE WORKING TAB ID");`,
		type: "updateTabId"
	});
}

function download() {
	chrome.runtime.sendMessage({
		tabId: parseInt(sessionStorage.getItem("tabId")),
		script: `console.log("DOWNLOAD STORAGE IDs");`,
		type: "download"
	});
}

function setCookie(name,value,days = 1) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(c_name) {
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name) {
            return unescape(y);
        }
    }
}

console.log('content.js')
