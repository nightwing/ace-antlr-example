import antlr4 from 'antlr4/index';
import {
    todoLexer,
    todoParser,
    todoListener,
    todoVisitor
} from './todo.g4';
importScripts(require("file-loader!ace-builds/src-noconflict/worker-json.js"));


// class for gathering errors and posting them to ACE editor
var AnnotatingErrorListener = function(annotations) {
    antlr4.error.ErrorListener.call(this);
    this.annotations = annotations;
    return this;
};

AnnotatingErrorListener.prototype = Object.create(antlr4.error.ErrorListener.prototype);
AnnotatingErrorListener.prototype.constructor = AnnotatingErrorListener;

AnnotatingErrorListener.prototype.syntaxError = function(recognizer, offendingSymbol, line, column, msg, e) {
    this.annotations.push({
        row: line - 1,
        column: column,
        text: msg,
        type: "error"
    });
};
 
var validate = function(input) {
    var stream = new antlr4.InputStream(input);
    var lexer = new todoLexer(stream);
    var tokens = new antlr4.CommonTokenStream(lexer);
    var parser = new todoParser(tokens);
    var annotations = [];
    var listener = new AnnotatingErrorListener(annotations)
    parser.removeErrorListeners();
    parser.addErrorListener(listener);
    parser.element();
    return annotations;
};


ace.define('ace/worker/my-worker',[], function(require, exports, module) {
    "use strict";

    var oop = require("ace/lib/oop");
    var Mirror = require("ace/worker/mirror").Mirror;

    var MyWorker = function(sender) {
        Mirror.call(this, sender);
        this.setTimeout(200);
        this.$dialect = null;
    };

    oop.inherits(MyWorker, Mirror);

    (function() {
        this.onUpdate = function() {
            var value = this.doc.getValue();
            var annotations = validate(value);
            this.sender.emit("annotate", annotations);
        };
    }).call(MyWorker.prototype);

    exports.MyWorker = MyWorker;
});

window.onmessage({
    data: {
        init : true,
        module: 'ace/worker/my-worker',
        classname : "MyWorker"
    }
});

