// Starfield background effect, randomized
(function() {
    var style = document.createElement('style');
    var stars = [];
    var numStars = 150;

    var isRedMode = false;
    if (document.querySelector("link[href*='redindex.css']") !== null) {
        isRedMode = true;
    }

    var starColor = '177, 218, 250';
    if (isRedMode) {
        starColor = '255, 142, 197';
    }
    
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
            /* Enhance rendering */
            image-rendering: -webkit-optimize-contrast;
            background-position: center;
        }
    `;
    document.head.appendChild(style);
})();

// note: this was the original standalone project built before creating the rest of the site! :3
// SCANNER
var scanBtn = document.getElementById('scanBtn');
var postInput = document.getElementById('postInput');
var imageUpload = document.getElementById('imageUpload');
var fileName = document.getElementById('fileName');
var resultsArea = document.getElementById('resultsArea');
var aiFeedback = document.getElementById('aiFeedback');
var threatSwitch = document.getElementById('threatSwitch');

var ALLOWED_TYPES = ["image/jpeg", "image/png"];
var ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png"];
var MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

function validateFile(file) {
    if (!file) return { valid: true };
    
    var ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    
    var extAllowed = false;
    for (var i = 0; i < ALLOWED_EXTENSIONS.length; i++) {
        if (ALLOWED_EXTENSIONS[i] === ext) {
            extAllowed = true;
            break;
        }
    }
    
    if (!extAllowed) {
        return { valid: false, error: 'Only JPG and PNG files allowed.' };
    }
    
    var typeAllowed = false;
    for (var j = 0; j < ALLOWED_TYPES.length; j++) {
        if (ALLOWED_TYPES[j] === file.type) {
            typeAllowed = true;
            break;
        }
    }

    if (!typeAllowed) {
        return { valid: false, error: 'Invalid file type.' };
    }
    
    if (file.size > MAX_FILE_SIZE) {
        return { valid: false, error: `File too large. Max size: ${MAX_FILE_SIZE / (1024 * 1024)}MB` };
    }
    
    return {  
        valid: true 
    };
} 

function showError(message) {
    if (resultsArea) 
        resultsArea.classList.remove('hidden');
    if (aiFeedback) 
        aiFeedback.innerText = message;
}

if (imageUpload) { 
    imageUpload.addEventListener("change", function() {
        if (this.files && this.files[0]) { 
            var validation = validateFile(this.files[0]); 
            if (!validation.valid) {
                showError(validation.error);
                this.value = '';
                fileName.innerText = '';
                return;
            }
            fileName.innerText = 'Selected: ' + this.files[0].name; 
        } else {
            fileName.innerText = '';
        }
    }); 
}

if (scanBtn) {
    scanBtn.addEventListener('click', async function() {
        var text = document.getElementById("postInput").value;
        var file = document.getElementById("imageUpload").files[0];

        if (!text && !file) {
            showError('Add some content first!');
            return;
        }

        var validation = validateFile(file);
        if (!validation.valid) {
            showError('Unsupported file type. Only JPG and PNG files are allowed.');
            return;
        }

        scanBtn.innerText = 'Analyzing Post...';
        scanBtn.disabled = true;

        var formData = new FormData();
        formData.append("caption", text);
        if (file) formData.append("image", file);
        if (threatSwitch && threatSwitch.checked) formData.append("toggleThreat", true);

        try {
            var response = await fetch('/scan', {
                method: 'POST',
                body: formData
            });

            var data = await response.json();

            if (resultsArea) 
                resultsArea.classList.remove('hidden');
            if (aiFeedback) 
                aiFeedback.innerText = data.analysis;

        } catch (error) {
            showError(error.message || "An error occurred during scanning");
        } finally {
            scanBtn.innerText = "SCAN YOUR POST";
            scanBtn.disabled = false;
        }
    });
}