import Vue from 'vue';
import VueCodemirror from 'vue-codemirror';

import 'codemirror/mode/python/python.js';
import 'codemirror/addon/selection/active-line.js';

import 'codemirror/lib/codemirror.css';
// import 'codemirror/theme/base16-dark.css'
import 'codemirror/addon/hint/show-hint.css';

Vue.use(VueCodemirror);
