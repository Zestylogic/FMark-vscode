const vscode = require('vscode');
const finterop = require('./fmarkinterop')

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    const contentProvider = new finterop.FMarkContentProvider(context);
    const contentProviderRegistration = vscode.workspace.registerTextDocumentContentProvider('fmark-preview', contentProvider);

    // vscode.workspace.openTextDocument(customUri)
    // .then(function(doc) {
    //     // show document in a new editor in a new tab
    //     return vscode.window.showTextDocument(doc, 
    //         vscode.ViewColumn.Two, true);
    // });

    context.subscriptions.push(vscode.commands.registerCommand('fmark.openPreview', finterop.openPreview));
    context.subscriptions.push(vscode.commands.registerCommand('fmark.makehtml', finterop.makehtml));

    context.subscriptions.push(vscode.workspace.onDidSaveTextDocument(document => {
        if (finterop.isFMarkFile(document)) {
            contentProvider.updateFMark(document);
        }
    }));

    context.subscriptions.push(vscode.workspace.onDidChangeTextDocument((event) => {
        if (finterop.isFMarkFile(event.document)) {
			contentProvider.update(event.document)
		}
    }));

    context.subscriptions.push(contentProviderRegistration);
}

// this method is called when your extension is deactivated
function deactivate() {
}

exports.activate = activate;
exports.deactivate = deactivate;