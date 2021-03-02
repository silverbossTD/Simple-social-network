const uuid          = PubNub.generateUUID();

const pubnub = new PubNub({
    publishKey: 'pub-c-065cc40d-0bd5-48eb-a61f-806c2e5d6bde',
    subscribeKey: 'sub-c-03a6f4d4-7b33-11eb-a834-8e822c855d3f',
    uuid: uuid,
    heartbeatInterval: 30
});

pubnub.subscribe({
    channels: ['chat'],
    withPresence: true
});

pubnub.addListener({
    message: function(event) {
        if (event.message.type == 'chat') {
            $('#chatWindow').append(`<p>${event.message.name}: ${event.message.content}</p>`);
            $("#chatWindow").stop().animate({ scrollTop: $("#chatWindow")[0].scrollHeight}, 1000);
        }
    },
    presence: function(presenceEvent) {
        setCurrentlyActiveUsers(presenceEvent.occupancy);
    }
});

function setCurrentlyActiveUsers(numberOfUsers) {
    $('#onlineUsers').text(`Chat ${numberOfUsers.toString()} users online`);
}
setCurrentlyActiveUsers(1);

$('#chatInput')[0].addEventListener('keydown', (e) => {
    if (e.keyCode === 13 && $('#chatInput').val()) {
        send('chat', 'chat', $('#chatInput').val());
        $('#chatInput').val('');
    }
});

function send(channel, type, content)
{
    pubnub.publish({
        channel: channel,
        message: { "sender": uuid, "type": type, "content": content, "name": $('#userName').text() }
    }, function (status, response) {
        //Handle error here
        if (status.error) {
            console.log("oops, we got an error")
        }
    });
};
