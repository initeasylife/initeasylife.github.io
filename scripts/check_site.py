#!/usr/bin/env python3
"""Validate the built site's navigation and document migration, without dependencies."""
import argparse
import json
import re
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit


class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.links = []
        self.documents = []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        for attr in ('href', 'src'):
            if attrs.get(attr):
                self.links.append(attrs[attr])
        if 'data-document' in attrs:
            self.documents.append(attrs)


def check_site(root, baseurl):
    errors = []
    pages = list(root.rglob('*.html'))
    if not pages:
        raise SystemExit(f'No HTML files found in {root}; build the site first.')
    for path in pages:
        text = path.read_text()
        page_url = baseurl + '/' + path.relative_to(root).as_posix()
        for link in Page(text).links:
            parsed = urlsplit(link)
            if parsed.scheme or parsed.netloc or not parsed.path:
                continue
            target = unquote(urlsplit(urljoin(page_url, link)).path)
            if baseurl:
                if not target.startswith(baseurl + '/'):
                    errors.append(f'{path}: link escapes baseurl: {link}')
                    continue
                target = target[len(baseurl):]
            resolved = root / target.lstrip('/')
            if resolved.is_dir():
                resolved /= 'index.html'
            if not resolved.is_file():
                errors.append(f'{path}: missing target {link}')
        if 'cdn.mathjax.org' in text:
            errors.append(f'{path}: obsolete MathJax CDN')

    library_path = root / 'library/index.html'
    if not library_path.exists():
        raise SystemExit('The document library was not built.')
    indexed = Page(library_path.read_text()).documents
    sources = [p for folder in ('_posts', '_notes') for p in Path(folder).rglob('*') if p.suffix in ('.md', '.markdown')]
    if len(indexed) != len(sources):
        errors.append(f'Library has {len(indexed)} entries for {len(sources)} source documents.')
    topics = re.findall(r'^- id: (.+)$', Path('_data/topics.yml').read_text(), re.M)
    counts = Counter(item.get('data-topic') for item in indexed)
    for topic in counts:
        if topic not in topics:
            errors.append(f'Unknown topic in library: {topic}')
    titles = [item.get('data-title') for item in indexed]
    if len(titles) != len(set(titles)):
        errors.append('Duplicate document titles in library.')
    source_topics = Counter()
    for source in sources:
        metadata = re.match(r'^---\n(.+?)\n---\n', source.read_text(), re.S)
        if not metadata:
            errors.append(f'Missing front matter: {source}')
            continue
        topic = re.search(r'^topic:\s*[\"\']?([a-z-]+)', metadata[1], re.M)
        if not topic or topic[1] not in topics:
            errors.append(f'Missing or unknown source topic: {source}')
        else:
            source_topics[topic[1]] += 1
    if source_topics != counts:
        errors.append(f'Source topics {source_topics} differ from indexed topics {counts}.')
    legacy_file = Path('scripts/legacy_urls.json')
    if legacy_file.exists():
        for url in json.loads(legacy_file.read_text()):
            if not (root / unquote(url).lstrip('/')).is_file():
                errors.append(f'Missing legacy article URL: {url}')
    # R Markdown starts with YAML that Jekyll would otherwise remove as front matter.
    # The download templates must reproduce the original files byte for byte.
    download_sources = Path('_includes/downloads')
    for original in download_sources.rglob('*.Rmd'):
        output = root / 'assets/downloads' / original.relative_to(download_sources)
        if not output.is_file() or output.read_bytes() != original.read_bytes():
            errors.append(f'Download differs from original R Markdown: {output}')
    if errors:
        raise SystemExit('\n'.join(errors))
    print(f'PASS: {len(pages)} HTML pages, {len(indexed)} indexed documents, {len(topics)} topics; all internal links and legacy URLs resolve.')
    print('Topic counts: ' + ', '.join(f'{topic}={counts[topic]}' for topic in topics))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('directory', nargs='?', default='.build', type=Path)
    parser.add_argument('--baseurl', default='')
    args = parser.parse_args()
    check_site(args.directory, args.baseurl.rstrip('/'))
