#!/usr/bin/env python3
"""Lint a markdown article for common AI-writing patterns and SEO basics.

Usage: python3 lint_article.py draft.md --keywords "primary kw" "secondary kw"
Prints FAIL / WARN / OK lines. Exit code 1 if any FAIL.
"""
import argparse, re, statistics, sys

FLAG_WORDS = [
    "delve", "tapestry", "testament", "beacon", "realm", "embark", "unlock", "unleash",
    "elevate", "empower", "foster", "leverage", "harness", "robust", "seamless", "pivotal",
    "crucial", "vital", "multifaceted", "holistic", "nuanced", "intricate", "profound",
    "remarkable", "genuinely", "truly", "deeply", "ultimately", "essentially", "furthermore",
    "moreover", "additionally", "in conclusion", "it's worth noting", "it is worth noting",
    "importantly", "fast-paced", "ever-evolving", "game-changer", "game changer", "at its core",
    "plays a key role", "a wide range of", "serves as", "stands as", "navigate", "navigating",
    "journey", "landscape", "utilize", "utilise", "facilitate", "subsequently",
]
CLICHES = ["caterpillar", "butterfly", "phoenix", "double-edged", "tip of the iceberg",
           "roller coaster", "rollercoaster", "north star", "cellular level", "puzzle piece"]
TEMPLATE_HEADINGS = ["bottom line", "final thoughts", "key takeaways", "conclusion",
                     "in summary", "understanding ", "the power of", "the short answer", "tl;dr"]

def strip_md(text):
    text = re.sub(r"```.*?```", " ", text, flags=re.S)
    text = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", text)
    return text

