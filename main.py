# bello! dont bully my code im still learning gulp
# i appreciate any feedback or suggestions for improvement though! in fact im begging u to help me!
import os
import magic # type: ignore
import re
import markdown # pyright: ignore[reportMissingModuleSource] GODDAMIT

import httpx # pyright: ignore[reportMissingImports]

from fastapi import FastAPI, UploadFile, File, Form, Request, HTTPException # type: ignore
from fastapi.middleware.cors import CORSMiddleware # pyright: ignore[reportMissingImports]
from fastapi.responses import FileResponse, JSONResponse # pyright: ignore[reportMissingImports]
from fastapi.staticfiles import StaticFiles # pyright: ignore[reportMissingImports]
from fastapi.templating import Jinja2Templates # type: ignore

from google import genai
from google.genai import types # pyright: ignore[reportMissingImports]

from dotenv import load_dotenv # type: ignore

from slowapi import Limiter, _rate_limit_exceeded_handler # pyright: ignore[reportMissingImports]
from slowapi.util import get_remote_address # pyright: ignore[reportMissingImports]
from slowapi.errors import RateLimitExceeded     # pyright: ignore[reportMissingImports]
from functools import wraps
import time

# note: overkill? maybe! but i need the prac. also i wanna learn how to do this stuff cus im a chud
from starlette.middleware.base import BaseHTTPMiddleware # pyright: ignore[reportMissingImports]
from pathlib import Path
import bleach # pyright: ignore[reportMissingImports]
from PIL import Image # pyright: ignore[reportMissingImports]
import io

load_dotenv()
app = FastAPI() 

templates = Jinja2Templates(directory="templates")

RIZZ_KEY = os.getenv("RIZZ_KEY") # big G
client = genai.Client(api_key=RIZZ_KEY) if RIZZ_KEY else print("WARNING: API Key missing")

SE_API_USER  = os.getenv("SIGHTENGINE_API_USER")
SE_API_SECRET = os.getenv("SIGHTENGINE_API_SECRET")
HF_API_KEY = os.getenv("HF_API_KEY")
HF_MODEL_URL = "https://router.huggingface.co/hf-inference/models/Organika/sdxl-detector"


limiter = Limiter(key_func=get_remote_address) 
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline'; "
            "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; "
            "img-src 'self' data: blob: https://*.google.com https://t1.gstatic.com https://*.gstatic.com; "
            "font-src 'self' data: blob: https://cdnjs.cloudflare.com; "
            "connect-src 'self'; "
            "frame-ancestors 'none'; "
            "form-action 'self'; "
            "base-uri 'self';"
        )
        return response 

app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://nousint.app"],
    allow_methods=["*"],
    allow_headers=["*"],
)  

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
async def readIndex(): return FileResponse("templates/index.html")

@app.get("/red")
async def readIndexRed():return FileResponse("templates/index-red.html")

@app.get("/scan")
async def readTool(): return FileResponse("templates/scan.html")

@app.get("/catalog")
async def readCatalog(): return FileResponse("templates/catalog.html")

@app.get("/redcatalog") 
async def readRedCatalog(): return FileResponse("templates/redcatalog.html")

@app.get("/about")
async def readAbout(): return FileResponse("templates/about.html")

@app.get("/privacy")
async def readPrivacy(): return FileResponse("templates/privacy.html")

@app.get("/deepscan")
async def readDeepScan():return FileResponse("templates/deepscan.html")
 
# obsidian callouts use [!note] which markdown dont love
# converting to admonitions (!!!) for parser,
def convertObsidianCallouts(content):
    calloutPattern = r'^> \[!(\w+)\](?:\s*(.*))?$\n((?:^>.*$\n?)*)'
    
    def replaceCallout(match):
        calloutType = match.group(1).lower()
        titleLine = match.group(2).strip() if match.group(2) else ""
        contentLines = match.group(3)
        
        contentText = ''
        for line in contentLines.split('\n'):
            if line.startswith('> '):
                contentText += line[2:] + '\n'
            elif line.startswith('>'):
                contentText += line[1:] + '\n'
            else:
                if line.strip(): 
                    contentText += line + '\n'
        
        # [!] -> !!!
        if titleLine:
            result = f'!!! {calloutType} "{titleLine}"\n'
        else:
            result = f'!!! {calloutType}\n'
        
        for line in contentText.strip().split('\n'):
            result += f'    {line}\n'
            
        return result
    
    return re.sub(calloutPattern, replaceCallout, content, flags=re.MULTILINE)

