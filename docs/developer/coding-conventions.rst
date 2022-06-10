Coding conventions
==================

.. _general-coding-conventions:

General coding conventions
--------------------------

- The TypeScript and ESLint options can be inspected in their respective config files.
- An ``.editorconfig`` for the basic settings is also available.
- In ``.rst`` files, the line length should not exceed 120 by much. \
  This is of course not a fixed rule, \
  but the `.editorconfig` seems `not to be able to guarantee this
  <https://github.com/editorconfig/editorconfig/issues/387#ruler>`__ \
  and we have not found a convincing alternative. \
  A bigger problem is that there are cases, where longer lines make sense \
  (e.g when they contain very long URLs or within bullet points, \
  the latter with the possibility to use backslashes, which is sometimes quite cumbersome).
- The general coding conventions for Vue, TypeScript \
  and for Python (see `PEP 8 <https://www.python.org/dev/peps/pep-0008/>`__) should be followed.
- Variables should have a type.
- For ``.ts`` files, the type ``any`` should be used as rarely as possible \
  (and might be removed in the future).
- We usually capitalize only the first letter of a title, \
  except programming expressions like class names, etc.
- Coding and naming styles which are not explicitly mentioned here should be \
  kept similar to the already existing code parts in that language.

.. _naming-conventions:

Naming conventions
------------------

- Names should be self-explanatory.
- We use camel case for custom .class names in `Vue` files.
- Kebab case is used for standard .class names in `Vue` files.
- The coding style overrides other capitalization rules (e.g. ``ID`` can become ``Id``).
