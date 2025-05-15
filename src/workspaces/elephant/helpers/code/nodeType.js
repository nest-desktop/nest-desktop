// nodeType.js

const hom_poisson_spiketrain = {
  codeTemplate:
    "elephant.spike_train_generation.homogeneous_poisson_process(rate={{ rate }}*pq.Hz, t_start={{ start }}*pq.s, t_stop={{ stop }}*pq.s))",
  register: function homPoissonSpiketrain() {
    this.addOutput("spiketrain");

    this.addProperty("rate", 1, "number");
    this.addProperty("start", 0, "number");
    this.addProperty("stop", 1, "number");

    this.addWidget("number", "rate", this.properties.rate, "rate");
    this.addWidget("number", "start", this.properties.start, "start");
    this.addWidget("number", "stop", this.properties.stop, "stop");

    this.pos = [50, 50];
  },
};

export const elephantNodeTypes = {
  "elephant/spike_train_generation/homogeneous_poisson_process": hom_poisson_spiketrain,
};
