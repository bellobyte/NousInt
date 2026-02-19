(function() {
    var style = document.createElement('style');
    var stars = [];
    var numStars = 150; 
    var starColor = '177, 218, 250';

    for (var i = 0; i < numStars; i++) {
        var x = Math.floor(Math.random() * 100); 
        var y = Math.floor(Math.random() * 100); 

        var alpha = (0.5 + Math.random() * 0.5).toFixed(2);
        
        var size = '2px 2px';
        if (Math.random() > 0.8) {
            size = '3px 3px';
        }

        stars.push(`radial-gradient(${size} at ${x}% ${y}%, rgba(${starColor}, ${alpha}), rgba(${starColor}, 0))`);
    }

    style.innerHTML = `
        @keyframes star-flicker {
            0% { opacity: 0.5; }
            50% { opacity: 1; }
            100% { opacity: 0.5; }
        }
        
        .starfield::before {
            background-image: ${stars.join(', ')};
            background-size: 100% 100%;
            background-repeat: no-repeat;
            animation: star-flicker 4s infinite ease-in-out;
            image-rendering: -webkit-optimize-contrast;
            background-position: center;
        }
    `;
    document.head.appendChild(style);
})();

var imageUpload = document.getElementById("imageUpload");
var uploadBox = document.getElementById("uploadBox");

var uploadPH = document.getElementById("uploadPlaceholder");
var imagePreview = document.getElementById("imagePreview");
var scanBtn = document.getElementById("scanBtn");
var resultsStatus = document.getElementById("resultsStatus");
var dailyLimitModal = document.getElementById("dailyLimitModal");
var modalCloseBtn = document.getElementById("modalCloseBtn");
var modalMsg = document.getElementById("modalMsg");
 
modalCloseBtn.addEventListener('click', function() {
    dailyLimitModal.classList.add('hidden');
});

var DAILY_LIMIT_MESSAGES = {
    sightengine: "SightEngine",
    gemini: "Gemini",
    hf: "HuggingFace" 
};

var dailyLimitHit = {
    sightengine: false,
    gemini: false,
    hf: false
};

function showDailyLimitModal(modelId) {
    dailyLimitHit[modelId] = true;

    var hitName = DAILY_LIMIT_MESSAGES[modelId];

    var still = [];
    if (!dailyLimitHit.sightengine && modelId !== 'sightengine') still.push('SightEngine');
    if (!dailyLimitHit.gemini && modelId !== 'gemini') still.push('Gemini');
    if (!dailyLimitHit.hf && modelId !== 'hf') still.push('HuggingFace');

    var availableStr = still.length > 0
        ? still.join(' &amp; ') + ' ' + (still.length === 1 ? 'is' : 'are') + ' still available.'
        : 'All models have hit their daily cap.';

    modalMsg.innerHTML = hitName + "'s daily cap has been reached. " + availableStr + " Resets in 24 hours.";
    dailyLimitModal.classList.remove('hidden');
}

imageUpload.addEventListener('change', function() {
    var file = imageUpload.files[0];
    if (file) loadPreview(file);
});

uploadBox.addEventListener('dragover', function(e) {
    e.preventDefault();
    uploadBox.classList.add("drag-over");
});

uploadBox.addEventListener("dragleave", function() {
    uploadBox.classList.remove("drag-over");
});

uploadBox.addEventListener("drop", function(e) {
    e.preventDefault();
    uploadBox.classList.remove('drag-over');
    var file = e.dataTransfer.files[0];
    if (file) {
        imageUpload.files = e.dataTransfer.files;
        loadPreview(file);
    }
});

function loadPreview(file) {
    var reader = new FileReader();
    reader.onload = function(ev) {
        imagePreview.src = ev.target.result;
        imagePreview.classList.remove('hidden');
        uploadBox.classList.add('has-preview');
        uploadPH.classList.add('hidden');
    };
    reader.readAsDataURL(file);
    scanBtn.disabled = false;
    scanBtn.textContent = "SCAN IMAGE";
}

function setSpinner(bodyEl, label) {
    bodyEl.innerHTML = `<div class="spinner-wrap"><div class="spinner"></div><span class="spinner-label">${label}</span></div>`;
}

function setPlaceholder(bodyEl, msg) {
    bodyEl.innerHTML = `<div class="result-placeholder">${msg}</div>`;
}

function setDot(id, state) {
    var dot = document.getElementById("dot-" + id);
    dot.className = "result-status-dot " + state;
}

function setVerdict(id, label, cls) {
    var v = document.getElementById("verdict-" + id);
    v.className = `result-verdict ${cls}`;
    v.textContent = label;
    v.classList.remove("hidden");
}

