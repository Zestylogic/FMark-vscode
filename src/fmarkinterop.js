const vscode = require('vscode');
const fmark = require('./FMark/FMark/fmark.js')

var singlePreviewSourceUri = null;

class FMarkContentProvider {

    constructor (context) {
        this._onDidChange = new vscode.EventEmitter();
        this._waiting = false;
        this.content = "nothing";
    }

    provideTextDocumentContent(previewUri) {
        console.log(this.content)
        return this.content;
    }

    get onDidChange() {
        return this._onDidChange.event;
    }

    updateFMark(uri) {
        //prevUri = getPreviewUri(previewUri);
        console.log("hello")
        uri = vscode.window.activeTextEditor.document.uri;
        this.content = vscode.workspace.openTextDocument(uri).then((doc) => {
            return fmark.processMarkdownString(doc.getText()).data;
        });
        return this._onDidChange.fire(getPreviewUri(''));
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
    return vscode.commands.executeCommand(
        'vscode.previewHtml',
        vscode.Uri.parse('fmark-preview://single-preview.rendered'),
        vscode.ViewColumn.Two,
        'Preview'
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
    if (uri.scheme === 'fmark-preview') {
        return uri;
    }

    singlePreviewSourceUri = uri;

    var previewUri = uri;
    previewUri.scheme = 'fmark-preview';
    previewUri.path = 'single-preview.rendered';

    previewUri = vscode.Uri.parse('fmark-preview://single-preview.rendered');

    return previewUri;
}

module.exports = {
    FMarkContentProvider,
    openPreview,
    isFMarkFile,
    getPreviewUri,
}
