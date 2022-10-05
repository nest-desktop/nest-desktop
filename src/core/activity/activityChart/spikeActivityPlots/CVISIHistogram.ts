import { ActivityChartPanel } from '../activityChartPanel';
import { SpikeActivity } from '../../spikeActivity';
import { SpikeActivityPanelModel } from '../spikeActivityPanelModel';

export class CVISIHistogram extends SpikeActivityPanelModel {
  constructor(panel: ActivityChartPanel, model: any = {}) {
    super(panel, model);
    this.panel.xaxis = 3;
    this.params = [
      {
        input: 'tickSlider',
        label: 'bin size',
        ticks: [0.01, 0.02, 0.05, 0.1, 0.2, 0.5],
        value: 0.05,
      },
    ];
  }

  /**
   * Add data of CV of ISI for histogram panel.
   */
  override async addData(activity: SpikeActivity): Promise<boolean> {
    return new Promise(resolve => {
      const xbins: any = {
        start: 0,
        end: 5,
        size: this.params[0].value,
      };
      const isi: number[][] = activity.ISI();
      const x: number[] = isi.map(
        (i: number[]) =>
          activity.getStandardDeviation(i) / activity.getAverage(i)
      );

      this.data.push({
        activityIdx: activity.idx,
        histfunc: 'count',
        hoverinfo: 'y',
        legendgroup: 'spikes' + activity.idx,
        marker: {
          color: activity.recorder.view.color,
          line: {
            color: activity.project.app.darkMode ? '#121212' : 'white',
            width: (xbins.end - xbins.start) / xbins.size > 100 ? 0 : 1,
          },
        },
        name: 'Histogram of CV(ISI) in' + activity.recorder.view.label,
        opacity: 0.6,
        showlegend: false,
        source: 'x+y',
        type: 'histogram',
        visible: this.state.visible,
        x,
        xbins,
      });

      resolve(true);
    });
  }

  /**
   * Update layout label for CV_ISI histogram.
   */
  override updateLayoutLabel(): void {
    this.panel.layout.xaxis.title = 'CV of ISI';
    this.panel.layout.yaxis.title = 'Count';
  }
}
