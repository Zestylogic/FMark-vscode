const vscode = require('vscode');

function isFMarkFile(document) {
    return document.languageId === 'fmark';
}

function openPreview(uri) {
    console.log('Opened preview for FMark.');
    console.log('File location: ' + uri.toString());
    return vscode.commands.executeCommand(
        'vscode.previewHtml',
        uri,
        vscode.ViewColumn.Two,
        'Preview'
    );
}

function recompileFMarkFile(uri) {
    console.log('Recompiling: ' + uri.toString());
}

function recompileAllFMark() {
    vscode.workspace.textDocuments.forEach(document => {
        console.log("Recompiling everything")
        if(isFMarkFile(document)) {
            console.log("Found fmark file at: " + document.uri)
            recompileFMarkFile(document.uri);
        }
    });
}

module.exports = {
    openPreview,
    recompileFMarkFile,
    recompileAllFMark,
}