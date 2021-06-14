The semantic versioning
=======================

During the course of the development the implementation of featured into NEST Desktop are validated its compatibility.
In this concept a general rule of the semantic versioning NEST Desktop was introduced that the operational capability of the application can be guaranteed.
The formal convention of the version releases for specifying compatibility in NEST Desktop uses a three-part number:

**A major number**

It is incremented for the compatibility with the NEST Simulator.
It implies that the major version of the NEST Desktop (2.x.x) has to match with the one of NEST Simulator (currently 2.x.x).


**A minor number**

It is a breaking feature such as a new library or a minor changes of the data structure.
It means that it could cause the compatibility issue and the user need to adapt to use the same minor version of NEST Desktop as well as of NEST Server.

**A patch number**

It is a bugfix and non-breaking features added to the code.
The user is able to work with different patch versions of NEST Desktop and NEST Server.
