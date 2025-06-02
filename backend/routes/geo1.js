import { Router } from "express";
const router = Router();
import sequelize from "../models/db.js";
import { QueryTypes } from "sequelize";

// Serve first_order as GeoJSON
router.get("/", async (req, res) => {
  try {
    const result = await sequelize.query(
      `SELECT ogc_fid, id, objectid, sign_type, lat,
      long, remark, ST_AsGeoJSON(wkb_geometry) as geometry FROM first_order`,
      { type: QueryTypes.SELECT }
    );

    const geojson = {
      type: "FeatureCollection",
      features: result.map((row) => ({
        type: "Feature",
        geometry: JSON.parse(row.geometry), // geometry is now a GeoJSON string
        properties: {
          ogc_fid: row.ogc_fid,
          id: row.id,
          objectid: row.objectid,
          sign_type: row.sign_type,
          lat: row.lat,
          long: row.long,
          remark: row.remark,
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
