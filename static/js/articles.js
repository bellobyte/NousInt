function filterArticles(tag) { 
    const cards = document.querySelectorAll(".article-card");
    const filterDiv = document.querySelector(".category-filter");

    // show everything if no tag specified
    if (!tag) {
        for (var i = 0; i < cards.length; i++) {
            cards[i].style.display = "block";
        }
        if (filterDiv) {
            filterDiv.innerHTML = `
                <div class="breadcrumb-nav"> 
                    <span class="breadcrumb-current">All Articles</span>
                </div>`;
        }
        window.location.hash = ''; 
        return; 
    }

    window.location.hash = `tag:${tag}`;
    var matchCount = 0;
 
    for (var i = 0; i < cards.length; i++) { 
        var card = cards[i];
        // can pull from JSON if move to api for articles hehh
        var tagElements = card.querySelectorAll('.article-tag');
        var tags = [];
        for (var j = 0; j < tagElements.length; j++) {
            tags.push(tagElements[j].innerText.trim().toLowerCase());
        }
        
        var found = false;
        for (var k = 0; k < tags.length; k++) {
            if (tags[k] == tag.toLowerCase()) {
                found = true;
                break;
            }
        }

        if (found) {
            card.style.display = 'block';
            matchCount++; 
        } else { 
            card.style.display = "none"; 
        }
    }

    if (filterDiv) {  
        
        filterDiv.innerHTML = `
            <div class="breadcrumb-nav">
                <button class="breadcrumb-btn" onclick="filterArticles('')">All Articles</button>
                <span class="breadcrumb-separator">›</span>
                <span class="breadcrumb-current">Tag: ${tag} (${matchCount})</span>
            </div>
        `;
    }
} 

document.addEventListener('DOMContentLoaded', function() {

    var hash = window.location.hash; 
    if (hash.indexOf('#tag:') === 0) {
        filterArticles(decodeURIComponent(hash.substring(5))); 
    }

    var tagEls = document.querySelectorAll(".article-tag");
    for (var i = 0; i < tagEls.length; i++) {
        (function(tagEl) {
            tagEl.onclick = function(e) {
                e.stopPropagation();
                filterArticles(tagEl.innerText.trim());
            };
        })(tagEls[i]);
    }
});

(function() {
    const urlParams = new URLSearchParams(window.location.search);
    var isRedMode = false;
    if (urlParams.get("mode") === "red") {
        isRedMode = true;
    }
    if (document.referrer.indexOf("/red") > -1) {
        isRedMode = true;
    }

    var articleStyles = document.createElement('style');
    var borderColor = 'rgba(100, 181, 246, 0.4)';
    var subColor = '#64b5f6';
    var tagBg = 'rgba(100, 181, 246, 0.15)';
    var tagBorder = 'rgba(100, 181, 246, 0.3)';
    var tagHoverBg = 'rgba(100, 181, 246, 0.25)';
    var tagHoverBorder = 'rgba(100, 181, 246, 0.5)';
    
    if (isRedMode) {
        borderColor = 'rgba(255, 142, 197, 0.4)';
        subColor = '#ff8ec5';
        tagBg = 'rgba(255, 142, 197, 0.15)';
        tagBorder = 'rgba(255, 142, 197, 0.3)';
        tagHoverBg = 'rgba(255, 142, 197, 0.25)';
        tagHoverBorder = 'rgba(255, 142, 197, 0.5)';
    }

    articleStyles.textContent = `
        .article-card {
            cursor: pointer;
            transition: all 0.3s ease;
            background-color: rgba(122, 143, 160, 0.15);
            border: 1px solid rgba(122, 143, 160, 0.3);
            border-radius: 20px;
            padding: 24px;
            backdrop-filter: blur(10px);
            margin-bottom: 20px;
        }

        .article-card:hover {
            transform: translateY(-4px);
            background-color: rgba(122, 143, 160, 0.2);
            border-color: ${borderColor};
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        }

        .article-card-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 15px;
            margin-bottom: 12px;
        }

        .subcategory-name {
            margin: 0;
            color: ${subColor};
            font-size: 1.2rem;
        }

        .subcategory-count {
            font-size: 0.9rem;
            color: rgba(255, 255, 255, 0.5);
            white-space: nowrap;
        }

        .article-tags-container {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            margin-top: 15px;
        }

        .article-tag {
            padding: 4px 10px;
            background-color: ${tagBg};
            border: 1px solid ${tagBorder};
            border-radius: 12px;
            font-size: 11px;
            color: ${subColor};
            text-transform: uppercase;
            letter-spacing: 0.5px;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .article-tag:hover {
            background-color: ${tagHoverBg};
            border-color: ${tagHoverBorder};
            transform: scale(1.05);
        }
    `;
    document.head.appendChild(articleStyles);

    var backUrl = "/";
    if (isRedMode) {
        backUrl = "/red";
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeButtons);
    } else {
        initializeButtons();
    }

    function initializeButtons() {
        // console.log("Red mode:", isRedMode, "Back URL:", backUrl);

        if (isRedMode) {
            document.body.classList.add("red-mode");
        }

        var backButton = document.getElementById("backButton");
        backButton.onclick = function(e) {
            e.preventDefault();
            window.location.href = backUrl;
        };

        var logoButton = document.getElementById("logoButton");
        logoButton.onclick = function(e) {
            e.preventDefault();
            window.location.href = backUrl;
        };
        }
    }
)();