ALLOWED_TAGS = [
    'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'a', 'img', 'table',
    'thead', 'tbody', 'tr', 'th', 'td', 'div', 'span'
]

ALLOWED_ATTRIBUTES = {
    'a': ['href', 'title'],
    'img': ['src', 'alt', 'title'],
    'code': ['class'],
    'div': ['class'],
    'span': ['class'],
    'p': ['class']
}

def parseMarkdownFile(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        metadata = {}
        mdContent = content
        if content.startswith('---'):
            parts = content.split('---', 2)
            if len(parts) >= 3:
                for line in parts[1].strip().split('\n'): 
                    if ':' in line:
                        k, v = line.split(':', 1)
                        # Sanitize metadata values
                        metadata[k.strip()] = bleach.clean(v.strip())
                mdContent = parts[2].strip()
        
        mdContent = convertObsidianCallouts(mdContent)
        
        html = markdown.markdown(mdContent, extensions=[
            'extra', 
            'codehilite',
            'admonition'
        ])
        
        clean_html = bleach.clean(
            html,
            tags=ALLOWED_TAGS,
            attributes=ALLOWED_ATTRIBUTES,
            strip=True
        )
        
        return {
            'metadata': metadata, 
            'html': clean_html
        }
    except Exception as e:
        print(f"Error parsing markdown file: {filepath} - {e}")
        return None

def getAllArticles(): 
    articles = []
    if not os.path.exists("articles"): 
        # print("ARTICLES DIRECTORY MISSING")
        return articles
    
    for filename in os.listdir("articles"):
        if filename.endswith('.md'):
            parsed = parseMarkdownFile(f"articles/{filename}")
            if parsed:
                m = parsed['metadata']
                tags = []
                if m.get('tags'):
                    for t in m.get('tags', '').split(','):
                        tags.append(t.strip())
                articles.append({
                    'id': filename[:-3],
                    'title': m.get('title', filename[:-3]),
                    'description': m.get('description', ''),
                    'date': m.get('date', ''),
                    'author': m.get('author', 'bellobyte'),
                    'tags': tags
                }) 
    return sorted(articles, key=lambda x: x.get('date', ''), reverse=True)

# no db, global cache!
ARTICLE_CACHE = getAllArticles()

@app.get("/articles")  
async def listArticles(request: Request):
    return templates.TemplateResponse("articles.html", {"request": request, "articles": ARTICLE_CACHE})

@app.get("/articles/{articleId}")
async def readArticle(request: Request, articleId: str):
    if not re.match(r'^[a-zA-Z0-9_-]+$', articleId):
        raise HTTPException(status_code=400, detail="Invalid article ID")
    article_path = Path("articles") / f"{articleId}.md" # path traversal
    try:
        article_path = article_path.resolve(strict=True)
        if not str(article_path).startswith(str(Path("articles").resolve())):
            raise HTTPException(status_code=403, detail="Access denied")
    except (OSError, RuntimeError):
        raise HTTPException(status_code=404, detail="Article not found")
    parsed = parseMarkdownFile(str(article_path))
        
    m = parsed['metadata']
    articleData = {
        'id': articleId,
        'title': m.get('title', articleId),
        'description': m.get('description', ''),
        'date': m.get('date', ''),
        'author': m.get('author', 'bellobyte'),
        'tags': [t.strip() for t in m.get('tags', '').split(',')] if m.get('tags') else [],
        'html': parsed['html']
    }
    return templates.TemplateResponse("articleview.html", {"request": request, "article": articleData})

api_cost_tracker = {}

# 500 ops/day free tier, 5 ops per scan = 100 scans max. leave 100 op buffer -> 80 scans/day cap
SE_DAILY_SCAN_LIMIT = 80
se_daily_counter = {"count": 0, "reset": time.time()}

# Gemini 2.5 Flash: 500 req/day free tier, leave 100 buffer -> 400/day cap
GEMINI_DAILY_SCAN_LIMIT = 400
gemini_daily_counter = {"count": 0, "reset": time.time()} 

# HuggingFace: no hard limit but be a good citizen, soft cap at 200/day
HF_DAILY_SCAN_LIMIT = 200
hf_daily_counter = {"count": 0, "reset": time.time()} 

def cost_aware_limit(cost: int):
    # api cost per ip
    def decorator(func):
        @wraps(func)
        async def wrapper(request: Request, *args, **kwargs):
            ip = get_remote_address(request)
            now = time.time()
            
            # kick out expired entries to prevent unbounded memory growth
            expired = [k for k, v in api_cost_tracker.items() if now - v['reset'] > 3600]
            for k in expired:
                del api_cost_tracker[k]

            if ip not in api_cost_tracker:
                api_cost_tracker[ip] = {'cost': 0, 'reset': now}
        
            if api_cost_tracker[ip]['cost'] + cost > 100:
                raise HTTPException(status_code=429, detail="API budget exceeded")
            
            result = await func(request, *args, **kwargs)
            api_cost_tracker[ip]['cost'] += cost
            return result
        return wrapper
    return decorator

# security against burp intruder etc, also just to prevent abuse
MAX_FILE_SIZE = 20 * 1024 * 1024 # 20 MB
ALLOWED_MIME_TYPES = {'image/jpeg', 'image/png'}
ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png'}

@app.post("/scan")
@limiter.limit("5/minute")
async def scanPost(
    request: Request, 
    caption: str = Form(""), 
    image: UploadFile = File(None), 
    toggleThreat: bool = Form(False)
    ):
    
    imageBytes = None
    try:
        if image and image.filename:
            imageBytes = await image.read()
            if len(imageBytes) > MAX_FILE_SIZE:
                raise HTTPException(status_code=413, detail=f"FILE TOO LARGE. Max size: {MAX_FILE_SIZE / (1024 * 1024)}MB")
            
            ext = os.path.splitext(image.filename)[1].lower()
            if ext not in ALLOWED_EXTENSIONS:
                raise HTTPException(status_code=400, detail="INVALID FILE EXTENSION: PNG JPEG ONLY")
            mimeType = magic.from_buffer(imageBytes, mime=True)
            if mimeType not in ALLOWED_MIME_TYPES:
                raise HTTPException(status_code=400, detail="SPOOFED MIME TYPE. INVALID FILE")
            
            try:
                img = Image.open(io.BytesIO(imageBytes))
                img.verify()
                img = Image.open(io.BytesIO(imageBytes))
                saveFmt = "JPEG" if mimeType == "image/jpeg" else "PNG"
                if saveFmt == "JPEG" and img.mode != "RGB":
                    img = img.convert("RGB")
                elif saveFmt == "PNG" and img.mode not in ("RGB", "RGBA", "L"):
                    img = img.convert("RGB")
                reencoded = io.BytesIO()
                img.save(reencoded, format=saveFmt)
                imageBytes = reencoded.getvalue()
            except HTTPException:
                raise
            except Exception:
                raise HTTPException(status_code=400, detail="Invalid or corrupted image")

        # TODO: find a way to make it more aggressive cus ts not very bueno at being a threat actor
        if toggleThreat:
            persona = "Act as an aggressive threat actor and OSINT expert by mapping out potential habits " \
            "from the user's behavior.Check for image metadata, and tell the user exactly what you find."  
        else: "Act as a helpful OSINT privacy expert." 
        contentParts = [f"{persona} Analyze this caption: '{caption}'."]
        if imageBytes:
            contentParts.append(types.Part.from_bytes(data=imageBytes, mime_type=mimeType))
            contentParts.append("Also analyze the attached image for landmarks, street signs, or PII. If you find any PII from the image's metadata or surroundings, include it to let the user know what is exposed.")
            
        contentParts.append("Identify privacy risks and suggest how to fix them: IMPORTANT--Do NOT use markdown, bolding, or headers. Use only plain text.")
        
        response = client.models.generate_content(model="gemini-2.5-flash", contents=contentParts)
        return {"analysis": response.text}
    except Exception as e:
        # print(f"[/scan] BIG G WOULD NEVER: {e}")
        return {"analysis": "The scanner is currently tired :C Try again in a minute."}

# same structure as above but separated ais for more thorough analysis
# also wanted to have fun with different apis heeeeeeeh
DEEPSCAN_ALLOWED_MIME = {'image/jpeg', 'image/png'}
DEEPSCAN_ALLOWED_EXT  = {'.jpg', '.jpeg', '.png'} # no webp because hf doesnt support

async def validateDeepScanUpload(image: UploadFile) -> bytes:
    imageBytes = await image.read()
    if len(imageBytes) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail=f"FILE TOO LARGE. Max {MAX_FILE_SIZE//(1024*1024)}MB")
    ext = os.path.splitext(image.filename)[1].lower()
    if ext not in DEEPSCAN_ALLOWED_EXT:
        raise HTTPException(status_code=400, detail="INVALID EXTENSION: JPEG PNG only")
    mimeType = magic.from_buffer(imageBytes, mime=True)
    if mimeType not in DEEPSCAN_ALLOWED_MIME:
        raise HTTPException(status_code=400, detail="SPOOFED MIME TYPE")
    try:
        img = Image.open(io.BytesIO(imageBytes))
        img.verify()
        img = Image.open(io.BytesIO(imageBytes))
        saveFmt = "JPEG" if mimeType == "image/jpeg" else "PNG"
        if saveFmt == "JPEG" and img.mode != "RGB":
            img = img.convert("RGB")
        elif saveFmt == "PNG" and img.mode not in ("RGB", "RGBA", "L"):
            img = img.convert("RGB")
        reencoded = io.BytesIO()
        img.save(reencoded, format=saveFmt)
        imageBytes = reencoded.getvalue()
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid or corrupted image")
    return imageBytes


