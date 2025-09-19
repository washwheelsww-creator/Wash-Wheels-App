// app/components/MapViewBox.js 
import React from 'react';
import MapboxGL from '@rnmapbox/maps'; 
import useGlobalStyles from '../styles/global';
export default function MapViewBox({ region, marker }) { const styles = useGlobalStyles()
return ( <MapboxGL.MapView styleURL={MapboxGL.StyleURL.Street} style={styles.map} > <MapboxGL.Camera centerCoordinate={[region.longitude, region.latitude]} zoomLevel={14} /> {marker && ( <MapboxGL.PointAnnotation id="selected" coordinate={[marker.longitude, marker.latitude]} /> )} </MapboxGL.MapView> ) }
