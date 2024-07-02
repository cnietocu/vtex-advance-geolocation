import React from 'react'
import {
  GoogleMap,
  Marker,
  withScriptjs,
  withGoogleMap,
} from 'react-google-maps'

const Map = ({ location, setLocation }: any) => {
  const onMarkerDragEnd = (coord: any) => {
    setLocation({ lat: coord.latLng.lat(), lng: coord.latLng.lng() })
  }

  return (
    <GoogleMap
      defaultZoom={15}
      defaultCenter={location}
      center={location}
      options={{
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        rotateControl: false,
      }}
    >
      <Marker
        position={location}
        defaultDraggable
        defaultClickable
        onDragEnd={onMarkerDragEnd}
        zIndex={100}
      />
    </GoogleMap>
  )
}

export default withScriptjs(withGoogleMap(Map))
