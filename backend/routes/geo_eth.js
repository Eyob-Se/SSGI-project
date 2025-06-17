import { Router } from "express";
import sequelize from "../models/db.js";
import { QueryTypes } from "sequelize";

const router = Router();

// Serve eth_boundary as GeoJSON
router.get("/", async (req, res) => {
  try {
    const result = await sequelize.query(
      `SELECT *, ST_AsGeoJSON(wkb_geometry) as geometry FROM eth_boundary;`,
      { type: QueryTypes.SELECT }
    );

    const geojson = {
      type: "FeatureCollection",
      features: result.map((row) => {
        // Parse geometry and prepare properties
        const { geometry, ...properties } = row; // Destructure geometry and other properties
        return {
          type: "Feature",
          geometry: JSON.parse(geometry), // Parse GeoJSON string
          properties: properties, // Use the rest of the columns as properties
        };
      }),
    };

    res.json(geojson);
  } catch (error) {
    console.error("Error fetching eth_boundary:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

export default router;
