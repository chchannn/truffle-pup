# Truffle Pup Website Design

## Overview

A static website for showcasing Lagotto Romagnolo puppies and publishing training content. Built with Astro, deployed to GitHub Pages. The primary goal is to sell Lagotto Romagnolo puppies, with blog content serving as both an SEO engine and a trust builder.

## Tech Stack

- **Framework:** Astro (static site generator, zero JS by default)
- **Content:** Markdown files with frontmatter (Astro content collections)
- **Hosting:** GitHub Pages (free, simple deployment)
- **Contact:** Mailto link (no backend needed)

## Design Style

- **Palette:** Warm earthy tones — cream/off-white background, brown and olive green accents, terracotta highlights
- **Typography:** Serif for headings (warm, classic feel), clean sans-serif for body
- **Photography-forward:** Large hero images, full-width puppy photos
- **Mobile-first:** Responsive grid, hamburger nav on mobile

## Site Architecture

```
truffle-pup/
├── src/
│   ├── content/
│   │   ├── blog/              # Markdown blog posts
│   │   └── puppies/           # Markdown puppy listings
│   ├── layouts/
│   │   └── BaseLayout.astro   # Shared layout (nav, footer, meta)
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── PuppyCard.astro
│   │   └── BlogCard.astro
│   └── pages/
│       ├── index.astro        # Homepage
│       ├── about.astro        # About you & breeding program
│       ├── puppies/
│       │   ├── index.astro    # Puppies listing grid
│       │   └── [slug].astro   # Individual puppy detail page
│       ├── blog/
│       │   ├── index.astro    # Blog listing
│       │   └── [slug].astro   # Individual blog post
│       └── contact.astro      # Contact page with mailto link
├── public/
│   └── images/                # Puppy photos, hero images
├── astro.config.mjs
└── package.json
```

## Content Models

### Blog Post

```yaml
---
title: "Teaching Your Lagotto Reliable Recall"
date: 2026-02-16
tags: ["training", "recall", "basics"]
image: "/images/blog/recall-training.jpg"
excerpt: "A step-by-step guide to building a solid recall with your Lagotto."
---
```

### Puppy Listing

```yaml
---
name: "Bruno"
date: 2026-02-01
status: "available"  # available | reserved | sold
sex: "male"
color: "brown roan"
image: "/images/puppies/bruno.jpg"
gallery: ["/images/puppies/bruno-1.jpg", "/images/puppies/bruno-2.jpg"]
birthDate: 2026-01-15
---
```

## Pages

| Page | Purpose | Key Elements |
|---|---|---|
| **Home** | First impression, funnel to puppies & blog | Hero image, breed intro, featured puppies, latest blog posts, CTA to contact |
| **About** | Build trust | Your story, breeding philosophy, health testing, certifications |
| **Puppies** | Showcase available pups | Filterable grid by status, photo cards |
| **Puppy Detail** | Individual puppy | Photo gallery, details, status badge, mailto CTA |
| **Blog** | Training content + SEO | Post cards with tags, sorted by date |
| **Blog Post** | Individual article | Full content, related posts, mailto CTA |
| **Contact** | Inquiry | Email (mailto link), location/general info, social links |

## SEO Strategy

- **Meta tags on every page** — title, description, Open Graph, Twitter cards
- **Structured data (JSON-LD)** — LocalBusiness on homepage, Article on blog posts, Product on puppy listings
- **Sitemap + robots.txt** — auto-generated via `@astrojs/sitemap`
- **Semantic HTML** — proper heading hierarchy, alt text on all images
- **Performance** — zero JS default, optimized images via `astro:assets`, lazy loading
- **Blog as SEO engine** — training content targets long-tail keywords
- **Clean URLs** — `/blog/teaching-lagotto-recall`, `/puppies/bruno`
