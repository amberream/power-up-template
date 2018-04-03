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

            var width = $("#content").width() - 30;
            var height = width * .75;
            // create a youtube player for each video
            $(".video").each(function () {
                var player = new YT.Player($(this).attr('id'), {
                    width: width,
                    height: height,
                    videoId: $(this).attr('id'),
                    events: {
                        'onStateChange': onPlayerStateChange
                    }
                });
                player.videoId = $(this).attr('id');
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
        event.target.stopVideo();
        t.modal({
            url: 'https://youtube.com/embed/' + event.target.videoId + '?autoplay=1',
            fullscreen: true
        });
    }
}