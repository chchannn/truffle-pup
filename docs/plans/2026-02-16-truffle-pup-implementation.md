# Truffle Pup Website Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a static Astro website for showcasing Lagotto Romagnolo puppies and publishing training blog content, with SEO optimization and a warm earthy design.

**Architecture:** Astro static site with Markdown content collections for blog posts and puppy listings. Pages rendered at build time. No JS shipped to client. Deployed to GitHub Pages.

**Tech Stack:** Astro 5.x, TypeScript, @astrojs/sitemap, astro:assets for image optimization

---

### Task 1: Scaffold Astro Project

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `src/env.d.ts`

**Step 1: Initialize Astro project**

Run: `npm create astro@latest . -- --template minimal --no-install --typescript strict`

Accept overwriting if prompted (repo is empty except docs/).

**Step 2: Install dependencies**

Run: `npm install`
Run: `npm install @astrojs/sitemap`

**Step 3: Configure Astro**

Replace `astro.config.mjs` with:

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://chchannn.github.io',
  base: '/truffle-pup',
  integrations: [sitemap()],
});
```

**Step 4: Verify dev server starts**

Run: `npm run dev`
Expected: Server starts at localhost:4321

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: scaffold Astro project with sitemap integration"
```

---

### Task 2: Define Content Collections

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/blog/welcome.md` (sample)
- Create: `src/content/puppies/sample-puppy.md` (sample)

**Step 1: Create content config**

Create `src/content.config.ts`:

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    excerpt: z.string(),
  }),
});

const puppies = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/puppies' }),
  schema: z.object({
    name: z.string(),
    date: z.coerce.date(),
    status: z.enum(['available', 'reserved', 'sold']),
    sex: z.enum(['male', 'female']),
    color: z.string(),
    image: z.string(),
    gallery: z.array(z.string()).default([]),
    birthDate: z.coerce.date(),
  }),
});

export const collections = { blog, puppies };
```

**Step 2: Create sample blog post**

Create `src/content/blog/welcome.md`:

```markdown
---
title: "Welcome to Truffle Pup"
date: 2026-02-16
tags: ["news"]
excerpt: "Introducing our Lagotto Romagnolo breeding program and training resource."
---

Welcome to Truffle Pup! We are a small, dedicated Lagotto Romagnolo breeder focused on raising healthy, well-socialized puppies with excellent temperaments.

Stay tuned for training tips, breed information, and updates on our available puppies.
```

**Step 3: Create sample puppy listing**

Create `src/content/puppies/sample-puppy.md`:

```markdown
---
name: "Luna"
date: 2026-02-01
status: available
sex: female
color: "white & orange"
image: "/images/puppies/placeholder.jpg"
gallery: []
birthDate: 2026-01-10
---

Luna is a playful and curious girl with a gentle temperament. She loves exploring and is already showing interest in scent work.
```

**Step 4: Create placeholder image directory**

Run: `mkdir -p public/images/puppies public/images/blog`

**Step 5: Verify build works**

Run: `npm run build`
Expected: Build succeeds without errors

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: define blog and puppies content collections with sample content"
```

---

### Task 3: Base Layout and Global Styles

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/styles/global.css`

**Step 1: Create global styles**

Create `src/styles/global.css` with the warm earthy color palette:

```css
:root {
  --color-cream: #FDF6EC;
  --color-brown: #5C3D2E;
  --color-brown-light: #8B6F5C;
  --color-olive: #6B7F4E;
  --color-olive-light: #8FA76E;
  --color-terracotta: #C67B5C;
  --color-terracotta-light: #D9A58C;
  --color-text: #3A2E28;
  --color-text-light: #6B5B53;
  --color-white: #FFFFFF;
  --color-border: #E0D5C8;

  --font-heading: 'Georgia', 'Times New Roman', serif;
  --font-body: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;

  --max-width: 1200px;
  --content-width: 800px;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-body);
  color: var(--color-text);
  background-color: var(--color-cream);
  line-height: 1.7;
}

h1, h2, h3, h4 {
  font-family: var(--font-heading);
  color: var(--color-brown);
  line-height: 1.3;
}

h1 { font-size: 2.5rem; }
h2 { font-size: 2rem; }
h3 { font-size: 1.5rem; }

a {
  color: var(--color-terracotta);
  text-decoration: none;
  transition: color 0.2s;
}

a:hover {
  color: var(--color-brown);
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 1.5rem;
}

.content {
  max-width: var(--content-width);
  margin: 0 auto;
  padding: 0 1.5rem;
}
```

**Step 2: Create BaseLayout**

Create `src/layouts/BaseLayout.astro`:

