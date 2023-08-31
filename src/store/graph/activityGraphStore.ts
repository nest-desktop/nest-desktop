// // activityGraphStore.ts

// import { defineStore } from "pinia";
// import { logger as mainLogger } from "@/utils/logger";

// import { ActivityAnimationGraph } from "@norse/graph/activityGraph/activityAnimationGraph";
// import { ActivityChartGraph } from "@norse/graph/activityGraph/activityChartGraph";
// import { ActivityChartPanelProps } from "@norse/graph/activityGraph/activityChart/activityChartPanel";
// import { Project } from "@norse/core/project/project";

// export const useActivityGraphStore = defineStore("activity-graph", {
//   state: () => ({
//     activityChartGraph: new ActivityChartGraph(),
//     activityAnimationGraph: new ActivityAnimationGraph(),
//     project: new Project(),
//     codeHash: "",
//     dataHash: "",
//     logger: mainLogger.getSubLogger({
//       name: `activity graph`,
//     }),
//   }),
//   actions: {
//     /**
//      * Initialize activity graph.
//      */
//     init(project: Project): void {
//       this.logger.trace("init");
//       this.project = project;

//       this.activityChartGraph.init(project);

//       // this.activityAnimationGraph.init(project);

//       this.updateHash();

//       if (this.project.activities.state.hasSomeEvents) {
//         this.update();
//       }
//     },

//     /**
//      * Serialize for JSON.
//      * @return activity graph object
//      */
//     toJSON(): { panels: ActivityChartPanelProps[] } {
//       return {
//         panels: this.activityChartGraph ? this.activityChartGraph.toJSON() : [],
//       };
//     },

//     /**
//      * Update activity graph.
//      */
//     update(): void {
//       // if (this.project.activities.state.hash === this.dataHash) return;

//       this.activityChartGraph.update();
//       // this.activityAnimationGraph.update();

//       this.updateHash();
//       this.logger.trace("update");
//     },

//     /**
//      * Update hash for activity graph.
//      */
//     updateHash(): void {
//       this.codeHash = this.project.simulation.code.state.hash;
//       this.dataHash = this.project.activities.state.hash;
//       this.logger.settings.name = `[${this.project.shortId}] activity graph #${this.codeHash} #${this.dataHash}`;
//     },
//   },
// });
