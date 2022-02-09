Network models of decision making
=================================

Deciding between two alternatives is a very basic, but also a very essential task the brain has to perform.
However, not much is known about how this process is actually implemented in biological brain networks.
The stable fixed point dynamics considered in the previous section does not seem to suggest anything
that looks like a decision making system.
The conceptual model that has been suggested for decision making, however, is surprisingly simple:
Dividing the excitatory neuron population into two halves,
and arranging the strength of synapses within each population to be a little stronger than the synapses across populations,
the two excitatory populations start to compete with each other.
Depending on the external input each of them gets,
one of the two population “wins” by suppressing the other one with the help of the inhibitory population.
If this happens, the symmetry is broken and a “decision” has been made.
This kind of “winner takes all” dynamics in EEI networks is considered as a candidate mechanism for decision making,
e.g. for classification tasks in sensory systems of the neocortex (“cat/dog”, “left/right”, “good/bad”).
A very similar mechanism, based however on splitting the inhibitory population,
has been postulated for subcortical brain areas.
In the basal ganglia, for example, decisions are made
whether a planned action, for example a movement, is executed or terminated (“go/nogo”).

To explore decision making with computer simulations,
we recommend that you start with the network models that were prepared for the course.
In the navigation sidebar on the left, click with the right mouse button on the projects icon (contains a brain symbol).
Then choose the option "Import projects" (icon: arrow pointing upwards) from the dropdown menu (three vertical dots)
and import the file provided in the repository (tba).
This is, by the way, a general method with which you can share models with others, including all settings and parameters.

|

Decision making in EEI Networks
-------------------------------

The provided network model comprises three (instead of just two) subpopulations:
two of them are excitatory (a, b), and one is inhibitory (c).
This was achieved by dividing the excitatory population of the model
considered in the previous chapter into two equal halves.
In a fully symmetric setting, the two excitatory populations (a, b) of course do not behave any different.
However, if the symmetry is broken, one of the populations may take over and dominate the other one.
There are different possibilities how this can be achieved.

||||

1. Figure out which manipulations of the network configuration lead
   to an unequal activation of the two excitatory populations,
   for example a stronger activation of population (b).
   You may test the number of neurons, the connectivity (synaptic weights or transmission delays)
   within or across populations, or external input.
   It is suggested that you change only one parameter at a time, and reset all the other
   parameters to their default values.
   To account for statistical fluctuations, you should perform repeated simulations for each parameter setting,
   using different seeds of the random number generator.

||||

2. What is the exact role of the inhibitory population in the competition process?
   How does the activation of inhibitory neurons reflect a decision?

||||

|

Decision making in EII networks
-------------------------------

A decision making network can also be established by dividing the inhibitory population into two halves.
In this scenario, the two inhibitory subpopulations (b, c) are acting as competitors.
Very much like in the EEI scenario considered in the previous section,
the goal is to understand which factors contribute a bias in the activation of one population (b, light blue).

||||

1. Consider now an alternative decision making system, which is based on a EII scenario.
   You should devise a strategy to study its behavior similar to the one you developed for the EEI model.

   .. note::
      Inhibitory synapses have opposite effects as compared to excitatory ones.

||||

2. What is the exact role of the excitatory population in this process?
   How does the activation of excitatory neurons reflect a decision?

||||

|

Decision making
---------------

Perceptual decisions have to be made when there are two conflicting interpretations of the input
(e.g. leftward vs. rightward movement of a subtle stimulus).
The brain will then not maintain both interpretations, but rather decides for one of them
and adjusts its behavior accordingly.
Typically, the “stronger” input wins, but additional factors
(e.g. memory previous encounters, or random perturbations) might contribute as well.
The same holds for action selection, which is a necessary component
to resolve conflicts in the behavioral goals of an animal.

||||

1. Interpret the phenomena observed in simulations of EEI and EII networks
   in relation to a hypothetical “decision making” process.
   What are the requirements to enable “decision making”?
   Which additional components would you need for a full-blown decision making system?
