
# NousInt
<img width="1656" height="312" alt="Untitled (530 x 100 px)(2)" src="https://github.com/user-attachments/assets/52578880-c5fe-46ce-a9c9-310b6bf5cf00" />

> Derived from the classical concept of Nous, “intellect and direct awareness,” NousInt is designed to provide clarity within the noise of the web.

**NousInt is a curated catalog of OSINT and OPSEC resources, bringing reconnaissance tools, threat intelligence feeds, and privacy focused playbooks in one organized platform.**

We also have a multi-modal PII scanner, multi _model_ deepfake scanner, and our own articles :D

This is an open source and ongoing project by bellobyte.  
Art Credits: Inko Ojamist  
**Created**: January 2026
**Status**: Initial development done. Now adding more tools, making a video for the placeholder, trying to make tool db easier to manage with markdown, finding new features to add, organizing topics to cover in articles like physical counter surveillance tactics/threat analysis/other stuff. 


### 🌐 **Live Site**: [nousint-cd55bda4eead.herokuapp.com](https://nousint-cd55bda4eead.herokuapp.com/) (soon to be nousint.app c:)

# 📋 Table of Contents

- [Features](#-features)
- [Showcase](#showcase)
- [GWC Challenge](#gwc-challenge)
- [Technical Stack](#technical-stack)
- [Local Development](#local-development-optional)
- [Contributing](#-contributing)
- [Disclaimer](#disclaimer)
- [License](#license)

## ✨ Features

- 🔍 **OSINT Catalog** - Curated collection of reconnaissance and intelligence gathering tools
- 🛡️ **OPSEC Resources** - Privacy-focused tools and defensive security resources
- 🤖 **AI Deepfake Detection** - Multi-model/modal scanning using Gemini AI, SightEngine, and HuggingFace models
- 📝 **Security Articles** - Educational content on OSINT, OPSEC, and AI threats
- 🎨 **Dual Themes** - Blue (defensive) and Red (offensive) interface modes
- 🔒 **Privacy-First** - No data collection, all scans processed in real-time

# Showcase
<img width="1917" height="906" alt="image" src="https://github.com/user-attachments/assets/3bc52713-fa99-4dad-962d-c30329ce1bc7" />
<img width="1845" height="937" alt="image" src="https://github.com/user-attachments/assets/a5c9b6ee-7204-4294-88ef-40f1b3508026" />


<sub> And yes, I used AI to help a lot with advanced topics. It's pretty obvious, and I am not hiding it because I still learned and applied my knowledge from web security courses and programming classes! And who knew that integrating apis and deploying websites wasn't that hard all this time? not me :D </sub>

# 💚 GWC Challenge
This project addresses the GWC **Cybersecurity + AI Challenge** theme:

- **Problem**: AI-generated deepfakes threaten identity and trust, and many social media posts expose user PII which threaten user privacy. There is also lack of OSINT knowledge due to lack of structured knowledge bases.
- **Solution**: Use AI and a catalog of resources to detect and protect against AI-generated threats, from automated OSINT tools to mass surveillance, as well as human threat actors. 
- **Impact**: Empowers users to verify media authenticity before sharing, and protect their privacy through education!

## Technical Stack

- **Backend**: FastAPI, Python 3.11, Uvicorn
- **AI Services**: [Google Gemini 2.5 Flash](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-5-flash), [SightEngine](https://sightengine.com/detect-ai-generated-images), [HuggingFace: Organika/sdxl-detector](https://huggingface.co/Organika/sdxl-detector)
- **Frontend**: Vanilla JavaScript, CSS
- **Content**: Markdown with Obsidian callouts support
- **Security**: File validation, MIME type checking, rate limiting (slowapi)
- **Deployment**: Heroku

## Local Development (Optional)

The site is live at [nousint-cd55bda4eead.herokuapp.com](https://nousint-cd55bda4eead.herokuapp.com/), but if you'd like to run it locally or contribute:

1. Clone the repository:
```bash
git clone https://github.com/bellobyte/NousInt.git
cd NousInt
```

2. Create a virtual environment and install dependencies:
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

3. Set up environment variables:
Create a `.env` file with your API keys:
```env
RIZZ_KEY=your_gemini_api_key
SIGHTENGINE_API_USER=your_sightengine_user
SIGHTENGINE_API_SECRET=your_sightengine_secret
HF_API_KEY=your_huggingface_key
```

4. Run the application:
```bash
python main.py
```

5. Navigate to http://localhost:5000

### 📁 Project Structure

```
NousInt/
├── main.py                 # FastAPI application & routes
├── templates/              # HTML templates (Jinja2)
├── static/
│   ├── css/               # Stylesheets (dual theme support)
│   ├── js/                # Frontend logic, catalog data
│   ├── images/            # Logos
│   └── vendor/            # Font Awesome icons
├── articles/              # Markdown articles
├── requirements.txt       # Python dependencies
└── Procfile              # Heroku deployment config
```

## 🤝 Contributing

Contributions are welcome! Whether it's:
- Adding new tools
- Writing articles
- Improving security
- Fixing bugs or improving UI/UX
- Suggesting features

Feel free to open an issue, post a discussion, or submit a pull request!

## Disclaimer

This project catalogs security tools for educational and research purposes. Many of these tools can be used for both defensive security (protecting systems) and offensive security (penetration testing).

**Users are responsible for ensuring their use of any cataloged tools complies with applicable laws and regulations.** Unauthorized access to computer systems is illegal under laws including the Computer Fraud and Abuse Act ([CFAA](https://www.justice.gov/jm/jm-9-48000-computer-fraud)) and similar statutes worldwide. This catalog is not intended to promote or facilitate illegal activity.

Tools are provided for reference only. Use at your own risk and responsibility.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

