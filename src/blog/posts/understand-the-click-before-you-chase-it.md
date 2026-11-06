---
title: "Understand the Click Before You Chase It"
description: "November’s Search Console click spikes are a reminder: understand who is behind a traffic jump before it steers budget. Five filters to investigate any spike."
date: 2026-11-06
tags: ["Google Search Console", "Analytics"]
draft: false
---

A traffic spike is an invitation to investigate.

It’s tempting to see a line shoot upward and assume your marketing is working. More clicks. More attention. Progress.

But before increasing your budget or declaring a strategy successful, ask what actually changed.

Who is behind those clicks? What brought them to your website? What happened next?

My view is simple: **understand the traffic before letting it steer your decisions.**

## What the November Click Spikes Can Teach Us

The recent Google Search Console discussion started with unusual patterns: clicks climbed sharply on some websites while impressions barely moved.

[Barry Schwartz shared the issue on X](https://x.com/rustybrick/status/2117637034206507118), drawing attention to observations from Joy Hawkins. [Hawkins posted her own example](https://x.com/JoyanneHawkins/status/2117630857317916805), and [Glenn Gabe reported similar activity](https://x.com/glenngabe/status/2117640763182051610) on some properties. The cause was still uncertain in the coverage, with automated activity and a reporting issue among the explanations being discussed.

<blockquote class="twitter-tweet" data-dnt="true" data-align="center"><p>Barry Schwartz (@rustybrick) on the unusual click spikes in Google Search Console.</p><a href="https://twitter.com/rustybrick/status/2117637034206507118">View the post on X</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

In her [Search Engine Journal analysis of the November click spikes](https://www.searchenginejournal.com/november-click-spikes-in-google-search-console-are-bot-traffic-how-to-filter-your-reports/595834/), Marie Haynes examined patterns that appeared inconsistent with normal human searching: unusually high click-through rates on lower-ranking pages, desktop-heavy spikes, and clusters of slightly reworded queries.

That raises a question worth asking well beyond this particular incident:

How much of what we call growth have we actually investigated?

## Start With a Better Question Than “Did Traffic Go Up?”

A higher click count tells you something changed. You still need to establish what changed and whether it matters to your business.

I want to know which pages attracted attention, whether the visitors came from relevant markets, and whether that attention led to meaningful activity.

A potential customer comparing your services and an automated system retrieving a page can represent very different kinds of activity.

Treating every increase as a win can lead you to invest in the wrong things. Treating every decline as a failure can lead you to interrupt something that is working.

This is why filtering belongs in the decision-making process.

## Before Filtering, Establish Your Baseline

Open **Google Search Console → Performance → Search results** and select **Web** as the search type.

Choose a date range that includes the spike and enough earlier data to understand your usual pattern. Turn on all four metrics:

- **Total clicks**

- **Total impressions**

- **Average CTR**

- **Average position**

Compare the affected dates with an earlier period. Consider normal differences between weekdays and weekends, campaigns, and seasonal demand.

Keep an unfiltered export or screenshot for reference. As you investigate, record the filters you apply.

You want to be able to explain how you reached your conclusion.

## 1. Exclude a Page That Is Distorting the Report

If the spike is concentrated on one page or a recognizable group of URLs, temporarily excluding those pages can help you see what happened elsewhere.

1. Open the **Pages** tab beneath the chart.

2. Identify the URL with the unusual increase.

3. At the top of the report, select **+ Add filter → Page**.

4. Choose **URLs not containing**.

5. Enter the distinctive URL slug or relevant folder, such as `/locations/`.

6. Select **Apply** and review the remaining trend.

Google explains these controls in its [Search Console filtering and comparison guide](https://support.google.com/webmasters/answer/17011165?hl=en).

Be precise with the text you enter. A broad folder exclusion may remove far more pages than you intended.

**This removes all reported activity for the matching pages, including legitimate clicks.** It helps you investigate the rest of the site; it does not separate human clicks from automated clicks on the excluded pages.

## 2. Check Whether the Spike Comes From One Country

Geography can reveal a pattern that a sitewide total hides.

1. Remove the page filter so you can review the full site again.

2. Set the date range to the affected period.

3. Open the **Countries** tab.

4. Compare the country breakdown with an earlier period.

5. If one country accounts for the unusual increase, use **+ Add filter → Country** to examine it separately.

6. Review your main customer market separately as well.

Ask whether the change makes sense for your business. A local service company might investigate an unexpected surge from outside its service area. An international business may have a perfectly reasonable explanation for the same pattern.

A country filter shows where reported activity is concentrated. **Location alone does not establish whether a visitor is legitimate.**

## 3. Compare Mobile and Desktop Traffic

The article described spikes that were heavily concentrated on desktop devices. In that situation, mobile can provide a useful comparison.

1. Clear any page or country filters you no longer need.

2. Select a date range covering the spike and the preceding weeks.

3. Choose **+ Add filter → Device → Mobile**.

4. Select **Apply** and examine the mobile trend.

5. Switch the filter to **Desktop** and compare the pattern.

If desktop jumps while mobile remains steady, you have narrowed the investigation.

You have not proven that all desktop clicks are automated, or that every mobile click is human.

A mobile-only view also excludes legitimate desktop activity. Label it clearly when sharing it with a client or team.

## 4. Find Lower-Ranking Pages With Unusual Click Activity

The next step is to examine pages whose clicks look surprising relative to their average position.

Following the approach in Haynes’ analysis:

1. Set the date range to the day or days showing the spike.

2. Make sure **Average CTR** and **Average position** are enabled.

3. Open the **Pages** tab.

4. Select the filter icon inside the table.

5. Choose **Position → Greater than → 10**.

6. Sort the table by **Clicks**, highest first.

7. Look for pages with unusually high CTR and compare their activity with the preceding period.

A page averaging a position outside the top ten that suddenly receives a high proportion of clicks deserves a closer look.

But context matters. One click from one impression produces a 100% CTR. That small sample is not enough to diagnose bot activity.

Look for repeated patterns across pages, dates, devices, and queries.

Also, **this table filter narrows the rows you inspect; it does not remove those clicks from the main performance chart.**

## 5. Use a Connected AI Tool to Scale the Investigation

If you manage several sites, an AI tool connected to the Search Console API can help identify properties that need closer inspection.

The connection matters. A chatbot without access to your Search Console data cannot perform this analysis.

Here is an adapted prompt:

```text
Review daily Google Search Console Web performance from October 20, 2026, through the latest available date. Include fresh data using dataState: "all" and label any preliminary results.

Flag dates from October 31 through November 2 where clicks exceeded twice the preceding seven-day daily average. For each flagged date, compare clicks, impressions, CTR, and average position.

Break the changes down by device, country, and page. Identify pages with average position greater than 10 and either CTR of at least 20% or at least three clicks. Compare those pages with their prior-week performance.

Inspect available queries for repeated variations of the same question and unusually high CTR. Summarize the evidence, limitations, and recommended follow-up. Treat these thresholds as investigation triggers, not proof of automated traffic.
```

For future investigations, replace the dates with the relevant period.

Automation can make the review faster. The interpretation still needs judgment.

## Turn What You Learn Into a Decision

Once you understand the pattern, connect it to what is happening in the business.

Review inquiries, booked appointments, purchases, and lead quality alongside your traffic reports. Allow for the time people need to make a decision.

Then choose an action that fits the evidence:

- **Relevant visitors arrive but rarely inquire:** Review the landing page, offer, and contact process.

- **Qualified inquiries increase:** Identify the pages and topics contributing to them.

- **Traffic comes from audiences you cannot serve:** Reassess targeting and content relevance.

- **The spike appears anomalous:** Document the dates and affected segments, then monitor before changing the strategy.

- **The evidence is inconclusive:** Keep investigating rather than forcing an explanation.

Filtering should help you see more clearly. Keep the original totals available and explain every exclusion.

## Make the Report Useful

I want reporting to tell me where to invest, what to improve, and what needs more evidence.

That requires looking beyond the most impressive number on the screen.

Understand who is arriving. Understand what they need. Understand whether your website helps them take the next step.

Then act.

**The value of a report is the quality of the decision it helps you make.**
