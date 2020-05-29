import styled from '../styling/styled';
import React, {
  FC,
  forwardRef,
  HTMLProps,
  Ref,
  useEffect,
  useRef,
} from 'react';
import 'leaflet/dist/leaflet.css';
import L, { LatLngExpression } from 'leaflet';
import { defaultMarker } from '../utils/map';

L.Marker.prototype.options.icon = defaultMarker;

const MapWrapper = styled.div`
  width: 100%;
  border: none;
  height: 100%;
`;
const MapElement = styled.div`
  width: 100%;
  border: none;
  height: 100%;

  .base-layer {
    filter: grayscale(1);
  }
`;

interface MapProps {
  innerRef: Ref<HTMLDivElement>;
  onConfig?: Function;
}

const Map: FC<MapProps> = props => {
  const mapEl = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);

  useEffect(() => {
    map.current = L.map(mapEl.current as HTMLDivElement);
    const defaultTileLayer = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        className: 'base-layer',
        attribution:
          '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      },
    );
    defaultTileLayer.addTo(map.current);
    if (props.onConfig) {
      props.onConfig(map.current, defaultTileLayer);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <MapWrapper ref={props.innerRef}>
      <MapElement ref={mapEl} />
    </MapWrapper>
  );
};

export default forwardRef<any, { onConfig?: Function }>((props, ref) => (
  <Map {...props} innerRef={ref} />
));
