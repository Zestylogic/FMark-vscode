const vscode = require('vscode');
const finterop = require('./fmarkinterop')

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    context.subscriptions.push(vscode.commands.registerCommand('fmark.openPreview', finterop.openPreview));
    context.subscriptions.push(vscode.commands.registerCommand('fmark.recompile', finterop.recompileAllFMark));
    context.subscriptions.push(vscode.workspace.onDidSaveTextDocument(document => {
        if(finterop.isFMarkFile(document)) {
            finterop.recompileFMarkFile(document.uri);
        }
    }));
}

// this method is called when your extension is deactivated
function deactivate() {
}

exports.activate = activate;
exports.deactivate = deactivate;