import React, { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleQuantile } from 'd3-scale';
import { Tooltip } from 'react-tooltip';
import LinearGradient from './LinearGradient.js';
import './Style.css';

const INDIA_TOPO_JSON = require('./../Resources/india.topo.json');

const PROJECTION_CONFIG = {
  scale: 350,
  center: [78.9629, 22.5937],
};

const COLOR_RANGE = [
  '#ffedea',
  '#ffcec5',
  '#ffad9f',
  '#ff8a75',
  '#ff5533',
  '#e2492d',
  '#be3d26',
  '#9a311f',
  '#782618',
];

const DEFAULT_COLOR = '#FFFF00';

const geographyStyle = {
  default: {
    outline: 'none',
  },
  hover: {
    fill: '#ccc',
    transition: 'all 250ms',
    outline: 'none',
  },
  pressed: {
    outline: 'none',
  },
};

console.log(JSON.parse(localStorage.getItem('myData')));

const IndiaMap = () => {
  const [tooltipContent, setTooltipContent] = useState('');
  const [data, setData] = useState(JSON.parse(localStorage.getItem('myData')));
  const [target, setTarget] = useState(
    Object.keys(data[0])[Object.keys(data[0]).length - 1]
  );

  useEffect(() => {
    setData(JSON.parse(localStorage.getItem('myData')));
    setTarget(Object.keys(data[0])[Object.keys(data[0]).length - 1]);
  }, [JSON.parse(localStorage.getItem('myData'))]);

  console.log(target);

  const gradientData = {
    fromColor: COLOR_RANGE[0],
    toColor: COLOR_RANGE[COLOR_RANGE.length - 1],
    min: 0,
    max: data.reduce(
      (max, item) => (item[target] > max ? item[target] : max),
      0
    ),
  };

  const colorScale = scaleQuantile()
    .domain(data.map((d) => d[target]))
    .range(COLOR_RANGE);

  const onMouseEnter = (geo, current = { [target]: 'NA' }) => {
    return () => {
      setTooltipContent(`${geo.properties.name}: ${current[target]}`);
    };
  };

  const onMouseLeave = () => {
    setTooltipContent('');
  };

  const onChangeButtonClick = () => {
    setData(JSON.parse(localStorage.getItem('myData')));
  };

  return (
    <div className="full-width-height container">
      <h1 className="no-margin center">States and UTS Of INDIA</h1>
      <ComposableMap
        projectionConfig={PROJECTION_CONFIG}
        projection="geoMercator"
        width={600}
        height={220}
        data-tip=""
      >
        <Geographies geography={INDIA_TOPO_JSON}>
          {({ geographies }) =>
            geographies.map((geo) => {
              // red zone
              var current = data.find(
                (s) => s[Object.keys(data[1])[1]] === geo.properties.name
              );
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={current ? colorScale(current[target]) : DEFAULT_COLOR}
                  style={geographyStyle}
                  onMouseEnter={onMouseEnter(geo, current)}
                  onMouseLeave={onMouseLeave}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
      <LinearGradient data={gradientData} />
      <Tooltip>{tooltipContent}</Tooltip>
      <div className="center">
        <button className="mt16" onClick={onChangeButtonClick}>
          Change
        </button>
      </div>
    </div>
  );
};

export default IndiaMap;