```astro
---
interface Props {
  title: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
}

const {
  title,
  description = 'Lagotto Romagnolo breeder and training resource. Healthy, well-socialized puppies raised with care.',
  image = '/images/og-default.jpg',
  type = 'website',
} = Astro.props;

const canonicalURL = new URL(Astro.url.pathname, Astro.site);
const fullTitle = title === 'Home' ? 'Truffle Pup | Lagotto Romagnolo' : `${title} | Truffle Pup`;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="canonical" href={canonicalURL} />

    <title>{fullTitle}</title>
    <meta name="description" content={description} />

    <!-- Open Graph -->
    <meta property="og:type" content={type} />
    <meta property="og:title" content={fullTitle} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonicalURL} />
    <meta property="og:image" content={new URL(image, Astro.site)} />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={fullTitle} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={new URL(image, Astro.site)} />

    <meta name="generator" content={Astro.generator} />
  </head>
  <body>
    <slot />
  </body>
</html>

<style is:global>
  @import '../styles/global.css';
</style>
```

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add base layout with SEO meta tags and global earthy styles"
```

---

### Task 4: Header and Footer Components

**Files:**
- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`
- Modify: `src/layouts/BaseLayout.astro` (add Header/Footer)

**Step 1: Create Header**

Create `src/components/Header.astro`:

```astro
---
const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/puppies', label: 'Puppies' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

const currentPath = Astro.url.pathname.replace(/\/$/, '') || '/';
---

<header class="header">
  <div class="container header-inner">
    <a href="/" class="logo">Truffle Pup</a>
    <button class="menu-toggle" aria-label="Toggle menu" aria-expanded="false">
      <span></span>
      <span></span>
      <span></span>
    </button>
    <nav class="nav" aria-label="Main navigation">
      {navLinks.map(link => (
        <a
          href={link.href}
          class:list={['nav-link', { active: currentPath === link.href.replace(/\/$/, '') || (link.href !== '/' && currentPath.startsWith(link.href)) }]}
        >
          {link.label}
        </a>
      ))}
    </nav>
  </div>
</header>

<style>
  .header {
    background: var(--color-white);
    border-bottom: 1px solid var(--color-border);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .header-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 1rem;
    padding-bottom: 1rem;
  }

  .logo {
    font-family: var(--font-heading);
    font-size: 1.5rem;
    color: var(--color-brown);
    font-weight: bold;
  }

  .logo:hover { color: var(--color-terracotta); }

  .nav {
    display: flex;
    gap: 2rem;
  }

  .nav-link {
    color: var(--color-text-light);
    font-size: 0.95rem;
    font-weight: 500;
    padding: 0.25rem 0;
    border-bottom: 2px solid transparent;
  }

  .nav-link:hover,
  .nav-link.active {
    color: var(--color-brown);
    border-bottom-color: var(--color-terracotta);
  }

  .menu-toggle {
    display: none;
    flex-direction: column;
    gap: 5px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
  }

  .menu-toggle span {
    display: block;
    width: 24px;
    height: 2px;
    background: var(--color-brown);
    transition: transform 0.3s;
  }

  @media (max-width: 768px) {
    .menu-toggle { display: flex; }

    .nav {
      display: none;
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: var(--color-white);
      flex-direction: column;
      padding: 1rem 1.5rem;
      gap: 0.5rem;
      border-bottom: 1px solid var(--color-border);
    }

    .nav.open { display: flex; }
  }
</style>

<script>
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  toggle?.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    nav?.classList.toggle('open');
  });
</script>
```

**Step 2: Create Footer**

Create `src/components/Footer.astro`:

```astro
---
const year = new Date().getFullYear();
---

<footer class="footer">
  <div class="container footer-inner">
    <p class="footer-brand">Truffle Pup</p>
    <p class="footer-tagline">Lagotto Romagnolo Breeder & Training Resource</p>
    <p class="footer-copy">&copy; {year} Truffle Pup. All rights reserved.</p>
  </div>
</footer>

<style>
  .footer {
    background: var(--color-brown);
    color: var(--color-cream);
    text-align: center;
    padding: 2.5rem 1.5rem;
    margin-top: 4rem;
  }

  .footer-brand {
    font-family: var(--font-heading);
    font-size: 1.25rem;
    margin-bottom: 0.25rem;
  }

  .footer-tagline {
    font-size: 0.9rem;
    opacity: 0.8;
    margin-bottom: 1rem;
  }

  .footer-copy {
    font-size: 0.8rem;
    opacity: 0.6;
  }
</style>
```

**Step 3: Add Header and Footer to BaseLayout**

In `src/layouts/BaseLayout.astro`, add imports at top of frontmatter:

```astro
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
```

And wrap the slot:

```html
<body>
  <Header />
  <main>
    <slot />
  </main>
  <Footer />
</body>
```

**Step 4: Verify dev server**

Run: `npm run dev`
Expected: Header with nav and footer visible

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add header with mobile nav and footer components"
```

---

### Task 5: Homepage

**Files:**
- Modify: `src/pages/index.astro`
- Create: `src/components/PuppyCard.astro`
- Create: `src/components/BlogCard.astro`

**Step 1: Create PuppyCard component**

Create `src/components/PuppyCard.astro`:

```astro
---
interface Props {
  name: string;
  image: string;
  status: 'available' | 'reserved' | 'sold';
  sex: string;
  color: string;
  slug: string;
}

