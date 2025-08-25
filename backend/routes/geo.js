import { Router } from "express";
import sequelize from "../models/db.js";
import { QueryTypes } from "sequelize";

const router = Router();
// Serve zero order as GeoJSON
router.get("/", async (req, res) => {
  try {
    const result = await sequelize.query(
      `SELECT ogc_fid, no, id, easting, northing, zone,
      location, region, ST_AsGeoJSON(ST_Transform(wkb_geometry, 4326)) as geometry FROM zero_order`,
      { type: QueryTypes.SELECT }
    );

    const geojson = {
      type: "FeatureCollection",
      features: result.map((row) => ({
        type: "Feature",
        geometry: JSON.parse(row.geometry), // geometry is a JSON string here
        properties: {
          ogc_fid: row.ogc_fid,
          no: row.no,
          id: row.id,
          easting: row.easting,
          northing: row.northing,
          zone: row.zone,
          location: row.location,
          region: row.region,
        },
      })),
    };

    res.json(geojson);
  } catch (error) {
    console.error("Error fetching zero_order:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

export default router;
