# Graph Report - bmw-showcase  (2026-06-01)

## Corpus Check
- 28 files · ~887,725 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 129 nodes · 113 edges · 19 communities (12 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `dependencies` - 10 edges
3. `devDependencies` - 9 edges
4. `Design System: BMW Showcase` - 8 edges
5. `Product` - 8 edges
6. `scripts` - 5 edges
7. `clsx` - 2 edges
8. `paths` - 2 edges
9. `cn()` - 2 edges
10. `Getting Started` - 2 edges

## Surprising Connections (you probably didn't know these)
- `cn()` --calls--> `clsx`  [INFERRED]
  lib/utils.ts → package.json

## Communities (19 total, 7 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.1
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 2 - "Community 2"
Cohesion: 0.17
Nodes (11): dependencies, clsx, framer-motion, gsap, lenis, lucide-react, next, react (+3 more)

### Community 3 - "Community 3"
Cohesion: 0.22
Nodes (8): 1. Visual Theme & Atmosphere, 2. Color Palette & Roles, 3. Typography Rules, 4. Component Stylings, 5. Layout Principles, 6. Motion & Interaction, 7. Anti-Patterns (Banned), Design System: BMW Showcase

### Community 4 - "Community 4"
Cohesion: 0.22
Nodes (8): name, private, scripts, build, dev, lint, start, version

### Community 5 - "Community 5"
Cohesion: 0.22
Nodes (8): Accessibility & Inclusion, Anti-references, Brand Personality, Design Principles, Product, Product Purpose, Register, Users

### Community 6 - "Community 6"
Cohesion: 0.22
Nodes (9): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node, @types/react, @types/react-dom (+1 more)

### Community 9 - "Community 9"
Cohesion: 0.4
Nodes (4): fs, outputDir, path, puppeteer

### Community 10 - "Community 10"
Cohesion: 0.4
Nodes (4): code:bash (npm run dev), Deploy on Vercel, Getting Started, Learn More

### Community 12 - "Community 12"
Cohesion: 0.4
Nodes (4): commentSyntax, cspChecked, files, insertBefore

## Knowledge Gaps
- **74 isolated node(s):** `puppeteer`, `fs`, `path`, `outputDir`, `eslintConfig` (+69 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Community 2` to `Community 4`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Community 6` to `Community 4`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **What connects `puppeteer`, `fs`, `path` to the rest of the system?**
  _74 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.09 - nodes in this community are weakly interconnected._