@app.post("/deepscan/gemini")
@limiter.limit("3/minute")
@cost_aware_limit(cost=20)
async def deepScanGemini(request: Request, image: UploadFile = File(...)):
    if not RIZZ_KEY:
        return JSONResponse({"error": "Gemini API key not configured"}, status_code=503)

    now_day = time.time()
    if now_day - gemini_daily_counter["reset"] > 86400:
        gemini_daily_counter["count"] = 0
        gemini_daily_counter["reset"] = now_day
    if gemini_daily_counter["count"] >= GEMINI_DAILY_SCAN_LIMIT:
        return JSONResponse({"error": "Daily Gemini limit reached. Try again tomorrow."}, status_code=503)
    gemini_daily_counter["count"] += 1

    try:
        imageBytes = await validateDeepScanUpload(image)
        mimeType   = magic.from_buffer(imageBytes, mime=True)

        prompt = (
            "You are an expert Image Forensics Analyst specializing in detecting generative AI artifacts." 
            "Your goal is to analyze the provided image for technical inconsistencies that indicate synthetic generation. " 
            "You do NOT guess; you look for evidence. Respond in PLAINTEXT, not markdown."
            "Analyze the image across these four distinct layers: "
            "Physics & Lighting: Check for inconsistent shadow directions, impossible reflections, or lighting sources that don't match the subject."
            "Anatomy & Biology: (If humans/animals are present) Check for asymmetry in eyes, malformed hands/fingers, inconsistent teeth, or skin textures that are 'too smooth' (plasticine effect)."
            "Text & Symbology: Check background text, logos, or street signs for 'gibberish' (alien language), blurring, or nonsensical characters."
            "Pixel & Texture Coherence: Look for 'painterly' artifacts in complex textures (hair, grass, fur) where strands blend into a blur. Check corners of the image for warping or blurring that may indicate upscaling, or watermarks."
        )

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[
                types.Part.from_bytes(data=imageBytes, mime_type=mimeType),prompt
            ]
        )

        text = response.text.strip()
        firstLine = text.split('\n')[0].upper()
        isAI = None
        if 'AI-GENERATED' in firstLine or 'SYNTHETIC' in firstLine or 'DEEPFAKE' in firstLine:
            isAI = True
        elif 'AUTHENTIC' in firstLine or 'REAL' in firstLine or 'NOT AI' in firstLine:
            isAI = False

        return {"is_ai_generated": isAI, "analysis": text}
    except HTTPException:
        raise
    except Exception as e:
        # print(f"[deepscan/gemini] BIG G..: {e}")
        return JSONResponse({"error": str(e)}, status_code=500)


