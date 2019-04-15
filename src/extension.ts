// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { getFileContent } from "./lib/get-file-content";
import { markdownHashFilter } from "markdown-hash-filter";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand("extension.mdFilter", () => {
    vscode.window
      .showInputBox({ placeHolder: "please type hash header" })
      .then(result => {
        if (
          typeof result === "string" &&
          typeof vscode.workspace.rootPath === "string"
        ) {
          const fileContents = getFileContent(vscode.workspace.rootPath);
          const content = fileContents
            .map(content => ({
              title: content.title,
              content: markdownHashFilter(content.content, result)
            }))
            .filter(content => content.content !== "")
            .map(content => content.title + "\n" + content.content)
            .join("\n");

          vscode.workspace
            .openTextDocument({
              content: content,
              language: "markdown"
            })
            .then(document => vscode.window.showTextDocument(document));
        }
      });
  });

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
