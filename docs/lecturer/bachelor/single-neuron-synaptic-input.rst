Excitatory and inhibitory synaptic input into single neurons
============================================================

In a biological neuronal network, communication between neurons typically relies on synaptic input.
Whenever the presynaptic neuron generates a spike, chemical neurotransmitter (e.g. glutamate or GABA) is released and bound to postsynaptic receptors.
This leads to a transient activation of the synapse, and a transient inward or outward postsynaptic current (PSC).
As a consequence, the membrane potential of the postsynaptic neuron experiences a small deflection, the postsynaptic potential (PSP).
Typically, for an excitatory synapse using glutamate as a transmitter, this deflection is depolarizing (towards threshold).
In contrast, for an inhibitory synapse using GABA as a transmitter, it is hyperpolarizing (away from threshold).
The superposition of many PSCs of either polarity represents the effective input to a neuron, which may, or may not, lead to an output spike to be sent to other neurons in the same circuit.
You should now explore all these aspects by performing the following numerical experiments:

  1. Devise a simulation method to study single postsynaptic potentials.
     Which simulation parameter reflects the “strength” of a synapse?
     Systematically explore the effect of activating single excitatory and inhibitory synapses.
     Under which conditions can activating a single synapse elicit an output spike?

  2. Multiple PSPs elicited in rapid succession at one and the same synapse add up to a compound signal if they sufficiently overlap in time.
     This phenomenon is called “temporal integration”.
     Multiple PSPs elicited at different synapses are also superimposed, all contributing to the membrane potential of the postsynaptic neuron.
     This is called “spatial integration”.
     Design a set of experiments to illustrate the phenomena of temporal and spatial synaptic integration in the subthreshold regime.
     Which parameters of the neuron are mainly responsible for the temporal overlap between individual PSPs?

  3. A hallmark of the LIF model, which is shared by many biological neurons, is the linearity of temporal and spatial integration.
     The membrane potential response to a combined input is just the sum of the individual responses to the individual inputs, as long as all of them remain subthreshold.
     Design an experiment that demonstrates the linearity of synaptic integration for the LIF neuron model.
     Does linearity also hold for superthreshold inputs that lead to action potential firing?

NEST Desktop allows you to study how neurons are activated by synaptic input.
You can use the so-called :code:`spike_generator` for experiments with maximal control.
In essence, you specify the time point of each spike explicitly.
Don't forget to specify the amplitude of the post-synaptic potential.
This way, you can explore the effect of “spatio-temporal integration”.
You can also study, under which conditions synaptic input can trigger an output spike.


**Video tutorial**

.. raw:: html

  <div class="iframe-container">
    <iframe src="https://drive.ebrains.eu/f/44ee7c0983d942f78111/?raw=1" frameborder="0" allowfullscreen></iframe>
  </div>
