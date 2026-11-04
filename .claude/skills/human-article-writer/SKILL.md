---
name: "human-article-writer"
description: Write SEO blog articles that read like a sharp human editor wrote them, not a template. Use this skill WHENEVER the user gives keywords, a topic, or a brief and asks for an article, blog post, SEO content, pillar page, guide, or "write like a human", "humanize this", "make it not sound like AI", "undetectable", "rewrite this article", or shares an AI detection report about their content. Also use when the user wants an existing draft cleaned of AI patterns (rule of three, "not X, it's Y", bolded lead-ins, cliché metaphors, symmetric sections, "Bottom Line" endings). Covers SERP and competitor research, real sourced facts, keyword placement, readability, no dashes, low passive voice, and a self-audit with a bundled linter script.
---

# Human Article Writer

Goal: articles a reader trusts and Google rewards. Those are the same goal.

Be honest with the user about one thing up front, once, briefly: no writing method can guarantee a "0% AI" score. Detectors disagree with each other and flag human writing too. Google's own guidance says it ranks helpful, original, people-first content and does not penalize text for how it was produced. What it demotes is generic, scaled, unoriginal content. So this skill attacks the real problem: sameness. Text that is specific, opinionated, uneven and sourced stops looking machine-made as a side effect.

## Workflow

### 1. Gather inputs (ask once, in one message, only for what is missing)

- Keywords (primary + secondary), target country, word count (default 1400)
- **Target market** (country, currency, spelling). Lock it. Every example, price, platform, law and stat must fit that one market. Never write "rupee or dollar".
- Audience and site/brand voice (one sample paragraph from their site is gold)
- **Real experience material.** This is the single biggest human signal. Ask: "Any first-hand detail I can use? A client case, a number from your own work, a mistake you saw, an opinion you hold that competitors don't." If the user gives none, do NOT invent anecdotes, fake clients, fake quotes, or fake statistics. Write from verifiable specifics and clear opinions instead, and note (outside the article) where a personal story would lift the piece.

If the user says "just write it" with no experience material, write the article with NO personal anecdotes at all and no placeholders inside the body. Rely on sourced specifics and clear opinions. List suggested spots for their own examples separately, after the article, so a draft is never published half-filled.

### 2. Research (search before writing, always)

- Search the primary keyword. Fetch the top 3 to 5 ranking pages.
- Note for each: angle, H2 list, what they all repeat, what nobody covers, what questions appear in People Also Ask.
- Find 3 to 6 trustworthy sources for facts (official bodies, original studies, primary docs, reputable publishers). Record URL + the exact fact.
- Pick ONE angle competitors miss. The article should have a point of view, not just coverage.

Every number, date, name, study and claim in the article must come from a source you retrieved. No source, no claim. Cut it.

### 3. Plan an uneven structure

Read `references/structure.md`. Key rules:
- Do not copy the competitor template (hook, summary box, table, every position in order, FAQ, "Bottom Line"). Use only the parts this topic needs.
- Sections get unequal length. Spend words where the reader's real problem is. A minor subtopic can be two sentences.
- H2s are specific and sometimes phrased like a person talks ("Why your calculator shows 4"), not labels ("Understanding X").

### 4. Write the draft

Before writing, pick an opening type and an ending type from `references/human-craft.md`. Do not reuse the last ones used in this conversation. Do not use a contrarian hook followed by a "most guides" pivot.

Read `references/ai-tells.md` before writing. Avoid every pattern listed there. Read `references/human-craft.md` for what to do instead.

Hard rules from the user's standard brief:
- No dashes of any kind in body text: no em dash (—), no en dash (–), no spaced hyphen used as punctuation. Use a comma, period, colon or parentheses. Hyphenated words (well-known) are fine.
- Passive voice under 10% of sentences.
- Short paragraphs: 1 to 4 sentences, mostly 2 to 3. Vary them; an occasional one-liner is good, a wall of one-liners is not.
- Keywords: primary keyword in title, H1, first 100 words, one H2, meta description, and naturally 3 to 6 more times per 1400 words. Use variants and close phrasing. Never force an exact-match phrase into a sentence where it reads wrong.
- Humour: dry, observational, tied to the topic. One light moment per 300 to 400 words at most. No puns stacked on puns.
- Cite sources inline as descriptive links ("a 2023 Pew survey found...") and list them at the end under "Sources".

### 5. Self-audit (mandatory)

Save the draft as markdown, then run:

```bash
python3 scripts/lint_article.py draft.md --keywords "primary kw" "secondary kw"
```

It reports dashes, flagged vocabulary, "not X, it's Y" contrasts, triplet lists, bold lead-ins, sentence length spread (burstiness), passive voice estimate, paragraph length, keyword counts, and template headings. Fix every FAIL. Look at every WARN and fix it unless keeping it truly reads better. Re-run until clean.

Then do a read-aloud pass yourself: find the three most "polished but empty" sentences and either make them concrete or delete them.

### 5b. De-template pass (mandatory)

Reread the draft as a skeptical editor hunting for model cadence:
- Delete every sentence that announces honesty, humility or opinion ("honestly", "my opinion, yours may differ").
- Delete Q-and-answer fragments ("Boring? Yes.") except at most one.
- Check each stat: does it just decorate a conclusion you already reached? Add context or a counterpoint, or drop it.
- Check the arc: if it runs problem, stat, reframe, moral, restructure it.
- Check locale: one currency, one spelling system, local examples.
- Make sure no two consecutive paragraphs open with the same shape (claim then explanation).
Run the linter again after this pass.

### 6. Deliver

Deliver the article in the format the user asked for (default: a doc, or markdown in chat if they want to paste it). Include: SEO title (under 60 chars), meta description (under 155 chars), suggested URL slug, the article, a Sources list, and, separately after the article, a short list of places where the user's own example would help. The article body itself contains no placeholders. Keep commentary short.

## Rewriting an existing AI-sounding article

Run the linter on the original first and show the user the top problems in plain words. Then rewrite using steps 3 to 5. Keep all accurate facts. Drop claims that have no source.