const { name, image, status, sex, color, slug } = Astro.props;

const statusColors = {
  available: 'var(--color-olive)',
  reserved: 'var(--color-terracotta)',
  sold: 'var(--color-text-light)',
};
---

<a href={`/puppies/${slug}`} class="puppy-card">
  <div class="puppy-image">
    <img src={image} alt={`${name} - ${color} Lagotto Romagnolo`} loading="lazy" />
    <span class="status-badge" style={`background: ${statusColors[status]}`}>
      {status}
    </span>
  </div>
  <div class="puppy-info">
    <h3>{name}</h3>
    <p>{sex} &middot; {color}</p>
  </div>
</a>

<style>
  .puppy-card {
    display: block;
    background: var(--color-white);
    border-radius: 12px;
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
    text-decoration: none;
  }

  .puppy-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(92, 61, 46, 0.12);
  }

  .puppy-image {
    position: relative;
    aspect-ratio: 4/3;
    overflow: hidden;
    background: var(--color-border);
  }

  .puppy-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .status-badge {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    color: white;
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.25rem 0.75rem;
    border-radius: 999px;
    text-transform: capitalize;
  }

  .puppy-info {
    padding: 1rem;
  }

  .puppy-info h3 {
    font-size: 1.15rem;
    margin-bottom: 0.25rem;
  }

  .puppy-info p {
    font-size: 0.9rem;
    color: var(--color-text-light);
    text-transform: capitalize;
  }
</style>
```

**Step 2: Create BlogCard component**

Create `src/components/BlogCard.astro`:

```astro
---
interface Props {
  title: string;
  excerpt: string;
  date: Date;
  slug: string;
  image?: string;
  tags?: string[];
}

const { title, excerpt, date, slug, image, tags = [] } = Astro.props;

const formattedDate = date.toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
---

<a href={`/blog/${slug}`} class="blog-card">
  {image && (
    <div class="blog-image">
      <img src={image} alt={title} loading="lazy" />
    </div>
  )}
  <div class="blog-info">
    <time datetime={date.toISOString()}>{formattedDate}</time>
    <h3>{title}</h3>
    <p>{excerpt}</p>
    {tags.length > 0 && (
      <div class="tags">
        {tags.map(tag => <span class="tag">{tag}</span>)}
      </div>
    )}
  </div>
</a>

<style>
  .blog-card {
    display: block;
    background: var(--color-white);
    border-radius: 12px;
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
    text-decoration: none;
  }

  .blog-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(92, 61, 46, 0.12);
  }

  .blog-image {
    aspect-ratio: 16/9;
    overflow: hidden;
    background: var(--color-border);
  }

  .blog-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .blog-info {
    padding: 1.25rem;
  }

  .blog-info time {
    font-size: 0.8rem;
    color: var(--color-text-light);
  }

  .blog-info h3 {
    font-size: 1.15rem;
    margin: 0.5rem 0;
  }

  .blog-info p {
    font-size: 0.9rem;
    color: var(--color-text-light);
    line-height: 1.5;
  }

  .tags {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-top: 0.75rem;
  }

  .tag {
    font-size: 0.75rem;
    background: var(--color-cream);
    color: var(--color-olive);
    padding: 0.2rem 0.6rem;
    border-radius: 999px;
  }
</style>
```

**Step 3: Build the Homepage**

Replace `src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import PuppyCard from '../components/PuppyCard.astro';
import BlogCard from '../components/BlogCard.astro';
import { getCollection } from 'astro:content';

const allPuppies = await getCollection('puppies');
const featuredPuppies = allPuppies
  .filter(p => p.data.status === 'available')
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
  .slice(0, 3);

const allPosts = await getCollection('blog');
const latestPosts = allPosts
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
  .slice(0, 3);
---

