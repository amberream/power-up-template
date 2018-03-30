/* global TrelloPowerUp */

// we can access Bluebird Promises as follows
var Promise = TrelloPowerUp.Promise;

/*

Trello Data Access

The following methods show all allowed fields, you only need to include those you want.
They all return promises that resolve to an object with the requested fields.

Get information about the current board
t.board('id', 'name', 'url', 'shortLink', 'members')

Get information about the current list (only available when a specific list is in context)
So for example available inside 'attachment-sections' or 'card-badges' but not 'show-settings' or 'board-buttons'
t.list('id', 'name', 'cards')

Get information about all open lists on the current board
t.lists('id', 'name', 'cards')

Get information about the current card (only available when a specific card is in context)
So for example available inside 'attachment-sections' or 'card-badges' but not 'show-settings' or 'board-buttons'
t.card('id', 'name', 'desc', 'due', 'closed', 'cover', 'attachments', 'members', 'labels', 'url', 'shortLink', 'idList')

Get information about all open cards on the current board
t.cards('id', 'name', 'desc', 'due', 'closed', 'cover', 'attachments', 'members', 'labels', 'url', 'shortLink', 'idList')

Get information about the current active Trello member
t.member('id', 'fullName', 'username')

For access to the rest of Trello's data, you'll need to use the RESTful API. This will require you to ask the
user to authorize your Power-Up to access Trello on their behalf. We've included an example of how to
do this in the `🔑 Authorization Capabilities 🗝` section at the bottom.

*/

/*

Storing/Retrieving Your Own Data

Your Power-Up is afforded 4096 chars of space per scope/visibility
The following methods return Promises.

Storing data follows the format: t.set('scope', 'visibility', 'key', 'value')
With the scopes, you can only store data at the 'card' scope when a card is in scope
So for example in the context of 'card-badges' or 'attachment-sections', but not 'board-badges' or 'show-settings'
Also keep in mind storing at the 'organization' scope will only work if the active user is a member of the team

Information that is private to the current user, such as tokens should be stored using 'private' at the 'member' scope

t.set('organization', 'private', 'key', 'value');
t.set('board', 'private', 'key', 'value');
t.set('card', 'private', 'key', 'value');
t.set('member', 'private', 'key', 'value');

Information that should be available to all users of the Power-Up should be stored as 'shared'

t.set('organization', 'shared', 'key', 'value');
t.set('board', 'shared', 'key', 'value');
t.set('card', 'shared', 'key', 'value');
t.set('member', 'shared', 'key', 'value');

If you want to set multiple keys at once you can do that like so

t.set('board', 'shared', { key: value, extra: extraValue });

Reading back your data is as simple as

t.get('organization', 'shared', 'key');

Or want all in scope data at once?

t.getAll();

*/

var YOUTUBE_ICON = './images/yt_icon_rgb.png';
var GRAY_ICON = './images/yt_icon_gray.png';

var youTubeButtonCallback = function (t) {

    return t.popup({
        title: 'YouTube',
        items: function (t, options) {

            // use options.search which is the search text entered so far
            // return a Promise that resolves to an array of items
            // similar to the items you provided in the client side version above
            
            // return an empty result set if nothing is typed into the search box
            if (options.search.trim().length == 0)
            {
                return [];
            }
            
            var response = $.ajax({
                url: "https://www.googleapis.com/youtube/v3/search",
                data: {
                    maxResults: '25',
                    q: options.search,
                    type: 'video',
                    part: 'snippet',
                    key: 'AIzaSyCawso6-SQJS2JAw7FCXQD-sNeLtzDPxE0'
                },
                success: function (data) {
                    //                console.log(data);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert(errorThrown);
                }
            });

            // when the response is finished, then return a list of items
            return response.then(function (data) {
                var ret = new Array();
                var items = data.items;
                for (var i = 0; i < items.length; i++) {
                    ret.push({
                        text: items[i].snippet.title,
                        callback: (function (item) {
                            return function (t, opts) {
                                return t.attach({
                                    name: item.snippet.title, // optional
                                    url: "https://www.youtube.com/embed/" + item.id.videoId // required
                                });
                            }
                        })(items[i])
                    });
                }
                //                console.log(ret);
                return ret;
            });
        },
        search: {
            // optional # of ms to debounce search to
            // defaults to 300, override must be larger than 300
            debounce: 300,
            placeholder: 'Search',
            empty: 'No results',
            searching: 'Searching'
        }
    });

};

// We need to call initialize to get all of our capability handles set up and registered with Trello
TrelloPowerUp.initialize({
    // NOTE about asynchronous responses
    // If you need to make an asynchronous request or action before you can reply to Trello
    // you can return a Promise (bluebird promises are included at TrelloPowerUp.Promise)
    // The Promise should resolve to the object type that is expected to be returned
    'attachment-sections': function (t, options) {
        // options.entries is a list of the attachments for this card
        // you can look through them and 'claim' any that you want to
        // include in your section.

        // we will just claim urls for YouTube
        var claimed = options.entries.filter(function (attachment) {
            // claim youtube urls
            return attachment.url.indexOf('https://www.youtube.com') === 0;
        });

        // you can have more than one attachment section on a card
        // you can group items together into one section, have a section
        // per attachment, or anything in between.
        if (claimed && claimed.length > 0) {
            // if the title for your section requires a network call or other
            // potentially length operation you can provide a function for the title
            // that returns the section title. If you do so, provide a unique id for
            // your section
            return [{
                id: 'YouTube', // optional if you aren't using a function for the title
                claimed: claimed,
                icon: YOUTUBE_ICON,
                title: 'YouTube Videos',
                content: {
                    type: 'iframe',
                    url: t.signUrl('./section.html', {
                        arg: 'you can pass your section args here'
                    })
                }
            }];
        } else {
            return [];
        }
    },
    'card-buttons': function (t, options) {
        return [{
            // YouTube!
            icon: GRAY_ICON,
            text: 'YouTube',
            callback: youTubeButtonCallback
        }];
    }
});

console.log('Loaded by: ' + document.referrer);
