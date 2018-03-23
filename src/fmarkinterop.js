const vscode = require('vscode');
const fmark = require('./FMark/FMark/js/fmark.js');
const beautify = require('js-beautify').html;
const fs = require('graceful-fs');
const path = require('path');

class FMarkContentProvider {

    constructor (context) {
        this._onDidChange = new vscode.EventEmitter();
        this._waiting = false;
        this.content = "";
    }

    provideTextDocumentContent(previewUri) {
        return this.content;
    }

    get onDidChange() {
        return this._onDidChange.event;
    }

    updateFMark(uri) {
        uri = vscode.window.activeTextEditor.document.uri;
        // New fix for windows, remove leading forward slash
        var correctPath = (path.dirname(uri.path)+'/')
        if(process.platform == 'win32') {
            correctPath.replace(/^\//,"");
        }
        this.content = generateHTML(uri,correctPath);
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

function generateHTML(uri,fPath) {
    return vscode.workspace.openTextDocument(uri).then((doc) => {
        var docArray = [];
        for(var i = 0; i < doc.lineCount; ++i) {
            docArray.push(doc.lineAt(i).text);
        }
        return beautify(fmark.processMarkdownString(fPath, docArray).data);
    });
}

function makehtml(uri) {
    // Save to file
    uri = vscode.window.activeTextEditor.document.uri;
    var correctPath = (path.dirname(uri.path)+'/')
    if(process.platform == 'win32') {
        correctPath.replace(/^\//,"");
    }
    var html = generateHTML(uri,correctPath);
    var filename = (vscode.window.activeTextEditor.document.fileName).replace(/(.*)(\.(fmark|md))/,"$1.html");
    fs.writeFileSync(filename, html._value);
    return true;
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
    console.log(fmark.processMarkdownString(document.getText()));
}

function recompileAllFMark() {
    vscode.workspace.textDocuments.forEach(document => {
        if(isFMarkFile(document)) {
            recompileFMarkFile(document);
        }
    });
}

function getPreviewUri(uri) {
    var previewUri = uri;
    previewUri = vscode.Uri.parse('fmark-preview://single-preview.rendered');
    return previewUri;
}

module.exports = {
    FMarkContentProvider,
    openPreview,
    isFMarkFile,
    getPreviewUri,
    makehtml
}
