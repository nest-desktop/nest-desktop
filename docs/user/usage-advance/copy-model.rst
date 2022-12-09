Copy model
==========


NEST Simulator provides a function to copy model with a set of parameters.
The :bdg:`nest.CopyModel()` function is useful when multiple population
or synapses are created with same set of parameters.
See the code comparison with and without this function:

.. list-table::
   :widths: 50 50
   :header-rows: 1

   * - Code with CopyModel

     - Code without CopyModel

   * - .. code-block:: Python

          # Copy node models
          nest.CopyModel("iaf_psc_alpha", "brunel", params={
            "C_m": 250,
            "E_L": 0,
            "I_e": 0,
            "V_m": 0,
            "V_reset": 0,
            "V_th": 20,
            "t_ref": 2,
            "tau_m": 20,
            "tau_syn_ex": 0.5,
            "tau_syn_in": 0.5,
          })

           # Create nodes
           n1 = nest.Create("brunel", 100)
           n2 = nest.Create("brunel", 25)



     - .. code-block:: Python

          # Create nodes
          n1 = nest.Create("iaf_psc_alpha", 100, params={
            "C_m": 250,
            "E_L": 0,
            "I_e": 0,
            "V_m": 0,
            "V_reset": 0,
            "V_th": 20,
            "t_ref": 2,
            "tau_m": 20,
            "tau_syn_ex": 0.5,
            "tau_syn_in": 0.5,
          })
          n2 = nest.Create("iaf_psc_alpha", 25, params={
            "C_m": 250,
            "E_L": 0,
            "I_e": 0,
            "V_m": 0,
            "V_reset": 0,
            "V_th": 20,
            "t_ref": 2,
            "tau_m": 20,
            "tau_syn_ex": 0.5,
            "tau_syn_in": 0.5,
          })

|br|

.. _copy-model-steps-how-to-copy-model:

Steps how to copy model
-----------------------

.. image:: /_static/img/screenshots/controller/copy-model-step1.png
   :align: right
   :target: #

Click on :bdg:`MODEL` tab in the network controller and then select a model to copy.

|br|

.. image:: /_static/img/screenshots/controller/copy-model-step2.png
   :align: right
   :target: #

Enter name of the new model and modified selected parameters.

|br|

.. image:: /_static/img/screenshots/controller/copy-model-step3.png
   :align: right
   :target: #

Choose copied node model in nodes.

|br|

.. note::
   Copied synapse models can also be applied for synapses.
