// database for catalog
// structured as: db[mode][category][subcategory].tools = [{name, url, desc, cat, meta:{paid, registration, download}}]
// meta is optional and can include tags such as paid, registration, download, open-source, etc. for future filtering/sorting features
var db = {

    blue: {
        environment: {
            meta: { desc: 'Secure browsers, network layers, and configurations to prevent leaks.' },
            browsers: {
                meta: { desc: 'Privacy-focused browsers designed to minimize tracking and fingerprinting.' },
                tools: [
                { name: 'Tor Browser', url: 'https://www.torproject.org/', cat: 'Browser', desc: 'The standard for anonymous internet browsing.', meta: { download: true } },
                { name: 'Mullvad Browser', url: 'https://mullvad.net/browser', cat: 'Browser', desc: 'Anti-fingerprinting browser developed with Tor Project.', meta: { download: true } },
                { name: 'Firefox', url: 'https://www.mozilla.org/firefox/', cat: 'Browser', desc: 'Open-source foundation for a hardened setup.', meta: { download: true } },
                { name: 'Waterfox', url: 'https://www.waterfox.net/', cat: 'Browser', desc: 'Privacy-focused Firefox fork without telemetry.', meta: { download: true } }
            ]},
            network: {
                meta: { desc: 'VPNs and network tools for secure, anonymous internet access.' },
                tools: [
                { name: 'Mullvad', url: 'https://mullvad.net/', cat: 'VPN', desc: 'Privacy-focused VPN service with anonymous accounts.', meta: { paid: true, registration: true, download: true } },
            ]},
            extensions: {
                meta: { desc: 'Browser add-ons that block trackers, ads, and malicious content.' },
                tools: [
                { name: 'uBlock Origin', url: 'https://addons.mozilla.org/en-US/firefox/addon/ublock-origin/', cat: 'Extension', desc: 'Wide-spectrum content blocker.', meta: { download: true } },
                { name: 'NoScript', url: 'https://addons.mozilla.org/en-US/firefox/addon/noscript/', cat: 'Extension', desc: 'Blocks malicious active content.', meta: { download: true } },
                { name: 'Decentraleyes', url: 'https://addons.mozilla.org/en-US/firefox/addon/decentraleyes/', cat: 'Extension', desc: 'Local CDN emulation to prevent tracking.', meta: { download: true } },
                { name: 'Privacy Badger', url: 'https://addons.mozilla.org/en-US/firefox/addon/privacy-badger17/', cat: 'Extension', desc: 'Heuristic tracker blocker.', meta: { download: true } },
                { name: 'ClearURLs', url: 'https://addons.mozilla.org/en-US/firefox/addon/clearurls/', cat: 'Extension', desc: 'Removes tracking parameters from links.', meta: { download: true } }
            ]},
            'hardening_configs': {
                meta: { desc: 'Configuration templates to maximize browser privacy and security settings.' },
                tools: [
                { name: 'arkenfox user.js', url: 'https://github.com/arkenfox/user.js/', cat: 'Config', desc: 'Comprehensive Firefox privacy template.', meta: { download: true } },
                { name: 'BetterFox', url: 'https://github.com/yokoffing/BetterFox', cat: 'Config', desc: 'Firefox user.js optimized for speed and security.', meta: { download: true } }
            ]}
        },
        // ----------------------------
        'identity-management': {
            meta: { desc: 'Tools to manage credentials and monitor personal data leaks.' },
            credentials: {
                meta: { desc: 'Password managers and multi-factor authentication solutions.' },
                tools: [
                { name: 'Bitwarden', url: 'https://bitwarden.com/', cat: 'Password Manager', desc: 'Open-source encrypted credential vault.', meta: { paid: true, registration: true, download: true } },
                { name: 'Yubico', url: 'https://www.yubico.com/', cat: 'MFA', desc: 'Hardware keys for phishing-resistant auth.', meta: { paid: true } }
            ]},
            'breach-monitoring': {
                meta: { desc: 'Services that check if your data has been exposed in breaches.' },
                tools: [
                { name: 'Have I Been Pwned', url: 'https://haveibeenpwned.com/', cat: 'Breach Check', desc: 'The gold standard for leak checking.' },
                { name: 'Mozilla Monitor', url: 'https://monitor.mozilla.org/en', cat: 'Breach Check', desc: 'Breach alerts powered by HIBP.', meta: { registration: true } },
                { name: 'AmIBreached', url: 'https://amibreached.com/', cat: 'Breach Check', desc: 'Deep-web credential search. Free and paid tiers available.', meta: { registration: true, paid: true } },
                { name: 'IntelTechniques Breaches', url: 'https://inteltechniques.com/tools/Breaches.html', cat: 'Breach Check', desc: 'Bazzell\'s breach search aggregators.' }
            ]},
            'data-removal': {
                meta: { desc: 'Tools to delete accounts and remove personal info from data brokers.' },
                tools: [
                { name: 'JustDeleteMe', url: 'https://justdeleteme.xyz/', cat: 'Privacy', desc: 'Account deletion directory.' },
                { name: 'EasyOptOuts', url: 'https://easyoptouts.com/', cat: 'Privacy', desc: 'Automated data broker removal.', meta: { paid: true, registration: true } },
                { name: 'Whitepages Suppression', url: 'https://www.whitepages.com/suppression-requests', cat: 'Privacy', desc: 'Manual removal from Whitepages.' }
            ]}
        },
        // ----------------------------
        communications: {
            meta: { desc: 'End-to-end encrypted platforms for messaging and file exchange.' },
            email: {
                meta: { desc: 'Secure, encrypted email services that protect your communications.' },
                tools: [
                { name: 'ProtonMail', url: 'https://proton.me/mail', cat: 'Email', desc: 'Swiss-based encrypted email.', meta: { paid: true, registration: true, download: true } }
            ]},
            messaging: {
                meta: { desc: 'Private instant messaging apps with end-to-end encryption.' },
                tools: [
                { name: 'Signal', url: 'https://signal.org/', cat: 'Messaging', desc: 'Industry standard for encrypted IM.', meta: { registration: true, download: true } }
            ]}
        },
        // ----------------------------    
        'testing-and-checklists': {
            meta: { desc: 'Procedures, tools and other resources to verify your anonymity.' },
            checklists: {
                meta: { desc: 'Step-by-step guides and methodologies for improving privacy.' },
                tools: [
                { name: 'IntelTechniques Workbook', url: 'https://inteltechniques.com/workbook.html', cat: 'Methodology', desc: 'Complete privacy workflow.' },
                { name: 'Digital Defense', url: 'https://digital-defense.io/', cat: 'Checklist', desc: 'Security hygiene checklists.' },
                { name: 'Defensive Computing Checklist', url: 'https://defensivecomputingchecklist.com/', cat: 'Checklist', desc: 'System-level security guide.' }
            ]},
            'leak-tests': {
                meta: { desc: 'Tests to identify privacy vulnerabilities and tracking mechanisms.' },
                tools: [
                { name: 'Cover Your Tracks', url: 'https://coveryourtracks.eff.org/', cat: 'Test', desc: 'Browser fingerprinting analyzer.' },
                { name: 'Click Click Click', url: 'https://clickclickclick.click/', cat: 'Demo', desc: 'Behavioral tracking demonstration.' },
                { name: 'Surveillance Watch', url: 'https://www.surveillancewatch.io/', cat: 'Demo', desc: 'Global surveillance industry map.' },
                { name: 'Cloudflare SNI Test', url: 'https://www.cloudflare.com/ssl/encrypted-sni/', cat: 'Test', desc: 'Tests DNS encryption.' },
            ]},
        },
        // ----------------------------
        'threat-feeds': {
            meta: { desc: 'Real-time information on emerging threats and vulnerabilities.' },
            'threat-intel-feeds': {
                meta: { desc: 'Automated data feeds delivering real time threat intelligence such as new threat actors, PoCs, and attack patterns.' },
                tools: [
                { name: 'Wiz Cloud Threat Intel', url: 'https://threats.wiz.io/', cat: 'Feed', desc: 'Curated threat intelligence focused on public cloud environments, CI/CD systems, and source code management systems.', meta: { paid: true, registration: true } },
                { name: 'AlienVault OTX', url: 'https://otx.alienvault.com/', cat: 'Feed', desc: 'Community-driven threat intelligence platform.', meta: { registration: true } },
                { name: 'Open Phish Project', url: 'https://openphish.com/', cat: 'Feed', desc: 'Automated feed of active phishing URLs.', meta: { paid: true } },
                { name: 'CrowdSec Threat Feeds', url: 'https://crowdsec.net/', cat: 'Feed', desc: 'Community-powered IP reputation feeds.', meta: { paid: true, registration: true } },
                { name: 'SANS ISC', url: 'https://isc.sans.edu/', cat: 'Feed', desc: 'Comprehensive threat intelligence and vulnerability data.' },
                { name: 'Cisco Talos', url: 'https://talosintelligence.com/', cat: 'Feed', desc: 'Cisco\'s threat intelligence research division providing detailed analysis and data.' }
            ]
            },
            'general': {
                meta: { desc: 'Aggregated feeds covering a wide range of security topics.' },
                tools: [
                { name: 'Krebs on Security', url: 'https://krebsonsecurity.com/', cat: 'Blog', desc: 'In-depth security journalism.' },
                { name: 'The Hacker News', url: 'https://thehackernews.com/', cat: 'News', desc: 'Latest cybersecurity news and updates.' },
                { name: 'Bleeping Computer', url: 'https://www.bleepingcomputer.com/', cat: 'News', desc: 'Tech news with a focus on security.' }
            ]},
            'vulnerabilities': {
                meta: { desc: 'Databases and feeds focused on software vulnerabilities and exploits.' },
                tools: [
                { name: 'CVE Details', url: 'https://www.cvedetails.com/', cat: 'Vulnerabilities', desc: 'Comprehensive CVE database.' },
                { name: 'Exploit Database', url: 'https://www.exploit-db.com/', cat: 'Exploits', desc: 'Archive of public exploits and vulnerable software.', meta: { download: true } },
                { name: 'NVD', url: 'https://nvd.nist.gov/', cat: 'Vulnerabilities', desc: 'National Vulnerability Database.' }
            ]},
        },
        // ----------------------------
        'other-resources': {
            meta: { desc: 'Additional tools and resources for learning and staying updated.' },
            news: {
                meta: { desc: 'Sources for the latest privacy news and developments.' },
                tools: [
                ]},
            learning: {
                meta: { desc: 'Educational resources to help you improve best practices.' },
                tools: [
                { name: 'Privacy Guides', url: 'https://privacyguides.org/', cat: 'Education', desc: 'Comprehensive privacy resource library.' }
            ]},
            'other-toolboxes': {
                meta: { desc: 'Other curated collections of privacy and security tools.' },
                tools: [
                { name: 'PrivacyTools News', url: 'https://news.privacytools.io/', cat: 'News', desc: 'Curated privacy news aggregator.' },
                { name: 'DeGoogle', url: 'https://git.tycrek.com/archive/degoogle', cat: 'Guide', desc: 'Alternatives to Google ecosystem.' },
                { name: 'The OSINT Toolbox', url: 'https://github.com/The-Osint-Toolbox', cat: 'Resource', desc: 'General OSINT repository.', meta: { download: true } }
            ]},
        },
    },
    // ----------------------------

    red: {
        reconnaissance: {
            meta: { desc: 'Information gathering tools and techniques.' },
            username: {
                meta: { desc: 'Find and analyze usernames across multiple platforms.' },
                tools: [
                { name: 'Sherlock', url: 'https://github.com/sherlock-project/sherlock', cat: 'Username', desc: 'Find usernames across social networks.', meta: { download: true } },
                { name: 'WhatsMyName', url: 'https://whatsmyname.app/', cat: 'Username', desc: 'Username enumeration tool.' },
                { name: 'Maigret', url: 'https://github.com/soxoj/maigret', cat: 'Username', desc: 'Collect a dossier on a person by username.', meta: { download: true } },
                { name: 'Social Analyzer', url: 'https://github.com/qeeqbox/social-analyzer', cat: 'Username', desc: 'API, CLI & Web App for analyzing profiles.', meta: { download: true } },
                { name: 'Name-Seeker', url: 'https://github.com/funnyzak/name-seeker', cat: 'Username', desc: 'Username search tool.', meta: { download: true } },
                { name: 'Snoop', url: 'https://github.com/snoop-project/snoop', cat: 'Username', desc: 'Forensic OSINT tool for searching nicknames.', meta: { download: true } },
                { name: 'Recon-ng', url: 'https://github.com/lanmaster53/recon-ng', cat: 'Username', desc: 'Web Reconnaissance framework.', meta: { download: true } },
                { name: 'SocialPath', url: 'https://github.com/Belane/SocialPath', cat: 'Username', desc: 'Tracks users across social media platforms.', meta: { download: true } }
            ]},
            email: {
                meta: { desc: 'Discover and validate email addresses linked to targets.' },
                tools: [
                { name: 'HaveIBeenPwned', url: 'https://haveibeenpwned.com/', cat: 'Email', desc: 'Check if email has been compromised.' },
                { name: 'Hunter.io', url: 'https://hunter.io/', cat: 'Email', desc: 'Find email addresses for a domain.', meta: { paid: true, registration: true } }
            ]},
            domain: {
                meta: { desc: 'Research domain registration, DNS records, and history.' },
                tools: [
                { name: 'Whois', url: 'https://lookup.icann.org/', cat: 'Domain', desc: 'Lookup domain registration info.' },
                { name: 'theHarvester', url: 'https://github.com/laramies/theHarvester', cat: 'Domain', desc: 'E-mails, subdomains and names Harvester.', meta: { download: true } },
                { name: 'DNSHistory', url: 'https://dnshistory.org/', cat: 'Domain', desc: 'Historical DNS records.' }
            ]},
            'source-code': {
                meta: { desc: 'Search through public source code and website HTML.' },
                tools: [
                { name: 'PublicWWW', url: 'https://publicwww.com/', cat: 'Source Code', desc: 'Source code search engine.', meta: { paid: true, registration: true } },
                { name: 'NerdyData', url: 'https://nerdydata.com/', cat: 'Source Code', desc: "Search the web's source code.", meta: { paid: true, registration: true } },
                { name: 'SearchCode', url: 'https://searchcode.com/', cat: 'Source Code', desc: 'Search over 20 billion lines of code.' },
                { name: 'Grep.app', url: 'https://grep.app/', cat: 'Source Code', desc: 'Search across a half million git repos.' }
            ]},
            network: {
                meta: { desc: 'Scan and map internet-connected infrastructure.' },
                tools: [
                { name: 'Censys', url: 'https://search.censys.io/', cat: 'Network', desc: 'Search engine for internet-connected devices.', meta: { paid: true, registration: true } },
                { name: 'BGP.tools', url: 'https://bgp.tools/', cat: 'Network', desc: 'Real-time BGP data and looking glass.' }
            ]},
            registries: {
                meta: { desc: 'Search government and corporate databases for legal, financial, and asset records.' },
                tools: [
                    { name: 'OpenCorporates', url: 'https://opencorporates.com/', cat: 'Registry', desc: 'The largest open database of companies in the world.', meta: { paid: true, registration: true } },
                    { name: 'Cradle', url: 'https://publicinsights.uk/', cat: 'Registry', desc: 'Aggregated UK public records, electoral rolls, and property data.', meta: { paid: true, registration: true } },
                    { name: 'LittleSis', url: 'https://littlesis.org/', cat: 'Registry', desc: 'Profiling the world’s most powerful people and organizations.', meta: { registration: true } },
                    { name: 'OpenCNAM', url: 'https://www.opencnam.com/', cat: 'Registry', desc: 'Real-time caller ID and carrier routing data for phone numbers.', meta: { paid: true, registration: true } }
                ]
            },
            'recon-frameworks': {
                meta: { desc: 'All-in-one frameworks for large-scale reconnaissance automation.' },
                tools: [
                    { name: 'SpiderFoot', url: 'https://github.com/smicallef/spiderfoot', cat: 'Framework', desc: 'Automates OSINT gathering from 100+ public data sources.', meta: { download: true } },
                    { name: 'Maltego', url: 'https://www.maltego.com/', cat: 'Framework', desc: 'Visual link analysis for mapping complex entity relationships.', meta: { paid: true, registration: true, download: true } }
                ]
            }
        },
        'social-engineering': {
            meta: { desc: 'Tools for testing human vulnerabilities.' },
            phishing: {
                meta: { desc: 'Phishing simulation frameworks for security awareness training.' },
                tools: [
                { name: 'GoPhish', url: 'https://getgophish.com/', cat: 'Phishing', desc: 'Open-Source Phishing Catalog.', meta: { download: true } }
            ]}
        },
        'vulnerability-analysis': {
            meta: { desc: 'Scanning and identifying weaknesses.' },
            scanners: {
                meta: { desc: 'Network and system vulnerability scanning tools.' },
                tools: [
                { name: 'Nmap', url: 'https://nmap.org/', cat: 'Scanner', desc: 'Network Scanner.', meta: { download: true } }
            ]}
        },
        geolocation: {
            meta: { desc: 'Tools for physical location tracking, mapping, and visual OSINT.' },
            tools: [
                { name: 'Creepy', url: 'https://github.com/ilektrojohn/creepy', cat: 'Geolocation', desc: 'Geolocation information aggregator from social media.', meta: { download: true } },
                { name: 'ISeeYou', url: 'https://github.com/Ariel-Rodriguez/ISeeYou', cat: 'Geolocation', desc: 'Social engineering tool for obtaining exact user coordinates.', meta: { download: true } },
                { name: 'OneMillionTweetsMap', url: 'https://onemilliontweetmap.com/', cat: 'Geolocation', desc: 'Real-time map of geolocalized tweets globally.' },
                { name: 'Shodan', url: 'https://www.shodan.io/', cat: 'Network', desc: 'Search engine for IoT devices with precise location data.', meta: { paid: true, registration: true } }
            ]
        }
    }
};