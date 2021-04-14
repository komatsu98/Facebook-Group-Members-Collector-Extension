$(document).ready(function(){

    $('#start').click(function(){

        var groups = $('#groups').val().trim();

        if(groups != '') {
                chrome.storage.sync.set({
                    "groups": groups,
                }, function() {
                    console.log("Settings saved");
                });
                
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
                    chrome.tabs.sendMessage(tabs[0].id, {
                        action: "start",
                        tabId: tabs[0].id,
                        groups: groups,
                    })
                })
            
        } else {
            alert('"Keyword" không để trống')
        }
        
    })

    $('#stop').click(function(){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {action: "stop"}, function(response){
                
            })
        })
    })

    $('#clear').click(function(){
        if(confirm("Bạn chắc chắn muốn xóa dữ liệu")) {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
                chrome.tabs.sendMessage(tabs[0].id, {action: "clear"}, function(response){
                    
                })
            })
        }
    })

    $('#continue').click(function(){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {action: "continue"}, function(response){
                
            })
        })
    })

    $('#download').click(function(){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {action: "download"}, function(response){
                
            })
        })
    })

    chrome.storage.sync.get(["groups"], function(items) {
        document.getElementById("groups").value = items["groups"] || "";
    });
})