function clearVerdict(id) {
    var v = document.getElementById("verdict-" + id);
    v.className = "result-verdict hidden";
    v.textContent = '';
}

function setCardState(id, state) {
    var card = document.getElementById("card-" + id);
    card.className = "result-card " + state;
}

scanBtn.addEventListener('click', async function() {
    var file = imageUpload.files[0];
    var useGemini = document.getElementById("useGemini").checked;
    var useSightEngine = document.getElementById("useSightEngine").checked;
    var useHF = document.getElementById("useHuggingFace").checked;

    if (!file) return;
    if (useGemini == false && useSightEngine == false && useHF == false) {
        resultsStatus.textContent = "Select at least one model.";
        return;
    }

    scanBtn.disabled   = true;
    scanBtn.textContent = 'SCANNING...';
    resultsStatus.textContent = 'Running analysis...';

    var modelIds = ["sightengine", "hf", "gemini"];
    for (var i = 0; i < modelIds.length; i++) {
        var id = modelIds[i];
        clearVerdict(id);
        setDot(id, '');
        setCardState(id, '');
    }

    var tasks = [];
    if (useSightEngine)  tasks.push(runSightEngine(file));
    if (useHF)           tasks.push(runHuggingFace(file));
    if (useGemini)       tasks.push(runGemini(file));

    await Promise.allSettled(tasks);

    resultsStatus.textContent = "Analysis complete.";
    scanBtn.disabled   = false;
    scanBtn.textContent = "SCAN AGAIN";
});

async function runGemini(file) {
    var body = document.getElementById('body-gemini');
    var dotId = 'gemini';
    setSpinner(body, 'Analyzing with Gemini...');
    setDot(dotId, 'pulsing');
    setCardState(dotId, 'scanning');

    var fd = new FormData();
    fd.append('image', file);

    try {
        var res = await fetch("/deepscan/gemini", { method: "POST", body: fd });
        var data = await res.json();

        if (res.status === 503 && data.error && data.error.toLowerCase().indexOf('daily') > -1) {
            showDailyLimitModal('gemini');
            setDot(dotId, 'error');
            setCardState(dotId, '');
            setVerdict(dotId, '! DAILY LIMIT', 'verdict-uncertain');
            setPlaceholder(body, 'Daily cap reached. Try again tomorrow.');
            return;
        }

        if (data.error) throw new Error(data.error);

        var isAI = data.is_ai_generated;
        var conf = null;
        if (data.confidence) conf = data.confidence;
        
        var detail   = '';
        if (data.analysis) detail = data.analysis;

        var confStr = '';
        if (conf !== null) {
            confStr = ` (${Math.round(conf * 100)}% confidence)`;
        }

        if (isAI === true) {
            setVerdict(dotId, `⚠ LIKELY AI-GENERATED${confStr}`, 'verdict-flagged');
            setDot(dotId, 'flagged');
            setCardState(dotId, 'done-flagged');
        } else if (isAI === false) {
            setVerdict(dotId, `✓ LIKELY AUTHENTIC${confStr}`, 'verdict-safe');
            setDot(dotId, 'safe');
            setCardState(dotId, 'done-safe');
        } else {
            setVerdict(dotId, '? INCONCLUSIVE', 'verdict-uncertain');
            setDot(dotId, 'error');
            setCardState(dotId, '');
        }

        body.innerHTML = `<div class="result-text">${escHtml(detail)}</div>`;
    } catch (err) {
        setDot(dotId, 'error');
        setCardState(dotId, '');
        setVerdict(dotId, '! ERROR', 'verdict-uncertain');
        body.innerHTML = `<div class="result-text">${escHtml(err.message)}</div>`;
    }
}

