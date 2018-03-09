const vscode = require('vscode')

module.exports = {
    openPreview: function(uri) {
        console.log('Opened preview for FMark.');
        console.log('File location: ' + uri.toString());
        return vscode.commands.executeCommand(
            'vscode.previewHtml',
            uri,
            vscode.ViewColumn.Two,
            'Preview'
        );
    },

    recompileFMarkFile: function(uri) {
        console.log('Recompiling: ' + uri.toString());
    },

    recompileAllFMark: function() {
        vscode.workspace.textDocuments.forEach(document => {
            if(this.isFMarkFile(document)) {
                this.recompileAllFMark(document.uri);
            }
        });
    },

    isFMarkFile: function(document) {
        return document.languageId === 'fmark';
    },
}