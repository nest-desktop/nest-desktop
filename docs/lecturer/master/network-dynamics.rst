Network dynamics
================

In the central nervous system, neurons never act in isolation.
Rather, they are bound to communicate with other neurons using both electrical and chemical signals.
Fast electric signaling mostly relies on specific and precise synaptic transmission based on neurotransmitters.
Depending on the transmitter system the presynaptic neuron is using, synapses come in different flavors:
Synaptic communication is either excitatory or inhibitory.
Although polarity is the most salient property, other parameters of synaptic transmission are also important, depending on the type of information that is being processed.
We mention here the strength of the synapse, the transmission delay, the rise time of the postsynaptic potential, and different aspects of synaptic plasticity.
Synapses are highly important building blocks of networks, determining the properties and the function of brains in essential ways.

A typical task of behavioral control rarely involves just one step of signal transduction.
In most cases, several processing stages are needed.
To achieve a complex task (e.g. produce spoken language) many neurons at different places in the brain eventually make their contribution.
There is little agreement among researchers, however, how the communication is organized on the system level.
In fact, different parts of the brain seem to employ very different strategies of collective signal processing.
This is at least what the microanatomy of synaptic connectivity in brain circuits suggests.
Whereas the cerebellum has a clear feed-forward architecture, neuronal communication in the large recurrent networks of the neocortex is dominated by feedback.
It is really a daunting task to characterize these networks of different types of neurons in the brain to help improving our understanding of their role for the control of behavior.
Numerical simulations of prototypic circuits help us exploring and refining theoretical ideas, and aligning them with biological design principles.


Recurrent networks of excitatory neurons
----------------------------------------

