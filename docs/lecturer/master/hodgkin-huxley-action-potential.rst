The Hodgkin-Huxley theory of the action potential
=================================================


Current clamp simulation of the free-running membrane
-----------------------------------------------------

The leaky integrate-and-fire neuron model features a very simple mechanism of action potential generation:
a fixed threshold on the membrane potential.
The upstroke of the spike is not part of the model at all, whereas the voltage reset and the absolute refractory time following each spike are imposed on the membrane potential trajectories.
To address the biophysical underpinnings of action potential generation and spike aftereffects, however, a different model must be considered.
It turns out that specific membrane components, so-called voltage-dependent ion channels, are responsible for spike generation.
The Hodgkin-Huxley model of the squid giant axon (published in 1952) accounts for these additional components.
It explains why action potentials dynamically arise, and which membrane parameters and other circumstantial factors matter during this process.
You will now perform simulation experiments on Hodgkin-Huxley (HH) neurons and this way characterize this model:

  1. Verify that the subthreshold properties of the HH neuron model are similar to the properties of the LIF neuron model.
     To address this issue, inject a depolarizing or hyperpolarizing current into a LIF neuron and into a HH neuron and perform intracellular recordings to document the membrane response in both cases.
     Make sure the current is weak enough to not elicit a spike.

  2. For strong-enough DC input current the HH model neuron will fire a train of action potentials.
     Inspect the spike waveform carefully and relate it to the spikes generated in a LIF neuron.
     The following keywords might guide your discussion:
     threshold, upstroke, downstroke, spike width, voltage reset, after-hyperpolarization, absolute refractory time, relative refractory time.
     Is the spike waveform of the HH neuron really the same for different input scenarios (e.g. weak vs. strong current)?

  3. Use a spike recorder to characterize the spiking response to superthreshold current input.
     The goal is again to characterize the neuron by a curve that depicts the firing rate response as a function of the applied current.


NEST Desktop offers different neuron models.
Here you should select :code:`hh_psc_alpha` and compare its behavior to the simpler :code:`iaf_psc_alpha` model that we have studied previously.
As these two models have an entirely different spike generation mechanism, any intracellular recording of the membrane potential will look very different in both models.
In the LIF model, spikes are just threshold crossings.
In the HH model, in contrast, their waveform is explicitly simulated.


Sodium and potassium currents under current clamp conditions
------------------------------------------------------------

It is the joint action of both voltage-dependent sodium (:math:`Na^{+}`) channels and voltage-dependent potassium (:math:`K^{+}`) channels which underlies action potential generation in excitable membranes.

In particular, sodium channel activation (i.e. opening) due to some initial depolarization leads to an influx of sodium ions, which depolarizes the membrane even further and opens even more sodium channels.
This self-amplifying avalanche of sodium channel activation drives the action potential to a point of no return, from where it continues until the sodium reversal potential is reached.
Sodium channel inactivation and potassium channel activation finally terminate the avalanche and repolarize the membrane. The ongoing outflux of potassium ions through (non-inactivating) potassium channels eventually hyperpolarizes the membrane towards the reversal potential of potassium.

  1. Action potential generation based on voltage-dependent ion channels takes place in several stages, as described above verbally.
     Use the membrane potential recording of a single spike to illustrate the dissection of this process.
     Which of the contributing factors determines the temporal width of the spike?
     Can one record the underlying ion-specific membrane currents in biological neurons?

  2. It is difficult to disentangle the effect of sodium channel inactivation and potassium channel activation.
     The former helps terminating the upstroke, the latter causes a downstroke of the membrane potential during a spike.
     In a simulation, you can record the concentration of :code:`h`, :code:`m` and :code:`n` particles of the Hodgkin-Huxley model for a more precise view on these two processes.
     Is such a recording also possible in a biological neuron?

  3. Explore the effect of the specific neurotoxins TTX and TEA on neuronal spiking.
     You can easily achieve this in your simulations by setting the peak conductances of either sodium channels or potassium channels, respectively, to zero.
     What happens if you only partially knock-out these channels by setting them to a non-zero, but reduced value? Formulate and explain your expectations before you perform the experiments.

NEST Desktop allows you to record the activation of :code:`h`, :code:`m` and :code:`n` particles directly, using a :code:`multimeter`.
In a biological neuron, this would never be possible.
To assess their dynamics, multiple separate experiments have to be performed.


Exploring the “spike threshold” and the “depolarization block”
--------------------------------------------------------------

Action potential generation follows an “all-or-nothing” principle.
Whenever favorable conditions are met, a stereotyped waveform is kick-started and cannot be stopped any more.
But what exactly are those “favorable” conditions?
You should perform some numerical simulations to address this question:

  1. Identify the “spike threshold” of a HH neuron based on the input-output function you generated above.
     Zoom into the threshold regime by performing more simulations just below and just above threshold.
     Does the HH neuron exhibit “type I” behavior or “type II” behavior?

  2. Use now brief current steps to induce single spikes only.
     The two parameters of interest are the width of the current pulse, and its amplitude.
     In a nutshell, brief steps need to have a high amplitude, longer steps can be somewhat weaker to successfully generate a spike.
     Explore the threshold behavior with regard to both parameters, along the lines explained in the lecture.

  3. You can use a continuous current ramp, as opposed to a sharp current step, to stimulate the neuron.
     If the rise in amplitude is shallow enough, it is possible to depolarize the membrane beyond any threshold voltage.
     No spike is generated then, and this phenomenon is called the “depolarization block”.
     Try out different slopes of the ramp.
     Can you explain it in terms of sodium channel inactivation?
     Perform a simultaneous recording of :code:`h`, :code:`m` and :code:`n` particles to back up your explanation.
