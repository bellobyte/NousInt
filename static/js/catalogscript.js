// db: catalogdata.js
var isRedPath = false;
if (window.location.pathname.indexOf("red") > -1) {
    isRedPath = true;
}

var isRedBtn = false;
var redBtnElement = document.querySelector(".fullscreen-btn[onclick*='red']");
if (redBtnElement) {
    isRedBtn = true;
}

var catalogState = {
    mode: "blue",
    nav: "categories", 
    cat: null,
    sub: null
};

if (isRedPath || isRedBtn) {
    catalogState.mode = "red";
    document.body.classList.add('red-mode');
}

// Stats Counter Animation
document.addEventListener("DOMContentLoaded", function() {
    var statsContainer = document.getElementById('statsContainer');
    var blueCountEl = document.getElementById('blueCount');
    var redCountEl = document.getElementById('redCount');

    if (!statsContainer || !blueCountEl || !redCountEl) return;

    // Calculate totals
    var totalBlue = 0;
    var totalRed = 0;

    if (typeof db !== 'undefined') {
        // Calculate Blue Tools
        if (db.blue) {
            for (var cat in db.blue) {
                var categoryObj = db.blue[cat];
                for (var sub in categoryObj) {
                    if (sub !== 'meta' && categoryObj[sub].tools) {
                        totalBlue += categoryObj[sub].tools.length;
                    }
                }
            }
        }
        // Calculate Red Tools
        if (db.red) {
            for (var cat in db.red) {
                var categoryObj = db.red[cat];
                for (var sub in categoryObj) {
                     if (sub !== 'meta' && categoryObj[sub].tools) {
                        totalRed += categoryObj[sub].tools.length;
                    }
                }
            }
        }
    }

    // Animation observer
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                statsContainer.classList.add('visible');
                animateValue(blueCountEl, 0, totalBlue, 1500);
                animateValue(redCountEl, 0, totalRed, 1500);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(statsContainer);

    function animateValue(obj, start, end, duration) {
        var startTimestamp = null;
        var step = function(timestamp) {
            if (!startTimestamp) startTimestamp = timestamp;
            var progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
});

// DONT REMOVE TS: formats keys
function formatName(str) {
    var words = str.split("-");
    var finalString = "";
    for (var i = 0; i < words.length; i++) {
        var word = words[i];
        var capitalized = word.charAt(0).toUpperCase() + word.slice(1);
        if (i === 0) {
            finalString = capitalized;
        } else {
            finalString = finalString + " " + capitalized;
        }
    }
    return finalString;
};

function renderCatalog() {

    var filterDiv = document.querySelector(".category-filter");
    var gridDiv = document.querySelector(".tools-grid");

    if (filterDiv == null || gridDiv == null) {
        return;
    }

    var gridHtml = '';
    var currentDb = db[catalogState.mode];

    var breadcrumb = `<button class="breadcrumb-btn" onclick="catalogState.nav='categories'; renderCatalog()">Categories</button>`;

    if (catalogState.cat != null) {
        breadcrumb += ` <span class="breadcrumb-separator">></span> <button class="breadcrumb-btn" onclick="catalogState.nav='subcategories'; renderCatalog()">${formatName(catalogState.cat)}</button>`;
    }

    if (catalogState.sub != null) {
        breadcrumb += ` <span class="breadcrumb-separator">></span> <span class="breadcrumb-current">${formatName(catalogState.sub)}</span>`;
    }
    
    // legend: only when viewing tools
    var legend = '';
    if (catalogState.nav === 'tools') {
        legend = `
            <div class="tool-legend">
                <span class="legend-label">Legend:</span>
                <span class="tool-indicator paid">(P)</span> Paid
                <span class="tool-indicator registration">(R)</span> Registration
                <span class="tool-indicator download">(D)</span> Download
            </div>`;
    }
    
    // show breadcrumbs if not at root
    if (catalogState.nav !== "categories") {
        filterDiv.innerHTML = `<div class="breadcrumb-nav">${breadcrumb}</div>${legend}`;
    } else {
        filterDiv.innerHTML = '';
    }

    if (catalogState.nav === "categories") {

        gridHtml = '<div class="filter-buttons-container">';
        for (var cat in currentDb) {
            var catData = currentDb[cat];
            var desc = "";
            if (catData.meta && catData.meta.desc) {
                desc = catData.meta.desc;
            }
            
            gridHtml += `
                <div class="category-card" onclick="catalogState.cat='${cat}'; catalogState.nav='subcategories'; renderCatalog()">
                    <div class="category-cover"><div class="logo-placeholder"></div></div>
                    <div class="category-content">
                        <div class="category-name">${formatName(cat)}</div>
                        <div class="category-description">${desc}</div>
                    </div>
                </div>`;
        }
        gridHtml += '</div>';

    } 
    else if (catalogState.nav === "subcategories") {

        gridHtml = '<div class="subcategory-grid">';
        var subs = currentDb[catalogState.cat];
        var hasSubs = false;

        for (var sub in subs) {
            if (sub === "meta") {
                continue;
            }

            hasSubs = true;
            var subData = subs[sub];
            var toolCount = 0;
            if (subData.tools) {
                toolCount = subData.tools.length;
            }
            var subDesc = '';
            if (subData.meta && subData.meta.desc) {
                subDesc = subData.meta.desc;
            }

            var subHtml = `
                <div class="subcategory-card" onclick="catalogState.sub='${sub}'; catalogState.nav='tools'; renderCatalog()">
                    <div class="subcategory-name">${formatName(sub)}</div>
                    <div class="subcategory-count">${toolCount} tools</div>`;
            
            if (subDesc !== '') {
                subHtml += `<div class="subcategory-description">${subDesc}</div>`;
            }
            
            subHtml += `</div>`;
            gridHtml += subHtml;
        }
        
        if (hasSubs == false) {
            gridHtml = "<div class='selection-prompt'>No subcategories found.</div>";
        }
        gridHtml += '</div>';

    } 
    else if (catalogState.nav === "tools") {

        gridHtml = '<div class="tool-category-grid">';
        
        var subData = {};
        if (currentDb[catalogState.cat] && currentDb[catalogState.cat][catalogState.sub]) {
            subData = currentDb[catalogState.cat][catalogState.sub];
        } else {
            subData = {};
        }

        var tools = [];
        if (subData.tools) {
            tools = subData.tools;
        } else {
            tools = [];
        }
        
        if (tools.length === 0) {
            gridHtml = gridHtml + "<div style='color:white; padding:20px;'>No tools found in this subcategory.</div>";
        }

        for (const t of tools) {
            // fetch favicons 
            let domain = 'google.com';
            try {
                if (t.url) {
                    const urlObj = new URL(t.url);
                    domain = urlObj.hostname;
                }
            } 
            catch(e) {
                console.error("Invalid URL for tool:", t.name, t.url);
                throw e;
            }

            const iconResult = "https://www.google.com/s2/favicons?domain=" + domain + "&sz=64";
            let indicators = "";

            if (t.meta) {
                if (t.meta.paid) {
                    indicators += "<span class='tool-indicator paid' title='Paid service'>(P)</span>";
                }
                if (t.meta.registration) {
                    indicators += "<span class='tool-indicator registration' title='Registration required'>(R)</span>";
                }
                if (t.meta.download) {
                    indicators += "<span class='tool-indicator download' title='Download only'>(D)</span>";
                }
            }
            
            let tName = t.name;
            if (indicators) {
                tName = tName + ' ' + indicators;
            }

            let tCat = 'General';
            if (t.cat) {
                tCat = t.cat;
            }

            let tDesc = '';
            if (t.desc) {
                tDesc = t.desc;
            }

            gridHtml += `
                <div class="tool-item" onclick="window.open('${t.url}', '_blank')">
                    <div class="tool-name">${tName}</div>
                    <div class="tool-category-badge">${tCat}</div>
                    <div class="tool-description">${tDesc}</div>
                    <img class="tool-logo" src="${iconResult}" onerror="this.style.display='none'" style="width:100%; height:100%; object-fit:contain;">
                </div>`;
        }

        gridHtml = gridHtml + '</div>';
    }

    gridDiv.innerHTML = '<div class="tools-scroll-container">' + gridHtml + '</div>';
}

document.addEventListener("DOMContentLoaded", function() {
    var hasCatalog = document.querySelector(".catalog-preview");
    if (!hasCatalog) {
        hasCatalog = document.querySelector(".catalog-fullscreen");
    }
    
    if (hasCatalog) {
        renderCatalog();
    }
});