// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE
// Code adapted from https://codemirror.net/addon/hint/javascript-hint.js


(function (mod) {
  if (typeof exports === 'object' && typeof module === 'object')
    // CommonJS
    mod(require('@/../node_modules/codemirror/lib/codemirror'));
  else if (typeof define === 'function' && define.amd)
    // AMD
    define(['@/../node_modules/codemirror/lib/codemirror'], mod);
  // Plain browser env
  else mod(CodeMirror);
})(function (CodeMirror) {
  let Pos = CodeMirror.Pos;

  function forEach(arr, f) {
    for (let i = 0, e = arr.length; i < e; ++i) f(arr[i]);
  }

  function arrayContains(arr, item) {
    if (!Array.prototype.indexOf) {
      let i = arr.length;
      while (i--) {
        if (arr[i] === item) {
          return true;
        }
      }
      return false;
    }
    return arr.indexOf(item) != -1;
  }

  function scriptHint(editor, keywords, getToken, options) {
    // Find the token at the cursor
    let cur = editor.getCursor(),
      token = getToken(editor, cur);
    if (/\b(?:string|comment)\b/.test(token.type)) return;
    var innerMode = CodeMirror.innerMode(editor.getMode(), token.state);
    if (innerMode.mode.helperType === 'json') return;
    token.state = innerMode.state;
    // If it's not a 'word-style' token, ignore the token.

    if (!/^[\w$_]*$/.test(token.string)) {
      token = {
        start: cur.ch,
        end: cur.ch,
        string: '',
        state: token.state,
        className: token.string === ':' ? 'python-type' : null,
      };
    } else if (token.end > cur.ch) {
      token.end = cur.ch;
      token.string = token.string.slice(0, cur.ch - token.start);
    }

    var tprop = token;
    // If it is a property, find out what it is a property of.
    while (tprop.type === 'property') {
      tprop = getToken(editor, Pos(cur.line, tprop.start));
      if (tprop.string !== '.') return;
      tprop = getToken(editor, Pos(cur.line, tprop.start));
      if (!context) var context = [];
      context.push(tprop);
    }

    return {
      list: getCompletions(token, context, keywords, options),
      from: CodeMirror.Pos(cur.line, token.start),
      to: CodeMirror.Pos(cur.line, token.end),
    };
  }

  function pythonHint(editor, options) {
    return scriptHint(
      editor,
      pyNEST.keywords,
      function (e, cur) {
        return e.getTokenAt(cur);
      },
      options
    );
  }
  CodeMirror.registerHelper('hint', 'python', pythonHint);

  const pyNEST = require('@/assets/codemirror/addon/hint/pyNEST-keywords');

  function getCompletions(token, context, keywords, options) {
    let found = [],
      start = token.string,
      global = (options && options.globalScope) || window;
    function maybeAdd(str) {
      if (str.lastIndexOf(start, 0) === 0 && !arrayContains(found, str))
        found.push(str);
    }

    function gatherCompletions(obj) {
      forEach(pyNEST.keywords, maybeAdd);
    }

    if (context && context.length) {
      // If this is a property, see if it belongs to some object we can
      // find in the current environment.
      let obj = context.pop(),
        base;
      if (obj.type === 'property') base = obj.string;
      else if (obj.type === 'variable') base = obj.string;
      else if (obj.type === 'variable-3') base = ':' + obj.string;

      while (base != null && context.length) base = base[context.pop().string];
      if (base != null) gatherCompletions(base);
    } else {
      // If not, just look in the global object, any local scope, and optional additional-context
      // (reading into JS mode internals to get at the local and global variables)
      for (var v = token.state.localVars; v; v = v.next) maybeAdd(v.name);
      for (var c = token.state.context; c; c = c.prev)
        for (var v = c.vars; v; v = v.next) maybeAdd(v.name);
      for (var v = token.state.globalVars; v; v = v.next) maybeAdd(v.name);
      if (options && options.additionalContext != null)
        for (var key in options.additionalContext) maybeAdd(key);
      if (!options || options.useGlobalScope !== false)
        gatherCompletions(global);
      forEach(keywords, maybeAdd);
    }
    return found;
  }
});
