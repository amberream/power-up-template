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

                return '<div class="video"><iframe class="video-frame" src="' + a.url + '?rel=0" frameborder="0" allow="autoplay; encrypted-media" sandbox="allow-scripts allow-same-origin allow-presentation" allowfullscreen></iframe></div>';
            });
            document.getElementById('videos').innerHTML = urls.join(' ');
        })
        .then(function () {
            return t.sizeTo('#content');
        });
});

$(".video-frame").onClick(function(){
    
    console.log("modal url:" + this.attr("src"));
    t.modal({
        url: this.attr("src"),
        fullscreen: true
    });
});