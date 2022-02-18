Point neuron models with conductance-based synapses
===================================================

The term “point neuron” refers to a nerve cell, in which spatial variations of the membrane voltage are
negligible.
Such cells are then fully described by a single membrane potential variable.
Most small neurons share the property of being “electrotonically compact” in this sense.
Spatially extended cells, in contrast, must be conceived as a physical cable.
In such a cable, the voltage is attenuated with distance due to leakage of electric charges.
Moreover, the cable itself acts as a spatio-temporal filter and alters the signal transmitted by it.
Such a cable is often approximated by a chain of electrically coupled single compartments,
leading to so-called multi-compartment neuron models.

|

In contrast to what we assumed for the leaky integrate-and-fire neuron model, biological synapses operate on
the basis of ion channels, and should not be considered as fixed current sources.
When a neurotransmitter is released at the presynaptic axon terminal,
it diffuses through the synaptic cleft and binds to the receptors sitting in the membrane of the postsynaptic neuron.
As a result, ion channels linked to the receptors open transiently and enable a brief postsynaptic current flow.
The duration of this transient inflow or outflow is described by the so-called synaptic time constant.
Depending on the concentration gradient of the ions involved
(:math:`Na^{+}` for excitatory synapses, :math:`Cl^{-}` for inhibitory synapses),
this current is either depolarizing or hyperpolarizing, respectively.

If many of these synaptic channels are simultaneously open due to massive synaptic bombardment from a
pool of presynaptic neurons, this may change the integration properties of the neuron as a whole.
Its total input resistance :math:`R` is decreased,
and therefore the membrane time constant :math:`\tau = R \cdot C` is decreased as well,
affecting the width of individual postsynaptic potentials (PSPs),
which may also have a reduced amplitude due to the strong membrane leak.
In addition, postsynaptic potentials have a shorter duration, as the membrane time constant is smaller.
This scenario has been described as the “high-conductance state”.
Neurons then assume nonlinear properties, as their input integration becomes state-dependent:
PSPs at rest are different to PSPs sitting on a background of many activated synapses.

||||

1. Consider an isolated, conductance-based point neuron,
   with synapses that have alpha-functions as post-synaptic current transients,
   and a non-zero synaptic time constant.
   Simulate an individual excitatory postsynaptic potential,
   and explore its dependency on the driving force (distance to the excitatory reversal potential).

   This can be achieved by injecting additional subthreshold depolarizing currents of different strengths.
   Perform the same experiment for an inhibitory postsynaptic potential
   and discuss the differences to the case of excitation.

||||

2. Now replace the DC input by an equivalent synaptic input, called synaptic background activity.
   It can be conveniently provided by a Poisson source,
   which is coupled to the neuron by an excitatory synapse.
   By systematic experimentation, you can now determine
   which firing rate of the Poisson source leads to the same mean depolarization
   of the postsynaptic neuron as a given DC injection.

   On top of the background activity, simulate again an individual excitatory postsynaptic potential.
   Describe how it changes its shape (amplitude and width) in the high-conductance state.

||||

3. You can emphasize the high-conductance state even more,
   if you apply a combined excitatory and inhibitory Poisson input.
   In order to arrive at the same mean depolarization,
   the inhibitory input must be overcome by some extra excitatory input.
   The excessive excitatory and inhibitory synaptic bombardment,
   however, will reduce the effective input resistance and time constant even more.

||||

4. Consider now synapses with different synaptic time constants.
   The reduction of synaptic strength in the high-conductance state is more prominent for slow synapses
   (large synaptic time constant) than it is for fast synapses (small synaptic time constant).

   Perform an experiment that demonstrates this surprising effect.
   You might just repeat the experiment from the second assignment with a different synapse
   that has a smaller or larger synaptic time constant.
   Then you compare the attenuation of synaptic transmission due to background activity in both cases.

||||

NEST Desktop enables strategies of analysis that cannot easily be adopted in a biological experiment.
In order to display weak effects under noisy conditions,
researchers have to perform many repetitions in several recording sessions
and compute the average outcome afterwards.
This is very time consuming.
In a simulation, in contrast, you might consider performing simultaneous recordings from several neurons
at the same time and directly compute the average.
This is easily achieved in a simulation by setting the population size to a large enough value.
