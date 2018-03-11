const vscode = require('vscode');
const fmark = require('./FMark/FMark/js/fmark.js')

var singlePreviewSourceUri = null;

class FMarkContentProvider {

    constructor (context) {
        this._onDidChange = new vscode.EventEmitter();
        this._waiting = false;
    }

    provideTextDocumentContent(previewUri) {
        return this.content;
    }

    get onDidChange() {
        return this._onDidChange.event;
    }

    updateFMark(uri) {
        uri = vscode.window.activeTextEditor.document.uri;
        this.content = vscode.workspace.openTextDocument(uri).then((doc) => {
            var docArray = [];
            for(var i = 0; i < doc.lineCount; ++i) {
                docArray.push(doc.lineAt(i).text);
            }
            return fmark.processMarkdownString(docArray).data;
        });
        return this._onDidChange.fire(getPreviewUri(uri));
    }

    update(uri) {
        if(!this.waiting) {
            this.waiting = true;
            setTimeout(() => {
                this.waiting = false;
                this.updateFMark(uri);
            }, 300);
        }
    }
}

function isFMarkFile(document) {
    return document.languageId === 'fmark' && document.uri.scheme !== 'fmark-preview';
}

function openPreview() {
    uri = vscode.window.activeTextEditor.document.uri;
    return vscode.commands.executeCommand(
        'vscode.previewHtml',
        getPreviewUri(uri),
        vscode.ViewColumn.Two,
        'FMark Preview'
    );
}

function recompileFMarkFile(document) {
    console.log('Recompiling: ' + document.uri.toString());
    console.log(fmark.processMarkdownString(document.getText()));
}

function recompileAllFMark() {
    vscode.workspace.textDocuments.forEach(document => {
        console.log("Recompiling everything")
        if(isFMarkFile(document)) {
            console.log("Found fmark file at: " + document.uri)
            recompileFMarkFile(document);
        }
    });
}

function getPreviewUri(uri) {
    singlePreviewSourceUri = uri;

    var previewUri = uri;

    previewUri = vscode.Uri.parse('fmark-preview://single-preview.rendered');

    return previewUri;
}

module.exports = {
    FMarkContentProvider,
    openPreview,
    isFMarkFile,
    getPreviewUri,
}
