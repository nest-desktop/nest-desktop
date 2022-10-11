import { AnalogSignalHistogram } from './analogSignalHistogram';
import { AnalogSignalHeatmap } from './analogSignalHeatmap';
import { AnalogSignalHistogram2d } from './analogSignalHistogram2d';
import { AnalogSignalTimeSeries } from './analogSignalTimeSeries';

export const analogSignalPlots = [
  {
    activityType: 'analog',
    component: AnalogSignalTimeSeries,
    id: 'analogSignalTimeSeries',
    icon: 'mdi-chart-bell-curve-cumulative',
    label: 'Time series of Analog signals',
  },
  {
    activityType: 'analog',
    component: AnalogSignalHistogram,
    id: 'analogSignalHistogram',
    icon: 'mdi-chart-bar',
    label: 'Histogram of analog signals',
  },
  {
    activityType: 'analog',
    component: AnalogSignalHistogram2d,
    id: 'analogSignalHistogram2d',
    icon: 'mdi-map-outline',
    label: '2d histogram of analog signals',
  },
  {
    activityType: 'analog',
    component: AnalogSignalHeatmap,
    id: 'analogSignalHeatmap',
    icon: 'mdi-map-outline',
    label: 'Heatmap of analog signals',
  },
];