The most numerous cell type in the neocortex are pyramidal neurons (approximately 80%).
They generally use glutamate as a transmitter and are, therefore, excitatory.
Local circuits are highly recurrent, and there is intense synaptic communication among neurons.
External inputs make an important contribution as well.
In fact, each neuron receives a large number of inputs from other neurons, and contributes a large number of
outputs to other neurons in the same network. Individual synapses are rather weak, though.
Only the joint action of many excitatory inputs can bring the postsynaptic neuron to fire a spike.
The synaptic connectivity of the network, to the degree to which it is known at all, is statistically consistent with the topology of a random graph.
A typical value for the connection probability in local cortical networks is 10%.

  1. Set up a large-enough population of excitatory neurons, based on the standard LIF model.
     Establish random synaptic connections among neurons.

     .. note:: There are several different options to wire up a network randomly (see https://www.nest-simulator.org/connection-management).

     Find a meaningful way to monitor neuronal activity in the network, both on the level of individual neurons (membrane potentials and spike trains), and on the level of the whole population (PSTH, as a proxy for the EEG).
     Characterize the type of activity that you observe.

  2. Explore now the role of external input for the dynamics of the recurrent network.
     As this external input is normally provided by other neurons that are not part of the local network in question, a Poisson generator represents an adequate model for it.
     Try out different options how to connect it to the recurrent network, and play with the intensity of the input.
     Networks in the neocortex are sparse (10% connectivity).
     How does the input influence the response of such a sparse network?

  3. If the Poisson input is neither too weak nor too strong, the activity in the recurrent network looks random itself, both on the level of spike trains and on the level of membrane potentials.
     What are the reasons for this?
     You can test the influence of the random Poisson input by replacing it by a deterministic DC source.
     Make sure that the amplitude of the injected DC is roughly equivalent to the Poisson input applied previously.
     As a criterion, you can either compare mean membrane potentials in an intracellular recording of one of the neurons in the network, or you can base your calibration on the response rate of one or several neurons in the network.

NEST Desktop offers several different methods to wire up a network randomly.
Make sure you understand how they work, and which of them allows you to generate sparse networks.
Your networks should be not too small and not too large.
Networks with 100 neurons may be a good start. Working with a larger number of neurons is possible, but the initial wiring and the simulation of activity can take quite long then.
Also make sure that each neuron receives enough external input, as the input from other neurons in the network will not suffice to push the membrane potential above threshold and elicit any activity.


Recurrent networks of inhibitory neurons
----------------------------------------

There are networks in the brain that consist of only inhibitory neurons.
In particular, several nuclei in the basal ganglia (e.g. the striatum, and both parts of the globus pallidus) are comprised of GABAergic neurons.
It is clear that such networks depend on excitatory drive from outside to become active.

  1. Use a similar setup as for the all-excitatory networks studied before, except that all neurons should now be inhibitory.
     Again explore how the properties of the input determine the properties of the network response.
     Using the same random connectivity and external inputs that lead to the same  mean firing rates, what is the main difference between all-inhibitory and all-excitatory networks?

  2. Additional parameters that are relevant in a network, like the synaptic transmission delay, have a rather strong influence on the activity dynamics in recurrent networks.
     Systematically vary this particular parameter and describe the consequences you observe. Make sure you vary it only in small steps, as the network might react quite sensitively.

NEST Desktop generally allows to set up big networks with weak recurrent synapses, or smaller networks with strong recurrent synapses.
To see the impact of the transmission delay of recurrent synapses on the network activity, the recurrent contribution to the network activity needs to be high enough.
Neurons communicate with other neurons in the central nervous system using both electrical and chemical signals depending on the transmitter system.


Recurrent networks of excitatory and inhibitory neurons
-------------------------------------------------------

We will now get back to the neocortex and add the missing 20% of inhibitory neurons to the recurrent network.
Each of the two subpopulations is now conceived as a random recurrent network in its own respect, and the two subnetworks are mutually coupled with each other in a random fashion.
This means that we now have to track four connectivity parameters, for the following types of synapses: :math:`E \rightarrow E`, :math:`E \rightarrow I`, :math:`I \rightarrow I`, :math:`I \rightarrow E`.
Although it is interesting and relevant to vary them independently, it is recommended to use the same connection probability of 10% throughout all types of synapses, and to use exactly the same strength :math:`J > 0` for all excitatory synapses
(:math:`E \rightarrow E`, :math:`E \rightarrow I`) and same strength :math:`– g J < 0` for all inhibitory synapses (:math:`I \rightarrow I`, :math:`I \rightarrow E`).
The number :math:`g > 0` is a unit-less factor describing how dominant inhibition is in the network.
The value :math:`g = 4` is special, because in this setting the relatively small number of inhibitory neurons is exactly compensated by an increased strength of inhibitory synapses.

  1. Set up a random recurrent network according to the prescription given above.
     Fix a value of :math:`g = 5` while you search for good values of the other parameters.
     First of all, the strength :math:`J` of excitatory synapses must be matched to the typical input a neuron gets.
     What is your criterion?
     As for the other networks considered before, external excitatory drive will be necessary to induce meaningful activity in this network.
     Fix a good value for the rate of the external drive, just above threshold.
     The goal should be to establish stable activity in the network, which is characterized by low firing rates, irregular (Poisson-like) spike trains, and a low degree of synchrony across neurons.
     Describe your experiences during the parameter search, and formulate your recommendations how to make this a reproducible and joyful procedure.

  2. Whatever configuration you are now working with, the activity should be stable against external perturbations.
     In fact, such dynamic stability would be a highly desirable property of any biological system.
     For example, you can use an additional DC input and apply a strong depolarizing perturbation to all neurons, mimicking the effect of a flash of transcranial magnetic stimulation, TMS.
     After the perturbation is turned off, the network should return to its previous activity.
     Is this “return to the fixed point” a fast or a slow process?
     Can you estimate a time constant for it?

  3. Stable “fixed point activity” is characterized by a tight temporal balance between excitation and inhibition.
     This balance can be demonstrated by comparing the time-resolved PSTH fluctuations of the excitatory population to the inhibitory population.
     A “scatter plot” may come handy to display the observations made “by eye” in a more objective way:
     Simultaneous bin counts of excitatory activity :math:`x` and inhibitory activity :math:`y` make the coordinates :math:`(x,y)` of data points in a two-dimensional display.
     What is the relation of individual spike trains with the population activity measured by the PSTH?

  4. You should now vary the parameter :math:`g` and document all important changes.
     Changing this parameter has the potential to alter the balance between excitation and inhibition.
     Describe how the balance is affected, and what the consequences of this for the recurrent network dynamics are.


**Video tutorial**

.. raw:: html

  <div class="iframe-container">
    <iframe src="https://drive.ebrains.eu/f/dd51fc9aed2345ed861f/?raw=1" frameborder="0" allowfullscreen></iframe>
  </div>
