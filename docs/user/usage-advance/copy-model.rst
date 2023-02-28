Copy models
===========


NEST Simulator provides a function to copy a model together with its set of parameters.
The ``nest.CopyModel()`` function is useful when multiple populations
or synapses should be created with the same set of parameters.
This simplifies the work a lot, as you can see in the example below:

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

How to copy models - step by step
---------------------------------

.. image:: /_static/img/screenshots/controller/copy-model-step1.png
   :align: right
   :target: #

Click on the :bdg:`MODEL` tab in the network controller and then select a model to copy.
Then confirm with a click on :bdg:`COPY`.

|br|

.. image:: /_static/img/screenshots/controller/copy-model-step2.png
   :align: right
   :target: #

Enter the name of the new model. If you like to have other model parameters than
the default one, just click on the model title and select the parameters you want to change.
This opens the sliders and fields to edit their values.

|br|

.. image:: /_static/img/screenshots/controller/copy-model-step3.png
   :align: right
   :target: #

Choose the copied node model for your node (e.g. in the nodes list).

|br|

.. note::
   Copied synapse models can also be applied for synapses (analogously as above).
