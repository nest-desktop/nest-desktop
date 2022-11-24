Usage Guide with NRP
====================

This is a guide to show how to use NEST Desktop with NRP (Neuro-Robotic Plattform).

NRP provides users to perform virtual experiments on virtual objects (e.g. robots, robotic arm)
or on virtual animals (e.g. rats).

In our case we use NRP to learn neuronal activity dynamics of the "robot brain"
according to a thought experiment by the cyberneticist Valentino
`Braitenberg <https://en.wikipedia.org/wiki/Braitenberg_vehicle>`__.

His thought experiment demonstrated a simple concept of the brain interacting with the environment.
The simplest concept of the Braitenberg vehicle shows direct connections of two sensors to two individual wheels.
This implies, that the signal strength controls the rotation speed of the wheel.TT

|br|

.. image:: /_static/img/screenshots/external/nest-desktop-nrp.png
   :alt: Neuro Robotics Plattform
   :target: #

|

In our experiment, our robot ("Husky") acts similar to the Braitenberg vehicle.
Additionally to the basic setup in "Husky", we implanted a 'robot brain'
receiving electrical signals from the sensors, processing them
and transferring signals to motors/engine.
In summary, the robot brain controls the movement and thus our robot "Husky" is able to react to the environment.

In NRP experiment, we see our robot "Husky" and two monitors showing a screen color,
e.g. blue, red, green.
The user can change the screen color.
During the live experiment, the Husky rotates itself in a non-attractive situation
(blue and green screen).
But the Husky moves towards to the monitor with red screen.

In NEST Desktop we can observe the spike activities of the "Husky brain".

|br|

.. _usage-with-nrp_how-to-perform-simulation-with-nrp-and-nest-desktop:

How to perform simulation with NRP and NEST Desktop
---------------------------------------------------

.. note::
   Before you start the simulation, please read instructions of
   :doc:`/deployer/deploy-docker-compose-nrp`.

First, open two Browser windows/tabs, one for NEST Desktop and another for NRP.
You can place two windows side-by-side to see both.

In NEST Desktop import project 'Husky experiment' (from GitHub).
Investigate the network and prepare the simulation.

In NRP you have to clone and launch Husky experiment.
Then in virtual environment you can start the experiment.
Here, you can see the Husky is rotating itself.
Now, switch the screen color of a monitor to red.
Watch until the Husky moves toward the red screen.

Observe the spike activity in NEST Desktop.
