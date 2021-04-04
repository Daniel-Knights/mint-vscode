import vscode = require("vscode");
import cp = require("child_process");
import fs = require("fs");

import { getDirtyFile } from "./utils";

export class MintFormattingProvider implements vscode.DocumentFormattingEditProvider {
  public provideDocumentFormattingEdits(
    document: vscode.TextDocument
  ): Thenable<vscode.TextEdit[]> {
    return new Promise((resolve, reject) => {
      const file = getDirtyFile(document);

      const res = cp.spawnSync("mint", ["format", file], {
        cwd: vscode.workspace.workspaceFolders[0].uri.path,
      });

      if (res.status !== 0) {
        reject(res.error);
      } else {
        if (!fs.existsSync(file) || document.fileName) {
          reject(file + " file not found");
        } else {
          const range = document.validateRange(
            new vscode.Range(
              new vscode.Position(0, 0),
              new vscode.Position(1000000, 1000000)
            )
          );
          resolve([vscode.TextEdit.replace(range, document.getText())]);
        }
      }
    });
  }
}
