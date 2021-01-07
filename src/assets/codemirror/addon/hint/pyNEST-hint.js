// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports === "object" && typeof module === "object") // CommonJS
    mod(require("@/../node_modules/codemirror/lib/codemirror"));
  else if (typeof define === "function" && define.amd) // AMD
    define(["@/../node_modules/codemirror/lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
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

  function scriptHint(editor, _keywords, getToken) {
    // Find the token at the cursor
    let cur = editor.getCursor(), token = getToken(editor, cur), tprop = token;
    // If it's not a 'word-style' token, ignore the token.

    if (!/^[\w$_]*$/.test(token.string)) {
        token = tprop = {start: cur.ch, end: cur.ch, string: "", state: token.state,
                         className: token.string === ":" ? "python-type" : null};
    }

    if (!context) var context = [];
    context.push(tprop);

    let completionList = getCompletions(token, context);
    completionList = completionList.sort();

    return {list: completionList,
            from: CodeMirror.Pos(cur.line, token.start),
            to: CodeMirror.Pos(cur.line, token.end)};
  }

  function pythonHint(editor) {
    return scriptHint(editor, pyNESTFunctions, function (e, cur) {return e.getTokenAt(cur);});
  }
  CodeMirror.registerHelper("hint", "python", pythonHint);

  let pyNESTBuiltins = "Connect CopyModel Create GetConnections GetDefaults GetKernelStatus GetStatus Install Models ResetKernel SetDefaults SetKernelStatus SetStatus Simulate ";
  let pyNESTFunctions = pyNESTBuiltins.split(" ").join("() ").split(" ");

  function getCompletions(token, context) {
    let found = [], start = token.string;
    function maybeAdd(str) {
      if (str.lastIndexOf(start, 0) === 0 && !arrayContains(found, str)) found.push(str);
    }

    function gatherCompletions(_obj) {
        forEach(pyNESTFunctions, maybeAdd);
    }

    if (context) {
      // If this is a property, see if it belongs to some object we can
      // find in the current environment.
      let obj = context.pop(), base;

      if (obj.type === 'property')
         base = obj.string;
      else if(obj.type === "variable")
          base = obj.string;
      else if(obj.type === "variable-3")
          base = ":" + obj.string;

      while (base != null && context.length)
        base = base[context.pop().string];
      if (base != null) gatherCompletions(base);
    }
    return found;
  }
});
