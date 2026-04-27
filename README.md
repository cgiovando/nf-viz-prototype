# Nourish and Flourish - Visualization Prototypes

Prototype interactive visualizations for the World Bank Water GP **Nourish and Flourish** flagship report (*Water Solutions to Feed 10 Billion People on a Livable Planet*, World Bank 2025).

These pages are designed to be embedded as iframes inside an ArcGIS StoryMap. Each viz is a standalone static HTML page hosted on GitHub Pages.

## Live URLs

- **Gallery (this site):** https://cgiovando.github.io/nf-viz-prototype/
- **Hero - 2x2 water-food nexus:** https://cgiovando.github.io/nf-viz-prototype/viz/quadrant-2x2.html

## Source report

- Published: https://openknowledge.worldbank.org/entities/publication/2807ed57-114f-42f9-b455-12625354383c
- Authors: Amal Talby (TTL) and team, World Bank Water GP
- Data: FAOSTAT (FBS), WRI Aqueduct, GTAP MRIO 2017 (Taheripour and Chepeliev)

## Visualizations

| Slot | Page | Status |
|---|---|---|
| 3A | `viz/quadrant-2x2.html` - HERO 2x2 country scatter | in progress |
| 1B | `viz/food-water-map.html` - food x water world map | planned |
| 2B | `viz/vw-shares.html` - green/blue virtual water shares | planned |
| 3B | `viz/quadrant-map.html` - quadrant choropleth | planned |
| 3C | `viz/water-stress-trajectory.html` - future stress fan chart | planned |
| 5B | `viz/investment-gap.html` - investment gap waffle | planned |

## Data

Pre-cleaned data from the report's dashboard files lives in `data/`. See `data/schema.md` for the full column reference and an important sign-convention warning.

- `data/countries_2x2.json` - 186 countries with valid water stress + net food trade + population (the rows the 2x2 hero plots)
- `data/dashboard.json` - all 251 source rows with all 34 columns
- `data/schema.md` - column reference

## Local development

These are static pages with no build step. Open `index.html` in a browser, or:

```
python3 -m http.server 8000
# then visit http://localhost:8000
```

## AI-assisted development

> This project was developed with significant assistance from AI coding tools.

- **[Claude Code](https://claude.ai/claude-code)** (Anthropic) - code generation, architecture, debugging, and documentation
- All functionality has been tested and verified to work as intended
- Features and infrastructure choices have been reviewed and approved by the maintainer

This disclosure follows emerging best practices for transparency in AI-assisted software development.

## License

Source report content (text, figures, headline statistics) is the work of the World Bank and is referenced under fair use for visualization purposes. Code and visualization design in this repository are MIT licensed.
