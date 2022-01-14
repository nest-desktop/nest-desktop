Coding conventions
==================

**General coding conventions**

- The TypeScript and ESLint options can be inspected in their respective config files.
- An .editorconfig for the basic settings is also available.
- In `.rst` files, the line length should not exceed 80 by much. This is of course not a fixed rule, but the .editorconfig seems `not to be able to guarantee this <https://github.com/editorconfig/editorconfig/issues/387#ruler>`__ and we have not found a convincing alternative. A bigger problem is that there are cases, where longer lines make sense (e.g when they contain very long URLs or within bullet points).
- The general coding conventions for Vue, TypeScript and for Python (see `PEP 8 <https://www.python.org/dev/peps/pep-0008/>`__) should be followed.
- For `.ts` files, the type ``any`` should be used as rarely as possible (and might be removed in the future).
- We usually capitalize only the first letter of a title, except programming expresssions like class names, etc.


**Naming conventions**

- Names should be self-explanatory.
- We use camel case for custom .class names in Vue files.
- Kebab case is used for standard .class names in Vue files.
