#!/usr/bin/env python3
import argparse
import os
import sys
import time
import urllib.parse
import urllib.request

NAVER_UA = "Mozilla/5.0 (compatible; Yeti/1.1; +https://help.naver.com/robots)"
DEFAULT_TIMEOUT = 15


def fetch(url, user_agent, cache_bust=False):
    target = url
    if cache_bust:
        parsed = urllib.parse.urlparse(url)
        q = urllib.parse.parse_qs(parsed.query)
        q["__deploycheck"] = [str(int(time.time()))]
        new_query = urllib.parse.urlencode(q, doseq=True)
        target = parsed._replace(query=new_query).geturl()

    req = urllib.request.Request(target)
    req.add_header("User-Agent", user_agent)
    req.add_header("Cache-Control", "no-cache")
    req.add_header("Pragma", "no-cache")
    with urllib.request.urlopen(req, timeout=DEFAULT_TIMEOUT) as resp:
        return resp.getcode(), resp.read(), resp.headers


def wait_for_url(url, user_agent, retries, wait_s):
    last_status = None
    for _ in range(retries):
        try:
            status, body, headers = fetch(url, user_agent, cache_bust=True)
            last_status = status
            if status == 200 and body:
                return True, status, headers
        except Exception:
            pass
        time.sleep(wait_s)
    return False, last_status, None


def write_summary(lines):
    summary_path = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary_path:
        with open(summary_path, "a", encoding="utf-8") as f:
            f.write("\n".join(lines) + "\n")


def main():
    parser = argparse.ArgumentParser(description="Verify deploy completion via public URL")
    parser.add_argument("--site-url", default="https://informationa.pages.dev")
    parser.add_argument("--sitemap-url", default=None)
    parser.add_argument("--retries", type=int, default=20)
    parser.add_argument("--retry-wait", type=int, default=15)
    args = parser.parse_args()

    site_url = args.site_url.rstrip("/") + "/"
    sitemap_url = args.sitemap_url or (site_url.rstrip("/") + "/sitemap.xml")

    ok_site, status_site, headers_site = wait_for_url(site_url, NAVER_UA, args.retries, args.retry_wait)
    ok_map, status_map, headers_map = wait_for_url(sitemap_url, NAVER_UA, args.retries, args.retry_wait)

    lines = []
    lines.append("## Deployment Verification")
    lines.append("")
    lines.append(f"- Site URL: {site_url}")
    lines.append(f"- Site status: {status_site}")
    if headers_site:
        lines.append(f"- Site content-type: {headers_site.get('Content-Type')}")
    lines.append(f"- Sitemap URL: {sitemap_url}")
    lines.append(f"- Sitemap status: {status_map}")
    if headers_map:
        lines.append(f"- Sitemap content-type: {headers_map.get('Content-Type')}")
    lines.append("")
    lines.append("Naver UA used: Yeti/1.1")
    lines.append("Cache busting: enabled")

    write_summary(lines)

    print("\n".join(lines))

    if not ok_site or not ok_map:
        sys.exit(1)


if __name__ == "__main__":
    main()
