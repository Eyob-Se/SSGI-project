import { Router } from "express";
import sequelize from "../models/db.js";
import { QueryTypes } from "sequelize";

const router = Router();

// Serve first_order as GeoJSON with geometry transformed to EPSG:3857
router.get("/", async (req, res) => {
  try {
    const result = await sequelize.query(
      `SELECT ogc_fid, id, station_id, town_name, region,
              zone, obsrvation, easting__w, norting__w, field9,
              ST_AsGeoJSON(ST_Transform(wkb_geometry, 4326)) as geometry
       FROM first_order`,
      { type: QueryTypes.SELECT }
    );

    const geojson = {
      type: "FeatureCollection",
      features: result.map((row) => ({
        type: "Feature",
        geometry: JSON.parse(row.geometry), // Parsed GeoJSON geometry
        properties: {
          ogc_fid: row.ogc_fid,
          id: row.id,
          station_id: row.station_id,
          town_name: row.town_name,
          region: row.region,
          zone: row.zone,
          obsrvation: row.obsrvation,
          easting__w: row.easting__w,
          norting__w: row.norting__w,
        },
      })),
    };

    res.json(geojson);
  } catch (error) {
    console.error("Error fetching first_order:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

export default router;
