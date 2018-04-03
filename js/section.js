/* global TrelloPowerUp */

var t = TrelloPowerUp.iframe();

// you can access arguments passed to your iframe like so
var arg = t.arg('arg');

t.render(function () {
    // make sure your rendering logic lives here, since we will
    // recall this method as the user adds and removes attachments
    // from your section
    t.card('attachments')
        .get('attachments')
        .filter(function (attachment) {
            return attachment.url.indexOf('https://www.youtube.com') == 0;
        })
        .then(function (youtubeAttachments) {
            var urls = youtubeAttachments.map(function (a) {
                // the youtube api will turn the div into an iframe
                return '<div class="video" id="' + getVideoId(a.url) + '"></div>';
            });
            document.getElementById('videos').innerHTML = urls.join(' ');

            // create a youtube player for each video
            new YT.Player('player', {
                videoId: getVideoId(a.url),
                events: {
                    'onStateChange': onPlayerStateChange
                }
            });
        })
        .then(function () {
            return t.sizeTo('#content');
        });
});

function getVideoId(url) {
    return url.replace('https://www.youtube.com/embed/', '');
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        t.modal({
            url: this.attr("src"),
            fullscreen: true
        });
    } else if (event.data == YT.PlayerState.PAUSED || event.data == YT.PlayerState.ENDED) {
        t.closeModal();
    }
}