def sentences(text):
    body = "\n".join(l for l in text.splitlines()
                     if l.strip() and not l.lstrip().startswith(("#", "|")))
    body = re.sub(r"[*_`>]", "", body)
    parts = re.split(r"(?<=[.!?])\s+|\n+", body)
    return [p.strip() for p in parts if len(p.split()) >= 1 and re.search(r"[A-Za-z]", p)]

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("file")
    ap.add_argument("--keywords", nargs="*", default=[])
    a = ap.parse_args()
    raw = open(a.file, encoding="utf-8").read()
    text = strip_md(raw)
    low = text.lower()
    fails = 0

    def report(level, msg):
        nonlocal fails
        if level == "FAIL":
            fails += 1
        print(f"{level}: {msg}")

    words = re.findall(r"[A-Za-z0-9']+", text)
    print(f"Words: {len(words)}")

    # Dashes
    dash_hits = re.findall(r".{0,25}(?:—|–| - ).{0,25}", text)
    if dash_hits:
        report("FAIL", f"{len(dash_hits)} dash(es) used as punctuation, e.g. '{dash_hits[0].strip()}'")
    else:
        report("OK", "no dashes")

    # Flag words
    found = {}
    for w in FLAG_WORDS:
        n = len(re.findall(r"\b" + re.escape(w) + r"\b", low))
        if n:
            found[w] = n
    total = sum(found.values())
    lvl = "FAIL" if total >= 4 else ("WARN" if total else "OK")
    report(lvl, f"flagged vocabulary x{total}: {found}" if total else "no flagged vocabulary")

    cl = [c for c in CLICHES if c in low]
    report("WARN" if cl else "OK", f"cliché images: {cl}" if cl else "no stock clichés")

    # Contrast flips
    flips = re.findall(r"(?:isn't|is not|aren't|are not|wasn't|doesn't|does not|don't|do not)\b[^.?!]{0,60}[.?!,;]\s*(?:it|they|that|this|but)\b", low)
    flips += re.findall(r"\bnot about\b[^.]{0,60}\babout\b", low)
    flips += re.findall(r"(?:^|[.!?]\s+)not [^.!?]{1,30}\.\s+\w+[^.!?]{0,30}\.", low)
    report("FAIL" if len(flips) > 2 else ("WARN" if flips else "OK"),
           f"'not X, it's Y' contrasts x{len(flips)} (keep max 1)" if flips else "no contrast flips")

    # Triplets
    trip = re.findall(r"\b\w+(?: \w+)?, \w+(?: \w+)?,? and \w+", text)
    per1k = len(trip) / max(len(words), 1) * 1000
    report("WARN" if per1k > 3 else "OK", f"'A, B, and C' triplets x{len(trip)} ({per1k:.1f}/1000 words)")

    # Bold lead-ins
    bold = re.findall(r"^\s*(?:[-*]\s+)?\*\*[^*]+(?:[.:]\*\*|\*\*[.:])", raw, flags=re.M)
    report("WARN" if len(bold) > 2 else "OK", f"bolded lead-in paragraphs x{len(bold)}")

    # Headings
    heads = [h.strip("# ").lower() for h in re.findall(r"^#{1,6} .+$", raw, flags=re.M)]
    bad = [h for h in heads if any(t in h for t in TEMPLATE_HEADINGS)]
    report("WARN" if bad else "OK", f"template headings: {bad}" if bad else "headings not templated")

    # Burstiness
    sents = sentences(raw)
    lens = [len(s.split()) for s in sents]
    if len(lens) > 5:
        sd = statistics.pstdev(lens)
        mean = statistics.mean(lens)
        short = sum(1 for l in lens if l <= 6) / len(lens) * 100
        long_ = sum(1 for l in lens if l >= 25) / len(lens) * 100
        lvl = "OK" if sd >= 7 else ("WARN" if sd >= 5 else "FAIL")
        report(lvl, f"sentence length mean {mean:.1f}, stdev {sd:.1f} (want 7+), short<=6w {short:.0f}%, long>=25w {long_:.0f}%")
        if short > 30:
            report("WARN", "too many fragments/short sentences (>30%); reads choppy")
        # monotony: 4 consecutive sentences within 4 words of each other
        runs = sum(1 for i in range(len(lens) - 3) if max(lens[i:i+4]) - min(lens[i:i+4]) <= 4)
        if runs > len(lens) * 0.15:
            report("WARN", f"{runs} flat runs of 4 similar-length sentences")

    # Passive voice estimate
    pas = [s for s in sents if re.search(r"\b(is|are|was|were|be|been|being|get|got|gets)\s+(\w+ly\s+)?\w+(ed|en|wn|lt|ught|ne)\b(\s+by\b)?", s.lower())]
    pct = len(pas) / max(len(sents), 1) * 100
    report("FAIL" if pct > 12 else ("WARN" if pct > 8 else "OK"), f"passive voice approx {pct:.0f}% (target <10%; heuristic, check manually)")

    # Paragraph length
    paras = [p for p in re.split(r"\n\s*\n", raw) if p.strip() and not p.lstrip().startswith(("#", "|", "-", "*", "1."))]
    longp = [p for p in paras if len(re.split(r"(?<=[.!?])\s+", p.strip())) > 4]
    report("WARN" if longp else "OK", f"{len(longp)} paragraph(s) over 4 sentences")
    plens = [len(p.split()) for p in paras]
    if len(plens) > 4 and statistics.pstdev(plens) < 12:
        report("WARN", f"paragraph lengths too uniform (stdev {statistics.pstdev(plens):.1f} words)")

    # Section symmetry
    secs = re.split(r"^#{2,3} .+$", raw, flags=re.M)[1:]
    sl = [len(s.split()) for s in secs if s.strip()]
    if len(sl) >= 4:
        cv = statistics.pstdev(sl) / max(statistics.mean(sl), 1)
        report("WARN" if cv < 0.35 else "OK", f"section length variation {cv:.2f} (want >0.35): {sl}")

    # Keywords
    first100 = " ".join(words[:100]).lower()
    for kw in a.keywords:
        k = kw.lower()
        n = len(re.findall(r"\b" + re.escape(k) + r"\b", low))
        dens = n * len(k.split()) / max(len(words), 1) * 100
        inh = any(k in h for h in heads)
        msg = f"keyword '{kw}': {n}x, density {dens:.2f}%, in first 100 words: {k in first100}, in a heading: {inh}"
        lvl = "WARN" if dens > 2.5 or n == 0 else "OK"
        report(lvl, msg)

    # Placeholders
    ph = re.findall(r"\[(?:add|insert|your|todo)[^\]]*\]|\bTODO\b|\bXX%", raw, flags=re.I)
    report("FAIL" if ph else "OK", f"unfilled placeholders: {ph[:3]}" if ph else "no placeholders")

    # Performed candour / hook-pivot / hedge tags
    candour = ["the honest answer", "honestly", "let's be real", "let's be honest", "here's the thing",
               "the truth is", "nobody talks about", "nobody tells you", "most guides", "most articles",
               "yours may differ", "your mileage may vary", "grain of salt", "let's face it",
               "if you're reading this", "in my opinion"]
    hits = {c: low.count(c) for c in candour if c in low}
    n = sum(hits.values())
    report("FAIL" if n >= 2 else ("WARN" if n else "OK"), f"performed candour / hook-pivot phrases: {hits}" if n else "no performed candour")
    opening = " ".join(words[:40]).lower()
    if any(c in opening for c in ["honest", "truth", "most guides", "nobody", "plain", "simple answer"]):
        report("FAIL", "opening uses a contrarian hook / honesty announcement")

    # Mini Q&A fragments
    qa = re.findall(r"\b\w+(?: \w+){0,3}\?\s+(?:Yes|No|Absolutely|Definitely|Sure|Nope|Maybe|Not really)\b[.!]", text)
    report("FAIL" if len(qa) > 1 else ("WARN" if qa else "OK"), f"'Boring? Yes.' fragments x{len(qa)}: {qa[:3]}" if qa else "no Q-and-answer fragments")

    # Locale mixing
    cur = {k: bool(re.search(p, text, flags=re.I)) for k, p in
           {"INR": r"₹|\brupees?\b|\bINR\b|\blakh|\bcrore", "USD": r"\$\d|\bdollars?\b|\bUSD\b",
            "GBP": r"£|\bpounds?\b", "EUR": r"€|\beuros?\b"}.items()}
    used = [k for k, v in cur.items() if v]
    report("WARN" if len(used) > 1 else "OK", f"mixed currencies {used}; pick one target market" if len(used) > 1 else "single locale currency")
    if re.search(r"\b(?:colour|favour|organis)", low) and re.search(r"\b(?:color|favor|organiz)", low):
        report("WARN", "mixed UK/US spelling")

    print(f"\n{fails} FAIL(s)")
    sys.exit(1 if fails else 0)

if __name__ == "__main__":
    main()