@app.post("/deepscan/sightengine")
@limiter.limit("3/minute")
@cost_aware_limit(cost=20)
async def deepScanSightEngine(request: Request, image: UploadFile = File(...)):
    if not SE_API_USER or not SE_API_SECRET:
        return JSONResponse({"error": "SightEngine API credentials not configured"}, status_code=503)

    # global daily cap to stay within free tier (500 ops/day, 5 per scan, 100 op buffer = 80 scans)
    now_day = time.time()
    if now_day - se_daily_counter["reset"] > 86400:
        se_daily_counter["count"] = 0
        se_daily_counter["reset"] = now_day
    if se_daily_counter["count"] >= SE_DAILY_SCAN_LIMIT:
        return JSONResponse({"error": "Daily SightEngine limit reached. Try again tomorrow."}, status_code=503)
    se_daily_counter["count"] += 1

    try:
        imageBytes = await validateDeepScanUpload(image)
        mimeType   = magic.from_buffer(imageBytes, mime=True)
        # https://sightengine.com/docs/ai-generated-image-detection 
        async with httpx.AsyncClient(timeout=45) as hc:
            res = await hc.post(
                "https://api.sightengine.com/1.0/check.json",
                files={
                    "media": (image.filename, imageBytes, mimeType),
                    "models": (None, "genai"),
                    "api_user": (None, SE_API_USER),
                    "api_secret": (None, SE_API_SECRET),
                },
            )

        if res.status_code != 200:
            return JSONResponse({"error": f"SightEngine error {res.status_code}: {res.text[:200]}"}, status_code=502)

        data = res.json()
        import logging; logging.getLogger("uvicorn.error").info(f"SightEngine raw response: {data}")
        if data.get("status") != "success":
            return JSONResponse({"error": f"SightEngine: {data.get('error', {}).get('message', 'unknown error')}"}, status_code=502)

        # genai block only returns {type: {ai_generated: float}} — no not_ai_generated field
        genai_data = data.get("type", {})
        ai_score   = float(genai_data.get("ai_generated", 0.0))
        real_score = round(1.0 - ai_score, 4)

        is_ai = ai_score > 0.5

        return {
            "is_ai_generated": is_ai,
            "ai_score": ai_score,
            "real_score": real_score,
        }
    except HTTPException:
        raise
    except Exception as e:
        # print(f"[deepscan/sightengine] SE REQUEST FAILED: {e}")
        # check SE_API_USER and SE_API_SECRET are correct in .env if this keeps happening
        return JSONResponse({"error": str(e)}, status_code=500)