<BaseLayout title="Home">
  <!-- Hero -->
  <section class="hero">
    <div class="container hero-content">
      <h1>Lagotto Romagnolo Puppies</h1>
      <p>Raised with love in a family environment. Bred for health, temperament, and the joy they bring.</p>
      <div class="hero-cta">
        <a href="/puppies" class="btn btn-primary">Meet Our Puppies</a>
        <a href="/contact" class="btn btn-secondary">Inquire</a>
      </div>
    </div>
  </section>

  <!-- Breed Intro -->
  <section class="section">
    <div class="container">
      <h2 class="section-title">The Lagotto Romagnolo</h2>
      <p class="section-intro">
        Italy's truffle-hunting water dog — intelligent, affectionate, and hypoallergenic.
        Lagotti are loyal companions with a natural love for learning and an irresistible curly coat.
      </p>
    </div>
  </section>

  <!-- Featured Puppies -->
  {featuredPuppies.length > 0 && (
    <section class="section">
      <div class="container">
        <h2 class="section-title">Available Puppies</h2>
        <div class="grid grid-3">
          {featuredPuppies.map(puppy => (
            <PuppyCard
              name={puppy.data.name}
              image={puppy.data.image}
              status={puppy.data.status}
              sex={puppy.data.sex}
              color={puppy.data.color}
              slug={puppy.id}
            />
          ))}
        </div>
        <p class="section-cta"><a href="/puppies">View all puppies &rarr;</a></p>
      </div>
    </section>
  )}

  <!-- Latest Blog Posts -->
  {latestPosts.length > 0 && (
    <section class="section section-alt">
      <div class="container">
        <h2 class="section-title">Training & Tips</h2>
        <div class="grid grid-3">
          {latestPosts.map(post => (
            <BlogCard
              title={post.data.title}
              excerpt={post.data.excerpt}
              date={post.data.date}
              slug={post.id}
              image={post.data.image}
              tags={post.data.tags}
            />
          ))}
        </div>
        <p class="section-cta"><a href="/blog">Read more articles &rarr;</a></p>
      </div>
    </section>
  )}

  <!-- CTA -->
  <section class="section cta-section">
    <div class="container" style="text-align: center;">
      <h2>Interested in a Truffle Pup?</h2>
      <p>We'd love to hear from you. Reach out to learn about upcoming litters and availability.</p>
      <a href="/contact" class="btn btn-primary">Get in Touch</a>
    </div>
  </section>
</BaseLayout>

