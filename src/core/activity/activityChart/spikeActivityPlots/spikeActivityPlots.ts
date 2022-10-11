import { CVISIHistogram } from './CVISIHistogram';
import { InterSpikeIntervalHistogram } from './interSpikeIntervalHistogram';
import { SenderCVISIPlot } from './senderCVISIPlot';
import { SenderMeanISIPlot } from './senderMeanISIPlot';
import { SenderSpikeCountPlot } from './senderSpikeCountPlot';
import { SenderActivityHistogram } from './senderActivityHistogram';
import { SpikeTimeHistogram } from './spikeTimeHistogram';
import { SpikeTimesRasterPlot } from './spikeTimesRasterPlot';

export const spikeActivityPlots = [
  {
    activityType: 'spike',
    component: SpikeTimesRasterPlot,
    id: 'spikeTimesRasterPlot',
    icon: 'mdi-chart-scatter-plot',
    label: 'Raster plot of spike times',
  },
  {
    activityType: 'spike',
    component: SpikeTimeHistogram,
    id: 'spikeTimeHistogram',
    icon: 'mdi-chart-bar',
    label: 'Time histogram of spikes',
  },
  {
    activityType: 'spike',
    component: InterSpikeIntervalHistogram,
    id: 'interSpikeIntervalHistogram',
    icon: 'mdi-chart-bar',
    label: 'Histogram of Inter-Spike Interval (ISI)',
  },
  {
    activityType: 'spike',
    component: CVISIHistogram,
    id: 'CVISIHistogram',
    icon: 'mdi-chart-bar',
    label: 'Histogram of CV of ISI',
  },
  {
    activityType: 'spike',
    component: SenderActivityHistogram,
    id: 'senderActivityHistogram',
    icon: 'mdi-chart-bar',
    label: 'Histogram of sender activity',
  },
  {
    activityType: 'spike',
    component: SenderSpikeCountPlot,
    id: 'senderSpikeCountPlot',
    icon: 'mdi-chart-bell-curve-cumulative',
    label: 'Spike count in each sender',
  },
  {
    activityType: 'spike',
    component: SenderMeanISIPlot,
    id: 'senderMeanISIPlot',
    icon: 'mdi-chart-bell-curve-cumulative',
    label: 'Mean ISI in each sender',
  },
  {
    activityType: 'spike',
    component: SenderCVISIPlot,
    id: 'senderCVISIPlot',
    icon: 'mdi-chart-bell-curve-cumulative',
    label: 'CV ISI in each sender',
  },
];
