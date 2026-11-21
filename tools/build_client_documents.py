"""Rebuild the bilingual static pages and editable RTF files from tools/client-documents/*.md."""
from html import escape
from pathlib import Path
from urllib.parse import quote
import re

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "client-documents"
PUBLIC_BASE = "https://narendrakoya999.github.io/narendra-koya-web-development-services/client-documents/"
LANGUAGES = {
    "en": {
        "title": "Website project documents", "home": "Back to portfolio", "nav": "Project stage",
        "intro": "Choose a stage and download its editable document. Replace the bracketed fields in a private copy, then share that copy by WhatsApp or email.",
        "download": "Download editable document (RTF)", "print": "Print or save as PDF",
        "format": "Open the RTF in Word or LibreOffice to fill it in.", "skip": "Skip to document",
        "share": "Share blank template", "email": "Email",
        "switch": "తెలుగు", "other": "te", "page": "index.html",
    },
    "te": {
        "title": "వెబ్‌సైట్ ప్రాజెక్ట్ పత్రాలు", "home": "పోర్ట్‌ఫోలియోకు తిరిగి", "nav": "పని దశ",
        "intro": "కావాల్సిన దశను ఎంచుకుని పత్రాన్ని డౌన్‌లోడ్ చేసుకోండి. మీ వ్యక్తిగత కాపీలో బ్రాకెట్లలో ఉన్న వివరాలను మార్చి WhatsApp లేదా ఈమెయిల్‌లో పంపండి.",
        "download": "మార్చుకోగల పత్రం డౌన్‌లోడ్ (RTF)", "print": "ప్రింట్ లేదా PDFగా భద్రపరచండి",
        "format": "వివరాలు నింపడానికి RTF పత్రాన్ని Word లేదా LibreOfficeలో తెరవండి.", "skip": "పత్రానికి వెళ్లండి",
        "share": "ఖాళీ నమూనాను పంచుకోండి", "email": "ఈమెయిల్",
        "switch": "English", "other": "en", "page": "te.html",
    },
}


def read_templates(language):
    source = ROOT / "tools" / "client-documents" / f"{language}.md"
    docs = []
    for block in re.split(r"^## ", source.read_text(encoding="utf-8"), flags=re.M)[1:]:
        header, *lines = block.strip().splitlines()
        key, title = header.split(" | ", 1)
        if not re.fullmatch(r"[a-z]+(?:-[a-z]+)*", key) or key in [doc[0] for doc in docs]:
            raise ValueError(f"Invalid or repeated stage {key}")
        docs.append((key, title, [line for line in lines if line.strip()]))
    return docs


def rtf_text(text):
    escaped = []
    raw = text.encode("utf-16-le")
    for i in range(0, len(raw), 2):
        code = int.from_bytes(raw[i:i + 2], "little")
        if 32 <= code < 127:
            ch = chr(code)
            escaped.append(("\\" if ch in "\\{}" else "") + ch)
        else:
            escaped.append(r"\u%d " % (code if code < 32768 else code - 65536))
    return "".join(escaped)


def write_rtf(path, title, lines, language):
    font, lang = ("Nirmala UI", 1098) if language == "te" else ("Calibri", 1033)
    header = (r"{\rtf1\ansi\ansicpg1252\deff0\uc0{\fonttbl{\f0\fnil " + font +
              r";}}\paperw11907\paperh16840\margl1080\margr1080\margt960\margb960" +
              rf"\deflang{lang}\lang{lang}\f0")
    body = [r"\pard\uc0\sa140\fs20 Narendra Koya\par",
            r"\pard\uc0\keepn\sb80\sa220\b\fs36 " + rtf_text(title) + r"\b0\par"]
    for line in lines:
        if line.startswith("### "):
            body.append(r"\pard\uc0\keepn\sb180\sa60\b\fs25 " + rtf_text(line[4:]) + r"\b0\par")
        else:
            body.append(r"\pard\uc0\sa100\fs23 " + rtf_text(line) + r"\par")
    path.write_text("\n".join([header, *body, "}"]) + "\n", encoding="ascii")


def write_page(language, docs):
    ui = LANGUAGES[language]
    other = LANGUAGES[ui["other"]]["page"]
    links, options, sheets = [], [], []
    for key, title, lines in docs:
        name = escape(title)
        filename = f"{key}-{language}.rtf"
        write_rtf(OUT / "downloads" / filename, title, lines, language)
        links.append(f'<a href="#{key}">{name}</a>')
        options.append(f'<option value="{key}">{name}</option>')
        paragraphs = "\n".join(f"<h3>{escape(line[4:])}</h3>" if line.startswith("### ")
                               else f"<p>{escape(line)}</p>" for line in lines)
        public_link = PUBLIC_BASE + ui["page"] + "#" + key
        message = f'{ui["share"]} · {title}\n{public_link}'
        subject = quote(f'{ui["share"]} · {title}', safe="")
        body = quote(message, safe="")
        sheets.append(f'''<article class="sheet" id="{key}" aria-labelledby="{key}-title">
<div class="paper"><span class="byline">Narendra Koya</span>
<h2 id="{key}-title" tabindex="-1">{name}</h2>
{paragraphs}</div>
<div class="actions"><a class="download" href="downloads/{filename}" download>{ui["download"]}</a>
<button class="print" type="button" hidden>{ui["print"]}</button></div>
<small>{ui["format"]}</small>
<p class="share">{ui["share"]} · <a href="https://wa.me/?text={body}" rel="noreferrer">WhatsApp</a>
· <a href="mailto:?subject={subject}&amp;body={body}">{ui["email"]}</a></p></article>''')
    template = f'''<!doctype html>
<html lang="{language}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>{ui["title"]} | Narendra Koya</title>
  <link rel="stylesheet" href="documents.css">
  <script src="documents.js" defer></script>
</head>
<body>
<a class="skip" href="#document">{ui["skip"]}</a>
<header><div class="wrap top"><a href="../index.html#process">← {ui["home"]}</a>
<a id="language" href="{other}" lang="{ui["other"]}" hreflang="{ui["other"]}">{ui["switch"]}</a></div></header>
<main class="wrap">
<div class="intro"><h1>{ui["title"]}</h1><p>{ui["intro"]}</p></div>
<div class="layout"><nav aria-label="{ui["nav"]}"><div class="stage-label">{ui["nav"]}</div>
<div class="stage-links">{chr(10).join(links)}</div>
<select aria-label="{ui["nav"]}" hidden>{chr(10).join(options)}</select></nav>
<div id="document" tabindex="-1">{chr(10).join(sheets)}</div></div></main>
</body></html>
'''
    (OUT / ui["page"]).write_text(template, encoding="utf-8")


if __name__ == "__main__":
    (OUT / "downloads").mkdir(parents=True, exist_ok=True)
    en, te = (read_templates(lang) for lang in LANGUAGES)
    if not en or [d[0] for d in en] != [d[0] for d in te]:
        raise ValueError("Both languages must cover the same project stages in order.")
    write_page("en", en)
    write_page("te", te)
