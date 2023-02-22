=========================
|lecturer| Lecturer guide
=========================

This section gives directions for lecturers who want to teach computational neuroscience with NEST Desktop.
Using computer simulations, students are able to explore models
ranging from single neurons to large neuronal networks.
Numerical experiments of increasing complexity help to understand how brain networks function
and what the features of their dynamic behavior are.

.. note::
   This section assumes that you have prior knowledge of how to use NEST Desktop.
   If you have not used NEST Desktop before, please read the User Documentation first (:doc:`/user/index`).


Course organisation
===================

To support the organization of a course, we provide some hints for course instructors:

- :doc:`/lecturer/course-design`
- :doc:`/lecturer/didactic-concept`

Additionally, we provide course materials to be handed out to participants:

- :doc:`/lecturer/first-steps`
- :doc:`/lecturer/course-protocol`

.. toctree::
   :hidden:

   course-design
   didactic-concept
   first-steps
   course-protocol


Course topics
=============

This guide shows how you can teach the biophysics of neurons, synapses
and large networks of the brain to students using NEST Desktop.
Video tutorials illustrate important aspects of the course work.
The provided material could be used to prepare handouts for students.


Bachelor students
-----------------

This section provides sample assignments for students with little prior knowledge.
The focus lies on the activity dynamics of single neurons.
In all assignments we use :code:`iaf_psc_alpha` as our neuron model.
It is studied how a neuron responds to different types of input.

- :doc:`/lecturer/bachelor/single-neuron-direct-current-injection`
- :doc:`/lecturer/bachelor/single-neuron-noise-current-injection`
- :doc:`/lecturer/bachelor/single-neuron-synaptic-input`
- :doc:`/lecturer/bachelor/single-neuron-poisson-input`


Master students
---------------

This section covers advanced topics for students with previous knowledge in neurobiology.
Here, we cover the activity dynamics of single neurons and of neuronal networks.

- :doc:`/lecturer/master/hodgkin-huxley-action-potential`
- :doc:`/lecturer/master/point-neuron-conductance`
- :doc:`/lecturer/master/network-dynamics`


Doctoral students
-----------------

This section illustrates how NEST Desktop might be used for research in computational neuroscience.
A typical example covers the activity dynamics of neuronal networks with multiple interacting populations.

- :doc:`/lecturer/doctorate/networks-decision-making`

|

.. |lecturer| image:: /_static/img/icons/user-graduate.svg
   :alt: Lecturer
   :height: 80px
   :target: #
