// codeGraphStore.ts

import { Editor, IBaklavaViewModel, IEditorState, useBaklava } from "baklavajs";
import { defineStore } from "pinia";
import { reactive } from "vue";

export const useCodeGraphStore = defineStore("code-graph", () => {
  const state = reactive<{
    autosort: boolean;
    editor: IEditorState;
    modules: Record<string, string>;
    token: symbol | null;
  }>({
    autosort: true,
    editor: new Editor().save(),
    token: null,
    modules: {},
  });

  const viewModel = useBaklava() as IBaklavaViewModel;
  const editor: Editor = viewModel.editor;

  // editor.nodeHooks.afterSave.subscribe(state.token, (state) => {
  //   saveNodeState(editor.graph, state);
  //   return state;
  // });

  // editor.nodeHooks.beforeLoad.subscribe(state.token, (state) => {
  //   loadNodeState(editor.graph, state);
  // });

  // const displayedGraph = viewModel.displayedGraph;
  // if (displayedGraph)
  //   registerCreateSubgraphCommand(ref(displayedGraph), viewModel.commandHandler, viewModel.switchGraph);

  // const newGraph = () => {
  //   if (state.token) unsubscribe();
  //   state.editor = new Editor().save();
  // };

  const subscribe = (call: () => void): void => {
    if (state.token) unsubscribe();

    state.token = Symbol("token");
    editor.graphEvents.addNode.subscribe(state.token, () => call());
    editor.graphEvents.addConnection.subscribe(state.token, () => call());
    editor.graphEvents.removeNode.subscribe(state.token, () => call());
    editor.graphEvents.removeConnection.subscribe(state.token, () => call());

    // TODO: it renders code of all nodes, find better solution to render code of active node only.
    editor.nodeEvents.update.subscribe(state.token, () => call());
  };

  const unsubscribe = (): void => {
    if (!state.token) return;

    editor.graphEvents.addNode.unsubscribe(state.token);
    editor.graphEvents.removeNode.unsubscribe(state.token);
    editor.graphEvents.addConnection.unsubscribe(state.token);
    editor.graphEvents.removeConnection.unsubscribe(state.token);
    editor.nodeEvents.update.unsubscribe(state.token);

    state.token = null;
  };

  // const registerGraph = (graph: CodeGraph) => {
  //   editor.registerGraph(graph);
  // };

  return { editor, state, subscribe, unsubscribe, viewModel };
});