<style>
  .hero {
    background: var(--color-brown);
    color: var(--color-cream);
    padding: 6rem 0 5rem;
    text-align: center;
  }

  .hero h1 {
    color: var(--color-cream);
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .hero p {
    font-size: 1.2rem;
    opacity: 0.9;
    max-width: 600px;
    margin: 0 auto 2rem;
  }

  .hero-cta {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .btn {
    display: inline-block;
    padding: 0.75rem 2rem;
    border-radius: 8px;
    font-weight: 600;
    font-size: 1rem;
    transition: background 0.2s, transform 0.2s;
  }

  .btn:hover { transform: translateY(-2px); }

  .btn-primary {
    background: var(--color-terracotta);
    color: white;
  }

  .btn-primary:hover { background: var(--color-terracotta-light); color: white; }

  .btn-secondary {
    background: transparent;
    color: var(--color-cream);
    border: 2px solid var(--color-cream);
  }

  .btn-secondary:hover { background: rgba(255,255,255,0.1); color: var(--color-cream); }

  .section {
    padding: 4rem 0;
  }

  .section-alt {
    background: var(--color-white);
  }

  .section-title {
    text-align: center;
    margin-bottom: 1rem;
  }

  .section-intro {
    text-align: center;
    max-width: 700px;
    margin: 0 auto;
    font-size: 1.1rem;
    color: var(--color-text-light);
  }

  .section-cta {
    text-align: center;
    margin-top: 2rem;
    font-weight: 500;
  }

  .grid {
    display: grid;
    gap: 1.5rem;
    margin-top: 2rem;
  }

  .grid-3 {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    .hero h1 { font-size: 2rem; }
    .grid-3 { grid-template-columns: 1fr; }
  }

  .cta-section {
    padding: 4rem 0;
  }

  .cta-section h2 { margin-bottom: 0.75rem; }
  .cta-section p {
    color: var(--color-text-light);
    margin-bottom: 1.5rem;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }
</style>
```

**Step 4: Verify dev server**

Run: `npm run dev`
Expected: Homepage renders with hero, sections, sample puppy card, sample blog card

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add homepage with PuppyCard and BlogCard components"
```

---

### Task 6: About Page

**Files:**
- Create: `src/pages/about.astro`

**Step 1: Create About page**

Create `src/pages/about.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout
  title="About"
  description="Learn about our Lagotto Romagnolo breeding program, our philosophy, and our commitment to raising healthy puppies."
>
  <section class="page-header">
    <div class="container">
      <h1>About Truffle Pup</h1>
    </div>
  </section>

  <section class="section">
    <div class="content">
      <h2>Our Story</h2>
      <p>
        We are a small, family-based Lagotto Romagnolo breeder dedicated to preserving the breed's
        wonderful characteristics — their intelligence, loyalty, and gentle nature.
      </p>
      <p>
        Our dogs are raised in our home as part of the family. Every puppy receives early
        socialization, exposure to various environments, and the foundation for a well-adjusted life
        with their new families.
      </p>

      <h2>Our Philosophy</h2>
      <p>
        We believe in quality over quantity. Our breeding decisions are guided by health, temperament,
        and breed standard. Every parent is health-tested, and we stand behind the puppies we produce.
      </p>

      <h2>Health Testing</h2>
      <p>
        All our breeding dogs undergo comprehensive health testing including hip and elbow evaluations,
        eye examinations, and genetic testing for breed-specific conditions. We are committed to
        producing the healthiest puppies possible.
      </p>

      <h2>Why Lagotto Romagnolo?</h2>
      <p>
        The Lagotto Romagnolo is a remarkable breed — originally bred as a water retriever in Italy,
        they became famous as truffle hunters. Today, they make exceptional family companions.
        Their hypoallergenic, curly coat and moderate size make them well-suited for many lifestyles.
      </p>
    </div>
  </section>
</BaseLayout>

<style>
  .page-header {
    background: var(--color-brown);
    color: var(--color-cream);
    padding: 4rem 0;
    text-align: center;
  }

  .page-header h1 {
    color: var(--color-cream);
  }

  .content h2 {
    margin-top: 2.5rem;
    margin-bottom: 0.75rem;
  }

  .content h2:first-child {
    margin-top: 0;
  }

  .content p {
    margin-bottom: 1rem;
    color: var(--color-text-light);
  }
</style>
```

**Step 2: Verify page**

Run: `npm run dev`, navigate to `/about`
Expected: About page renders with content

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add about page"
```

---

### Task 7: Puppies Listing and Detail Pages

**Files:**
- Create: `src/pages/puppies/index.astro`
- Create: `src/pages/puppies/[slug].astro`

**Step 1: Create puppies listing page**

Create `src/pages/puppies/index.astro`:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import PuppyCard from '../../components/PuppyCard.astro';
import { getCollection } from 'astro:content';

const allPuppies = await getCollection('puppies');
const available = allPuppies.filter(p => p.data.status === 'available').sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
const reserved = allPuppies.filter(p => p.data.status === 'reserved');
const sold = allPuppies.filter(p => p.data.status === 'sold');
---

<BaseLayout
  title="Puppies"
  description="Browse our available Lagotto Romagnolo puppies. Each puppy is raised in a family environment with early socialization."
>
  <section class="page-header">
    <div class="container">
      <h1>Our Puppies</h1>
      <p>Each puppy is raised with love, early socialization, and a strong foundation for life.</p>
    </div>
  </section>

  <section class="section">
    <div class="container">
      {available.length > 0 && (
        <>
          <h2>Available</h2>
          <div class="grid grid-3">
            {available.map(puppy => (
              <PuppyCard
                name={puppy.data.name}
                image={puppy.data.image}
                status={puppy.data.status}
                sex={puppy.data.sex}
                color={puppy.data.color}
                slug={puppy.id}
              />
            ))}
          </div>
        </>
      )}

      {reserved.length > 0 && (
        <>
          <h2 class="mt-3">Reserved</h2>
          <div class="grid grid-3">
            {reserved.map(puppy => (
              <PuppyCard
                name={puppy.data.name}
                image={puppy.data.image}
                status={puppy.data.status}
                sex={puppy.data.sex}
                color={puppy.data.color}
                slug={puppy.id}
              />
            ))}
          </div>
        </>
      )}

      {sold.length > 0 && (
        <>
          <h2 class="mt-3">Past Puppies</h2>
          <div class="grid grid-3">
            {sold.map(puppy => (
              <PuppyCard
                name={puppy.data.name}
                image={puppy.data.image}
                status={puppy.data.status}
                sex={puppy.data.sex}
                color={puppy.data.color}
                slug={puppy.id}
              />
            ))}
          </div>
        </>
      )}

      {allPuppies.length === 0 && (
        <p class="empty-state">No puppies listed yet. Check back soon!</p>
      )}
    </div>
  </section>
</BaseLayout>

<style>
  .page-header {
    background: var(--color-brown);
    color: var(--color-cream);
    padding: 4rem 0;
    text-align: center;
  }

  .page-header h1 { color: var(--color-cream); }
  .page-header p { opacity: 0.9; margin-top: 0.5rem; }

  .grid {
    display: grid;
    gap: 1.5rem;
    margin-top: 1.5rem;
  }

  .grid-3 { grid-template-columns: repeat(3, 1fr); }

  .mt-3 { margin-top: 3rem; }

  .empty-state {
    text-align: center;
    color: var(--color-text-light);
    padding: 3rem 0;
  }

  @media (max-width: 768px) {
    .grid-3 { grid-template-columns: 1fr; }
  }
</style>
```

**Step 2: Create puppy detail page**

Create `src/pages/puppies/[slug].astro`:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const puppies = await getCollection('puppies');
  return puppies.map(puppy => ({
    params: { slug: puppy.id },
    props: { puppy },
  }));
}

const { puppy } = Astro.props;
const { Content } = await render(puppy);

const birthFormatted = puppy.data.birthDate.toLocaleDateString('en-US', {
  year: 'numeric', month: 'long', day: 'numeric',
});

const statusColors = {
  available: 'var(--color-olive)',
  reserved: 'var(--color-terracotta)',
  sold: 'var(--color-text-light)',
};
---

<BaseLayout
  title={puppy.data.name}
  description={`${puppy.data.name} - ${puppy.data.color} ${puppy.data.sex} Lagotto Romagnolo puppy. ${puppy.data.status}.`}
  image={puppy.data.image}
>
  <section class="page-header">
    <div class="container">
      <h1>{puppy.data.name}</h1>
      <span class="status" style={`background: ${statusColors[puppy.data.status]}`}>
        {puppy.data.status}
      </span>
    </div>
  </section>

  <section class="section">
    <div class="content">
      <div class="puppy-main-image">
        <img src={puppy.data.image} alt={`${puppy.data.name} - Lagotto Romagnolo`} />
      </div>

      <div class="details">
        <div class="detail"><strong>Sex:</strong> {puppy.data.sex}</div>
        <div class="detail"><strong>Color:</strong> {puppy.data.color}</div>
        <div class="detail"><strong>Born:</strong> {birthFormatted}</div>
        <div class="detail"><strong>Status:</strong> {puppy.data.status}</div>
      </div>

      {puppy.data.gallery.length > 0 && (
        <div class="gallery">
          {puppy.data.gallery.map((img: string) => (
            <img src={img} alt={`${puppy.data.name} photo`} loading="lazy" />
          ))}
        </div>
      )}

      <div class="puppy-description">
        <Content />
      </div>

      {puppy.data.status === 'available' && (
        <div class="inquiry-cta">
          <p>Interested in {puppy.data.name}?</p>
          <a href={`mailto:leave117@gmail.com?subject=Inquiry about ${puppy.data.name}`} class="btn btn-primary">
            Send Inquiry
          </a>
        </div>
      )}

      <a href="/puppies" class="back-link">&larr; Back to all puppies</a>
    </div>
  </section>
</BaseLayout>

<style>
  .page-header {
    background: var(--color-brown);
    color: var(--color-cream);
    padding: 4rem 0;
    text-align: center;
  }

  .page-header h1 { color: var(--color-cream); margin-bottom: 0.75rem; }

  .status {
    display: inline-block;
    color: white;
    font-size: 0.85rem;
    font-weight: 600;
    padding: 0.3rem 1rem;
    border-radius: 999px;
    text-transform: capitalize;
  }

  .puppy-main-image {
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 2rem;
  }

  .details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    padding: 1.5rem;
    background: var(--color-white);
    border-radius: 12px;
    margin-bottom: 2rem;
  }

  .detail {
    font-size: 0.95rem;
    text-transform: capitalize;
  }

  .gallery {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .gallery img {
    border-radius: 8px;
    aspect-ratio: 4/3;
    object-fit: cover;
    width: 100%;
  }

  .puppy-description {
    margin-bottom: 2rem;
    color: var(--color-text-light);
    line-height: 1.8;
  }

  .inquiry-cta {
    text-align: center;
    padding: 2rem;
    background: var(--color-white);
    border-radius: 12px;
    margin-bottom: 2rem;
  }

  .inquiry-cta p {
    margin-bottom: 1rem;
    font-size: 1.1rem;
  }

  .btn-primary {
    display: inline-block;
    background: var(--color-terracotta);
    color: white;
    padding: 0.75rem 2rem;
    border-radius: 8px;
    font-weight: 600;
  }

  .btn-primary:hover { background: var(--color-terracotta-light); color: white; }

  .back-link {
    display: inline-block;
    color: var(--color-text-light);
    font-size: 0.9rem;
  }

  @media (max-width: 768px) {
    .details { grid-template-columns: 1fr; }
    .gallery { grid-template-columns: 1fr; }
  }
</style>
```

**Step 3: Verify pages**

Run: `npm run dev`
Check `/puppies` and `/puppies/sample-puppy`
Expected: Listing page shows Luna card, detail page shows full info

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add puppies listing and detail pages"
```

---

### Task 8: Blog Listing and Post Pages

**Files:**
- Create: `src/pages/blog/index.astro`
- Create: `src/pages/blog/[slug].astro`

**Step 1: Create blog listing page**

Create `src/pages/blog/index.astro`:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import BlogCard from '../../components/BlogCard.astro';
import { getCollection } from 'astro:content';

const allPosts = await getCollection('blog');
const posts = allPosts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
---

<BaseLayout
  title="Blog"
  description="Training tips, breed information, and updates about our Lagotto Romagnolo puppies."
>
  <section class="page-header">
    <div class="container">
      <h1>Blog</h1>
      <p>Training tips, breed insights, and life with Lagotto Romagnoli.</p>
    </div>
  </section>

  <section class="section">
    <div class="container">
      {posts.length > 0 ? (
        <div class="grid grid-3">
          {posts.map(post => (
            <BlogCard
              title={post.data.title}
              excerpt={post.data.excerpt}
              date={post.data.date}
              slug={post.id}
              image={post.data.image}
              tags={post.data.tags}
            />
          ))}
        </div>
      ) : (
        <p class="empty-state">No posts yet. Check back soon!</p>
      )}
    </div>
  </section>
</BaseLayout>

<style>
  .page-header {
    background: var(--color-brown);
    color: var(--color-cream);
    padding: 4rem 0;
    text-align: center;
  }

  .page-header h1 { color: var(--color-cream); }
  .page-header p { opacity: 0.9; margin-top: 0.5rem; }

  .grid {
    display: grid;
    gap: 1.5rem;
  }

  .grid-3 { grid-template-columns: repeat(3, 1fr); }

  .empty-state {
    text-align: center;
    color: var(--color-text-light);
    padding: 3rem 0;
  }

  @media (max-width: 768px) {
    .grid-3 { grid-template-columns: 1fr; }
  }
</style>
```

**Step 2: Create blog post detail page**

Create `src/pages/blog/[slug].astro`:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { slug: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);

const formattedDate = post.data.date.toLocaleDateString('en-US', {
  year: 'numeric', month: 'long', day: 'numeric',
});
---

<BaseLayout
  title={post.data.title}
  description={post.data.excerpt}
  image={post.data.image}
  type="article"
>
  <article>
    <section class="page-header">
      <div class="container">
        <time datetime={post.data.date.toISOString()}>{formattedDate}</time>
        <h1>{post.data.title}</h1>
        {post.data.tags.length > 0 && (
          <div class="tags">
            {post.data.tags.map((tag: string) => <span class="tag">{tag}</span>)}
          </div>
        )}
      </div>
    </section>

    {post.data.image && (
      <div class="hero-image container">
        <img src={post.data.image} alt={post.data.title} />
      </div>
    )}

    <section class="section">
      <div class="content prose">
        <Content />
      </div>
    </section>

    <section class="section">
      <div class="content cta-box">
        <p>Have questions about training your Lagotto?</p>
        <a href="mailto:leave117@gmail.com?subject=Question about training" class="btn btn-primary">
          Get in Touch
        </a>
      </div>
    </section>

    <div class="content">
      <a href="/blog" class="back-link">&larr; Back to all posts</a>
    </div>
  </article>
</BaseLayout>

<style>
  .page-header {
    background: var(--color-brown);
    color: var(--color-cream);
    padding: 4rem 0;
    text-align: center;
  }

  .page-header h1 {
    color: var(--color-cream);
    max-width: 800px;
    margin: 0.5rem auto 0;
  }

  .page-header time {
    font-size: 0.9rem;
    opacity: 0.8;
  }

  .tags {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    margin-top: 1rem;
  }

  .tag {
    font-size: 0.75rem;
    background: rgba(255,255,255,0.15);
    color: var(--color-cream);
    padding: 0.2rem 0.75rem;
    border-radius: 999px;
  }

  .hero-image {
    margin-top: -2rem;
    margin-bottom: 2rem;
    max-width: var(--content-width);
  }

  .hero-image img {
    border-radius: 12px;
    width: 100%;
  }

  .prose {
    font-size: 1.05rem;
    line-height: 1.8;
  }

  .prose :global(h2) { margin-top: 2rem; margin-bottom: 0.75rem; }
  .prose :global(h3) { margin-top: 1.5rem; margin-bottom: 0.5rem; }
  .prose :global(p) { margin-bottom: 1rem; }
  .prose :global(ul), .prose :global(ol) { margin-bottom: 1rem; padding-left: 1.5rem; }
  .prose :global(li) { margin-bottom: 0.25rem; }
  .prose :global(blockquote) {
    border-left: 3px solid var(--color-terracotta);
    padding-left: 1rem;
    color: var(--color-text-light);
    margin: 1.5rem 0;
  }

  .cta-box {
    text-align: center;
    padding: 2rem;
    background: var(--color-white);
    border-radius: 12px;
  }

  .cta-box p { margin-bottom: 1rem; }

  .btn-primary {
    display: inline-block;
    background: var(--color-terracotta);
    color: white;
    padding: 0.75rem 2rem;
    border-radius: 8px;
    font-weight: 600;
  }

  .btn-primary:hover { background: var(--color-terracotta-light); color: white; }

  .back-link {
    display: inline-block;
    color: var(--color-text-light);
    font-size: 0.9rem;
    margin-top: 1rem;
    margin-bottom: 2rem;
  }
</style>
```

**Step 3: Verify pages**

Run: `npm run dev`
Check `/blog` and `/blog/welcome`
Expected: Blog listing with welcome post card, blog post renders with full content

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add blog listing and post detail pages"
```

---

### Task 9: Contact Page

**Files:**
- Create: `src/pages/contact.astro`

**Step 1: Create contact page**

Create `src/pages/contact.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout
  title="Contact"
  description="Get in touch about our Lagotto Romagnolo puppies. We'd love to hear from you."
>
  <section class="page-header">
    <div class="container">
      <h1>Contact Us</h1>
      <p>Interested in our puppies or have questions? We'd love to hear from you.</p>
    </div>
  </section>

  <section class="section">
    <div class="content">
      <div class="contact-card">
        <h2>Get in Touch</h2>
        <p>
          Whether you're interested in one of our available puppies, have questions about the breed,
          or want to learn about upcoming litters, don't hesitate to reach out.
        </p>
        <a href="mailto:leave117@gmail.com?subject=Puppy Inquiry" class="btn btn-primary">
          Email Us
        </a>
        <p class="email-direct">
          Or email directly: <a href="mailto:leave117@gmail.com">leave117@gmail.com</a>
        </p>
      </div>

      <div class="info-section">
        <h2>What to Include</h2>
        <ul>
          <li>A bit about yourself and your household</li>
          <li>Your experience with dogs</li>
          <li>What you're looking for in a Lagotto</li>
          <li>Any questions you have about the breed or our program</li>
        </ul>
      </div>
    </div>
  </section>
</BaseLayout>

<style>
  .page-header {
    background: var(--color-brown);
    color: var(--color-cream);
    padding: 4rem 0;
    text-align: center;
  }

  .page-header h1 { color: var(--color-cream); }
  .page-header p { opacity: 0.9; margin-top: 0.5rem; }

  .contact-card {
    background: var(--color-white);
    padding: 2.5rem;
    border-radius: 12px;
    text-align: center;
    margin-bottom: 2rem;
  }

  .contact-card h2 { margin-bottom: 1rem; }

  .contact-card p {
    color: var(--color-text-light);
    max-width: 500px;
    margin: 0 auto 1.5rem;
  }

  .btn-primary {
    display: inline-block;
    background: var(--color-terracotta);
    color: white;
    padding: 0.75rem 2rem;
    border-radius: 8px;
    font-weight: 600;
    font-size: 1.05rem;
  }

  .btn-primary:hover { background: var(--color-terracotta-light); color: white; }

  .email-direct {
    margin-top: 1.5rem;
    font-size: 0.9rem;
  }

  .info-section {
    background: var(--color-white);
    padding: 2rem 2.5rem;
    border-radius: 12px;
  }

  .info-section h2 { margin-bottom: 1rem; }

  .info-section ul {
    padding-left: 1.25rem;
    color: var(--color-text-light);
  }

  .info-section li {
    margin-bottom: 0.5rem;
  }
</style>
```

**Step 2: Verify page**

Run: `npm run dev`, navigate to `/contact`
Expected: Contact page with mailto button and info

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add contact page with mailto link"
```

---

### Task 10: JSON-LD Structured Data

**Files:**
- Create: `src/components/JsonLd.astro`
- Modify: `src/pages/index.astro` (add LocalBusiness schema)
- Modify: `src/pages/blog/[slug].astro` (add Article schema)
- Modify: `src/pages/puppies/[slug].astro` (add Product schema)

**Step 1: Create JsonLd helper component**

Create `src/components/JsonLd.astro`:

```astro
---
interface Props {
  data: Record<string, unknown>;
}

const { data } = Astro.props;
---

<script type="application/ld+json" set:html={JSON.stringify(data)} />
```

**Step 2: Add LocalBusiness schema to homepage**

In `src/pages/index.astro`, import JsonLd and add inside BaseLayout after the opening tag:

```astro
import JsonLd from '../components/JsonLd.astro';
```

```html
<JsonLd data={{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Truffle Pup",
  "description": "Lagotto Romagnolo breeder and training resource.",
  "url": Astro.site,
}} />
```

**Step 3: Add Article schema to blog posts**

In `src/pages/blog/[slug].astro`, import JsonLd and add inside BaseLayout:

```astro
import JsonLd from '../../components/JsonLd.astro';
```

```html
<JsonLd data={{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": post.data.title,
  "description": post.data.excerpt,
  "datePublished": post.data.date.toISOString(),
  "author": { "@type": "Organization", "name": "Truffle Pup" },
}} />
```

**Step 4: Add Product schema to puppy pages**

In `src/pages/puppies/[slug].astro`, import JsonLd and add inside BaseLayout:

```astro
import JsonLd from '../../components/JsonLd.astro';
```

```html
<JsonLd data={{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": `${puppy.data.name} - Lagotto Romagnolo Puppy`,
  "description": `${puppy.data.color} ${puppy.data.sex} Lagotto Romagnolo puppy.`,
  "image": puppy.data.image,
}} />
```

**Step 5: Verify build**

Run: `npm run build`
Expected: Build succeeds, JSON-LD present in HTML output

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: add JSON-LD structured data for SEO"
```

---

### Task 11: Robots.txt and Final Build Verification

**Files:**
- Create: `public/robots.txt`

**Step 1: Create robots.txt**

Create `public/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://chchannn.github.io/truffle-pup/sitemap-index.xml
```

**Step 2: Full build verification**

Run: `npm run build`
Expected: Build succeeds, `dist/` contains all pages, sitemap generated

**Step 3: Preview locally**

Run: `npm run preview`
Expected: Site works at localhost:4321, all pages accessible, navigation works

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add robots.txt and verify production build"
```

---

### Task 12: GitHub Pages Deployment Setup

**Files:**
- Create: `.github/workflows/deploy.yml`

**Step 1: Create GitHub Actions workflow**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

**Step 2: Commit**

```bash
git add -A
git commit -m "feat: add GitHub Actions workflow for Pages deployment"
```

**Step 3: Push to GitHub**

```bash
git push -u origin main
```

Then enable GitHub Pages in repo settings: Settings > Pages > Source: GitHub Actions.

---
