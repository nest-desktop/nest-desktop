Coding conventions
==================

Coding conventions help to generate good code.
Therefore, we use some recommendations regarding the coding style.
Most of them follow the conventions used by Git, Linux
and `other projects <https://namingconvention.org/git/>`__.
Some more central ones will be mentioned in the following.

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
- For ``.ts`` files, the type ``any`` should be used as rarely as possible \
  (and might be removed in the future).
- The general recommendations for good (Vue) code should be applied, e.g. \
  that Variables should be typed whenever possible.
- Coding and naming styles which are not explicitly mentioned here should be \
  kept similar to the already existing code parts in that language.

.. _git-conventions:

Git conventions
---------------

Commits
    - Commits should have a title containing not more than 72 characters.
    - The subject line of commit messages should be a short and informative \
      summary of the pull request in the imperative (e.g. 'Fix bug' instead of \
      'Fixed bug') and should not end with a full stop.
    - The body should focus on the `What` (the changes in comparison to the \
      original version) and `Why`, very detailed explanations on the `How` \
      should be included in the source code as comments.
    - If the commit addresses an issue from the issue tracker, at least the \
      issue ID should be mentioned in the commit body (or even in the name).
    - This helps to generate release notes and to maintain a Git history where a \
      ``git log`` produces helpful output.

Pull requests
    - The rules for commits also apply here.
    - Please have a look at the `GitHub keywords in issues and pull requests
      <https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/using-keywords-in-issues-and-pull-requests>`__ .

.. _naming-conventions:

Naming conventions
------------------

- Names should be self-explanatory.
- We use camel case for custom .class names in `Vue` files.
- Kebab case is used for standard .class names in `Vue` files.
- The coding style overrides other capitalization rules (e.g. ``ID`` can become ``Id``).

.. _sphinx-conventions:

Sphinx conventions
------------------

- For headings, we use the following items: ``=`` (with overline!) for parts and for sections: \
  First-level: ``=``, second level: ``-``, third level: ``^``. \
  Please note that all section headings should not have an overline!
- We usually capitalize only the first letter of a title (or heading), \
  except programming expressions like class names, proper names, etc. \
  We also recommend the Python documentation conventions, as suggested in `the official documentation
  <https://www.sphinx-doc.org/en/master/usage/restructuredtext/basics.html#sections>`__ .
