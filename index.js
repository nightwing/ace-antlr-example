var ace = require("ace-builds")
require("ace-builds/webpack-resolver");

var Worker = require('worker-loader!./my-worker.js');



ace.define('ace/mode/my-mode',[], function(require, exports, module) {
    var oop = require("ace/lib/oop");
    var TextMode = require("ace/mode/text").Mode;
    var TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;

    var MyHighlightRules = function() {
        var keywordMapper = this.createKeywordMapper({
            "keyword.control": "if|then|else",
            "keyword.operator": "and|or|not",
            "keyword.other": "class",
            "storage.type": "int|float|text",
            "storage.modifier": "private|public",
            "support.function": "print|sort",
            "constant.language": "true|false"
  }, "identifier");
        this.$rules = {
            "start": [
                { token : "keyowrd", regex : "\\*" },
            ]
        };
    };
    oop.inherits(MyHighlightRules, TextHighlightRules);

    var MyMode = function() {
        this.HighlightRules = MyHighlightRules;
    };
    oop.inherits(MyMode, TextMode);

    (function() {

        this.$id = "ace/mode/my-mode";
        
        var WorkerClient = require("ace/worker/worker_client").WorkerClient;
        function WebpackWorkerClient(worker) {
            this.$sendDeltaQueue = this.$sendDeltaQueue.bind(this);
            this.changeListener = this.changeListener.bind(this);
            this.onMessage = this.onMessage.bind(this);
            this.$worker = worker;
            this.callbackId = 1;
            this.callbacks = {};
            this.$worker.onmessage = this.onMessage;
        }
        WebpackWorkerClient.prototype = WorkerClient.prototype;
        
        this.createWorker = function(session) {
            this.$worker = new WebpackWorkerClient(new Worker());
            this.$worker.attachToDocument(session.getDocument());

            this.$worker.on("errors", function(e) {
                session.setAnnotations(e.data);
            });

            this.$worker.on("annotate", function(e) {
                session.setAnnotations(e.data);
            });

            this.$worker.on("terminate", function() {
                session.clearAnnotations();
            });

            return this.$worker;
        };
        

    }).call(MyMode.prototype);

    exports.Mode = MyMode;
});


var editor = ace.edit("editor");
editor.setTheme("ace/theme/twilight");
editor.session.setMode("ace/mode/my-mode");