# HF: 
@app.post("/deepscan/hf")
@limiter.limit("3/minute")
@cost_aware_limit(cost=10)
async def deepScanHuggingFace(request: Request, image: UploadFile = File(...)):
    if not HF_API_KEY:
        return JSONResponse({"error": "HuggingFace API key not configured"}, status_code=503)

    now_day = time.time()
    if now_day - hf_daily_counter["reset"] > 86400:
        hf_daily_counter["count"] = 0
        hf_daily_counter["reset"] = now_day
    if hf_daily_counter["count"] >= HF_DAILY_SCAN_LIMIT:
        return JSONResponse({"error": "Daily HuggingFace limit reached. Try again tomorrow."}, status_code=503)
    hf_daily_counter["count"] += 1

    try:
        imageBytes = await validateDeepScanUpload(image)
        detectedMime = magic.from_buffer(imageBytes, mime=True)

        # HF inference router only accepts image/jpeg or image/png 
        MIME_MAP = {
            "image/jpeg": "image/jpeg",
            "image/jpg":  "image/jpeg",
            "image/png":  "image/png",
        }
        mimeType = MIME_MAP.get(detectedMime, "image/jpeg")

        headers = {
            "Authorization": f"Bearer {HF_API_KEY}",
            "Content-Type": mimeType,
        }

        async with httpx.AsyncClient(timeout=60) as hc:
            res = await hc.post(HF_MODEL_URL, content=imageBytes, headers=headers)

        if res.status_code != 200:
            return JSONResponse({"error": f"HuggingFace error {res.status_code}: {res.text[:200]}"}, status_code=502)

        scores = res.json()  # [{label: str, score: float}]
        return {"scores": scores}
    except HTTPException:
        raise
    except Exception as e:
        # print(f"[deepscan/hf] HUGGING FACE THREW ERROR: {e}")
        return JSONResponse({"error": str(e)}, status_code=500)


if __name__ == "__main__":
    import uvicorn
    # Use PORT environment variable if available (e.g. Heroku), else default to 5000
    port = int(os.environ.get("PORT", 5000))
    uvicorn.run(app, host="0.0.0.0", port=port)