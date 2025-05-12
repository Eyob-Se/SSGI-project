import { useRef, useEffect } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import OSM from "ol/source/OSM";
import GeoJSON from "ol/format/GeoJSON";
import { Fill, Stroke, Style, Icon, Text } from "ol/style";
import { fromLonLat } from "ol/proj";
import Point from "ol/geom/Point";
import Feature from "ol/Feature";

const OLMap = () => {
  const mapRef = useRef(null);
  const markerFeatureRef = useRef(null);
  const mapRefInstance = useRef(null); // store map instance for style access

  useEffect(() => {
    const ethiopiaCoords = fromLonLat([39.5, 9.145]);

    // === Marker Feature ===
    const markerFeature = new Feature({
      geometry: new Point(ethiopiaCoords),
      name: "Ethiopia Marker",
    });

    const createMarkerStyle = (showText = true) =>
      new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
          scale: 0.05,
        }),
        text: showText
          ? new Text({
              text: "Discover Ethiopia Like Never Before!",
              font: "bold 16px Arial",
              fill: new Fill({ color: "#1b5e20" }),
              stroke: new Stroke({ color: "#ffffff", width: 2 }),
              offsetY: -35,
            })
          : null,
      });

    markerFeature.setStyle(createMarkerStyle(true));
    markerFeatureRef.current = markerFeature;

    const markerLayer = new VectorLayer({
      source: new VectorSource({
        features: [markerFeature],
      }),
    });

    // === Ethiopia GeoJSON Layer ===
    const ethiopiaSource = new VectorSource({
      url: "/eth_boundary.geojson", // Place in public/ folder
      format: new GeoJSON(),
    });

    const ethiopiaLayer = new VectorLayer({
      source: ethiopiaSource,
      style: () => {
        const zoom = mapRefInstance.current?.getView().getZoom() || 0;
        return new Style({
          fill: new Fill({
            color: zoom >= 8 ? "rgba(0,0,0,0)" : "rgba(170, 185, 170, 0.3)",
          }),
          stroke: new Stroke({
            color: "#006400",
            width: 2,
          }),
        });
      },
    });

    // === Map Initialization ===
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({ source: new OSM() }),
        ethiopiaLayer,
        markerLayer,
      ],
      view: new View({
        center: ethiopiaCoords,
        zoom: 6,
      }),
    });

    mapRefInstance.current = map;

    // === Refresh style on zoom to fade fill ===
    map.getView().on("change:resolution", () => {
      ethiopiaLayer.setStyle(ethiopiaLayer.getStyle());
    });

    // === Click Marker to Zoom and Fade Text ===
    map.on("singleclick", (evt) => {
      map.forEachFeatureAtPixel(evt.pixel, (feature) => {
        if (feature === markerFeatureRef.current) {
          map.getView().animate({
            center: ethiopiaCoords,
            zoom: 8,
            duration: 1000,
          });

          setTimeout(() => {
            markerFeatureRef.current.setStyle(createMarkerStyle(false));
          }, 1000);
        }
      });
    });

    return () => map.setTarget(null);
  }, []);

  return (
    <div
      ref={mapRef}
      className="w-full h-[60vh] min-h-[300px] rounded-2xl overflow-hidden mx-[10rem]  mask-radial"
    />
  );
};

export default OLMap;
