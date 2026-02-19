(function() {
    var urlParams = new URLSearchParams(window.location.search);
    var isRedMode = false;
    if (urlParams.get('mode') === 'red') {
        isRedMode = true;
    }
    if (document.referrer.indexOf('/red') > -1) {
        isRedMode = true;
    }

    // console.log('Article View - Red Mode:', isRedMode);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        var backBtn = document.getElementById('backToArticlesBtn');
        backBtn.onclick = function(e) {
            e.preventDefault();
            var url = '/articles';
            if (isRedMode) {
                url = '/articles?mode=red';
            }
            window.location.href = url;
        };

        var tags = document.querySelectorAll('.tag');
        for (var i = 0; i < tags.length; i++) {
            var tag = tags[i];
            tag.style.cursor = 'pointer';
            
            (function(t) {
                t.onclick = function(e) {
                    e.preventDefault();
                    var tagText = t.innerText.trim();
                    var baseUrl = '/articles';
                    if (isRedMode) {
                        baseUrl = '/articles?mode=red';
                    }
                    var url = `${baseUrl}#tag:${tagText}`;
                    console.log('Navigating to tag:', url);
                    window.location.href = url;
                };
            })(tag);
        }
    }

    var pathParts = window.location.pathname.split('/');
    var articleId = pathParts[pathParts.length - 1];
    console.log('Loading article:', articleId);
})();
