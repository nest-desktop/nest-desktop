import { InterSpikeIntervalHistogramElephant } from './interSpikeIntervalHistogramElephant';
import { SpikeTimeHistogramElephant } from './spikeTimeHistogramElephant';

export const spikeActivityPlotsElephant = [
  {
    activityType: 'spike',
    component: SpikeTimeHistogramElephant,
    id: 'spikeTimeHistogramElephant',
    icon: 'mdi-chart-bar',
    label: 'Time histogram of Spikes (Elephant)',
    source: 'elephant',
  },
  {
    activityType: 'spike',
    component: InterSpikeIntervalHistogramElephant,
    id: 'interSpikeIntervalHistogramElephant',
    icon: 'mdi-chart-bar',
    label: 'Histogram of Inter-spike interval (Elephant)',
    source: 'elephant',
  },
];
