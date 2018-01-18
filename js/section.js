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
            return attachment.url.indexOf('youtube.com') == 0;
        })
        .then(function (yellowstoneAttachments) {
            var urls = yellowstoneAttachments.map(function (a) {
                return '<iframe width="560" height="315" src="https://www.youtube.com/embed/7TruhoFdFfg?rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>';
                // really use a.url
            });
            document.getElementById('videos').textContent = urls.join(' ');
        })
        .then(function () {
            return t.sizeTo('#content');
        });
});