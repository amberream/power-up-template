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
                return '<div><iframe src="' + a.url + '?rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe></div>';
            });
            document.getElementById('videos').innerHTML = urls.join(' ');
        })
        .then(function () {
            return t.sizeTo('#content');
        });
});