async function runSightEngine(file) {
    var body  = document.getElementById("body-sightengine");
    var dotId = "sightengine";
    setSpinner(body, "Analyzing with SightEngine...");
    setDot(dotId, "pulsing");
    setCardState(dotId, "scanning");

    var fd = new FormData();
    fd.append('image', file);

    try {
        var res  = await fetch("/deepscan/sightengine", { method: "POST", body: fd });
        var data = await res.json();

        if (res.status === 503 && data.error && data.error.toLowerCase().indexOf('daily') > -1) {
            showDailyLimitModal('sightengine');
            setDot(dotId, 'error');
            setCardState(dotId, '');
            setVerdict(dotId, '! DAILY LIMIT', 'verdict-uncertain');
            setPlaceholder(body, 'Daily cap reached. Try again tomorrow.');
            return;
        }

        if (data.error) throw new Error(data.error);

        var isAI = false;
        if (data.is_ai_generated) isAI = true;
        
        var aiScore = 0;
        if (data.ai_score) aiScore = data.ai_score;
        
        var realScore = 0;
        if (data.real_score) realScore = data.real_score;

        var aiPct   = Math.round(aiScore   * 100);
        var realPct = Math.round(realScore * 100);

        if (isAI) {
            setVerdict(dotId, `⚠ LIKELY AI-GENERATED (${aiPct}%)`, 'verdict-flagged');
            setDot(dotId, 'flagged');
            setCardState(dotId, 'done-flagged');
        } else {
            setVerdict(dotId, `✓ LIKELY AUTHENTIC (${realPct}%)`, 'verdict-safe');
            setDot(dotId, 'safe');
            setCardState(dotId, 'done-safe');
        }

        var scores = [
            { label: "AI Generated", score: aiScore,   fill: "fill-ai"   },
            { label: "Not AI Generated", score: realScore, fill: "fill-real" },
        ];

        var bars = '<div class="hf-scores">';
        for (var i = 0; i < scores.length; i++) {
            var s = scores[i];
            var pct = Math.round(s.score * 100);
            bars += `
            <div class="hf-score-row">
                <div class="hf-score-label">
                    <span class="hf-score-name">${escHtml(s.label)}</span>
                    <span class="hf-score-val">${pct}%</span>
                </div>
                <div class="hf-score-bar-bg">
                    <div class="hf-score-bar-fill ${s.fill}" style="width:${pct}%"></div>
                </div>
            </div>`;
        }
        bars += '</div>';
        body.innerHTML = bars;
    } catch (err) {
        setDot(dotId, 'error');
        setCardState(dotId, '');
        setVerdict(dotId, '! ERROR', 'verdict-uncertain');
        body.innerHTML = `<div class="result-text">${escHtml(err.message)}</div>`;
    }
}

async function runHuggingFace(file) {
    var body  = document.getElementById("body-hf");
    var dotId = "hf";
    setSpinner(body, "Running SDXL Detector...");
    setDot(dotId, "pulsing");
    setCardState(dotId, "scanning");

    var fd = new FormData();
    fd.append('image', file);

    try {
        var res  = await fetch("/deepscan/hf", { method: "POST", body: fd });
        var data = await res.json();

        if (res.status === 503 && data.error && data.error.toLowerCase().indexOf('daily') > -1) {
            showDailyLimitModal('hf');
            setDot(dotId, 'error');
            setCardState(dotId, '');
            setVerdict(dotId, '! DAILY LIMIT', 'verdict-uncertain');
            setPlaceholder(body, 'Daily cap reached. Try again tomorrow.');
            return;
        }

        if (data.error) throw new Error(data.error);

        var scores = [];
        if (data.scores) scores = data.scores;
        
        var top = { label: '', score: 0 };
        for (var i = 0; i < scores.length; i++) {
            if (scores[i].score > top.score) {
                top = scores[i];
            }
        }

        var isAI = false;
        if (top.label.toLowerCase().indexOf('artificial') > -1) {
            isAI = true;
        } else if (top.label.toLowerCase() === 'ai') {
            isAI = true;
        }

        if (isAI) {
            setVerdict(dotId, `⚠ AI-GENERATED (${Math.round(top.score * 100)}%)`, 'verdict-flagged');
            setDot(dotId, 'flagged');
            setCardState(dotId, 'done-flagged');
        } else {
            setVerdict(dotId, `✓ LIKELY REAL (${Math.round(top.score * 100)}%)`, 'verdict-safe');
            setDot(dotId, 'safe');
            setCardState(dotId, 'done-safe');
        }

        var bars = '<div class="hf-scores">';
        for (var j = 0; j < scores.length; j++) {
            var s = scores[j];
            var pct  = Math.round(s.score * 100);
            var fill = 'fill-real';
            if (s.label.toLowerCase().indexOf('artificial') > -1 || s.label.toLowerCase() === 'ai') {
                fill = 'fill-ai';
            }
            
            bars += `
            <div class="hf-score-row">
                <div class="hf-score-label">
                    <span class="hf-score-name">${escHtml(s.label)}</span>
                    <span class="hf-score-val">${pct}%</span>
                </div>
                <div class="hf-score-bar-bg">
                    <div class="hf-score-bar-fill ${fill}" style="width:${pct}%"></div>
                </div>
            </div>`;
        }
        bars += '</div>';
        body.innerHTML = bars;
    } catch (err) {
        setDot(dotId, 'error');
        setCardState(dotId, '');
        setVerdict(dotId, '! ERROR', 'verdict-uncertain');
        body.innerHTML = `<div class="result-text">${escHtml(err.message)}</div>`;
    }
}

function escHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
