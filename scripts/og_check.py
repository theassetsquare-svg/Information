#!/usr/bin/env python3
import argparse
import json
import sys
import time
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from html.parser import HTMLParser

NAVER_UA = (
    "Mozilla/5.0 (compatible; Yeti/1.1; +https://help.naver.com/robots)"
)

DEFAULT_TIMEOUT = 15

class OGParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.og = {}

    def handle_starttag(self, tag, attrs):
        if tag.lower() != "meta":
            return
        attr = {k.lower(): v for k, v in attrs}
        prop = attr.get("property") or attr.get("name")
        if not prop:
            return
        if prop.lower().startswith("og:"):
            content = attr.get("content", "")
            self.og[prop.lower()] = content


def fetch(url, user_agent, cache_bust=False):
    target = url
    if cache_bust:
        parsed = urllib.parse.urlparse(url)
        q = urllib.parse.parse_qs(parsed.query)
        q["__ogcheck"] = [str(int(time.time()))]
        new_query = urllib.parse.urlencode(q, doseq=True)
        target = parsed._replace(query=new_query).geturl()

    req = urllib.request.Request(target)
    req.add_header("User-Agent", user_agent)
    req.add_header("Cache-Control", "no-cache")
    req.add_header("Pragma", "no-cache")
    with urllib.request.urlopen(req, timeout=DEFAULT_TIMEOUT) as resp:
        return resp.getcode(), resp.read(), resp.headers


def parse_sitemap(sitemap_url, user_agent):
    code, body, _ = fetch(sitemap_url, user_agent, cache_bust=True)
    if code != 200:
        raise RuntimeError(f"sitemap fetch failed: {sitemap_url} (status {code})")
    root = ET.fromstring(body)
    ns = ""
    if root.tag.startswith("{"):
        ns = root.tag.split("}", 1)[0] + "}"
    urls = []
    for loc in root.findall(f".//{ns}loc"):
        if loc.text:
            urls.append(loc.text.strip())
    return urls


def check_url(url, user_agent):
    result = {
        "url": url,
        "status": None,
        "og": {},
        "missing": [],
        "image_status": None,
        "image_content_type": None,
        "cache_bust_status": None,
        "cache_bust_og": {},
    }

    status, body, _ = fetch(url, user_agent, cache_bust=False)
    result["status"] = status
    if status != 200:
        return result

    parser = OGParser()
    parser.feed(body.decode("utf-8", errors="ignore"))
    result["og"] = parser.og

    for key in ("og:title", "og:description", "og:image"):
        if not parser.og.get(key):
            result["missing"].append(key)

    # Cache-bust fetch to detect stale edge cache behavior
    bust_status, bust_body, _ = fetch(url, user_agent, cache_bust=True)
    result["cache_bust_status"] = bust_status
    if bust_status == 200:
        bust_parser = OGParser()
        bust_parser.feed(bust_body.decode("utf-8", errors="ignore"))
        result["cache_bust_og"] = bust_parser.og

    image_url = parser.og.get("og:image")
    if image_url:
        try:
            img_status, _, img_headers = fetch(image_url, user_agent, cache_bust=True)
            result["image_status"] = img_status
            result["image_content_type"] = img_headers.get("Content-Type")
        except Exception as exc:
            result["image_status"] = f"error: {exc}"

    return result


def main():
    parser = argparse.ArgumentParser(description="OG tag checker (Naver UA aware)")
    parser.add_argument("--site-url", default="https://informationa.pages.dev")
    parser.add_argument("--sitemap-url", default=None)
    parser.add_argument("--log-dir", default=".og-check")
    parser.add_argument("--retries", type=int, default=20)
    parser.add_argument("--retry-wait", type=int, default=15)
    args = parser.parse_args()

    site_url = args.site_url.rstrip("/")
    sitemap_url = args.sitemap_url or f"{site_url}/sitemap.xml"

    # Retry loop to wait for deployment propagation
    urls = []
    last_err = None
    for _ in range(args.retries):
        try:
            urls = parse_sitemap(sitemap_url, NAVER_UA)
            if urls:
                break
        except Exception as exc:
            last_err = exc
        time.sleep(args.retry_wait)

    if not urls:
        if last_err:
            print(f"[warn] sitemap unavailable: {last_err}")
        urls = [site_url + "/"]

    # Ensure log dir exists
    import os
    os.makedirs(args.log_dir, exist_ok=True)
    json_path = os.path.join(args.log_dir, "og-check.jsonl")
    summary_path = os.path.join(args.log_dir, "og-check.log")

    failures = 0
    with open(json_path, "w", encoding="utf-8") as jf, open(summary_path, "w", encoding="utf-8") as sf:
        header = "url,status,missing,og:title,og:description,og:image,image_status,image_content_type,cache_bust_status\n"
        sf.write(header)
        for url in urls:
            result = check_url(url, NAVER_UA)
            jf.write(json.dumps(result, ensure_ascii=False) + "\n")

            missing = "|".join(result["missing"]) if result["missing"] else ""
            row = [
                result["url"],
                str(result["status"]),
                missing,
                result["og"].get("og:title", ""),
                result["og"].get("og:description", ""),
                result["og"].get("og:image", ""),
                str(result["image_status"]),
                str(result["image_content_type"] or ""),
                str(result["cache_bust_status"]),
            ]
            sf.write(",".join(v.replace("\n", " ").replace(",", " ") for v in row) + "\n")

            if result["status"] != 200 or result["missing"] or result["image_status"] != 200:
                failures += 1

    print(f"Checked {len(urls)} URLs. Failures: {failures}")
    print(f"Log: {summary_path}")
    print("Note: Naver share caches OG by URL. This check uses Naver UA and cache-busting query for freshness diagnostics.")

    if failures:
        sys.exit(1)


if __name__ == "__main__":
    main()
