# Dashboard data schema

Source: `Nourish_and_Flourish_Dashboard/Nourish_and_Flourish_Dash_Data.xlsx` sheet `Dashboard_Data`. Extracted by `scripts/extract_dashboard_data.py`.

- `dashboard.json` - 251 rows, all 34 columns (renamed).
- `countries_2x2.json` - 186 rows, only countries with the data needed for the 2x2 hero scatter (water stress, net food trade, population, region, country name, ISO3).

## Columns

| key | source column | meaning |
|---|---|---|
| `fid` | `FID` | |
| `country` | `COUNTRY` | |
| `iso3` | `Countries_Code` | |
| `region` | `Region` | |
| `m49` | `Area Code (M49)` | |
| `export_bkcal` | `Export_Bkcal` | |
| `feed_bkcal` | `Feed_Bkcal` | |
| `food_supply_bkcal` | `FoodSupply_Bkcal` | |
| `import_bkcal` | `Import_Bkcal` | |
| `losses_bkcal` | `Lossess_Bkcal` | |
| `other_uses_non_food` | `Other uses (non-food)` | |
| `production_bkcal` | `Production_Bkcal` | |
| `seed_bkcal` | `Seed_Bkcal` | |
| `food_supply_kcal_per_capita_day` | `Food supply (kcal/capita/day)` | |
| `population` | `Population` | |
| `net_supply_bkcal` | `Production +Import - Export - Other Uses (non-food) - Seed - Feed - Lossess` | |
| `net_export_trillion` | `(Export-Import)_Trillion` | |
| `net_food_imports_pct` | `Net Food Imports (%)` | |
| `water_stress_baseline` | `bws_raw` | |
| `water_stress_bau_2030` | `bau30_ws_x` | |
| `water_stress_bau_2050` | `bau50_ws_x` | |
| `water_stress_bau_2080` | `bau80_ws_x` | |
| `water_stress_opt_2030` | `opt30_ws_x` | |
| `water_stress_opt_2050` | `opt50_ws_x` | |
| `water_stress_opt_2080` | `opt80_ws_x` | |
| `water_stress_pes_2030` | `pes30_ws_x` | |
| `water_stress_pes_2050` | `pes50_ws_x` | |
| `water_stress_pes_2080` | `pes80_ws_x` | |
| `vw_green_import_2019_mcm` | `VW_Green_Import_2019_MCM` | |
| `vw_green_export_2019_mcm` | `VW_Green_Export_2019_MCM` | |
| `vw_blue_import_2019_mcm` | `VW_Blue_Import_2019_MCM` | |
| `vw_blue_export_2019_mcm` | `VW_Blue_Export_2019_MCM` | |
| `vw_total_import_2019_mcm` | `VW_Total_Import_2019_MCM` | |
| `vw_total_export_2019_mcm` | `VW_Total_Export_2019_MCM` | |
| `net_export_pct` | computed | same as `net_food_imports_pct` (positive = net exporter) but unambiguously named |
| `net_imports_pct` | computed | `-net_export_pct`, so positive = net importer (use this on viz y-axis if you want importer at top) |
| `is_importer` | computed | true if `net_export_pct < 0` |
| `is_case_study` | computed | true if ISO3 is one of the 12 case studies with ISO3 (Sahel is regional, excluded) |
| `quadrant` | computed | Q1-Q4 per Figure 3.1 framework. Q1 = water-rich exporter, Q2 = water-stressed exporter, Q3 = water-stressed importer, Q4 = water-rich importer. Thresholds: water stress 40%, net export 0%. |

## Sign convention warning

The source column `Net Food Imports (%)` is misleadingly named in the Excel file. It carries the same sign as `(Exports - Imports) / Production`, i.e. **positive = NET EXPORTER**, negative = net importer. Verified by spot-check (USA, France, Chile = positive / exporters; Jordan, China, Netherlands = negative / importers). Use the derived `net_export_pct` / `net_imports_pct` / `is_importer` fields downstream to avoid confusion.

## Case studies (12 of 13 - Sahel is regional, no single ISO3)

| ISO3 | Country |
|---|---|
| UGA | Uganda |
| MLI | Mali |
| SEN | Senegal |
| IND | India |
| PAK | Pakistan |
| CHN | China |
| CHL | Chile |
| PER | Peru |
| FRA | France |
| ESP | Spain |
| MAR | Morocco |
| JOR | Jordan |