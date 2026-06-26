# WB Official Boundaries (subset for the irrigation map)

Source: World Bank - Global Administrative Divisions (WB GAD), public ArcGIS
Feature Service `WB_GAD_Medium_Resolution` (owner kdanaher_wbv), the public
distribution of the **World Bank Official Boundaries** dataset (Data Catalog
0038272, Version 2, 2026-06-12). License: CC BY 4.0.

Layers pulled (generalized, then simplified with mapshaper for a z0-4 global map):
- `adm0.geojson`      - WB_GAD_ADM0 polygons (land fill). mapshaper -simplify 8% keep-shapes.
- `adm0_lines.geojson`- WB_GAD_ADM0_Bdys polylines, with `Style` (None=definite,
                        Dashed/Dotted/Tightly Dashed=indefinite/disputed treatment).
- `disputes.geojson`  - WB_GAD_Disputes polygons (NDLSA / disputed areas), with NAM_0.

Refresh: re-query the FeatureServer (see scripts) if WB GAD publishes a new version.
