import {
  workspace,
  Range,
  Position,
  TextEdit,
  DocumentFormattingEditProvider,
  TextDocument,
} from 'vscode'
import * as cp from 'child_process'
import * as fs from 'fs'

import { getDirtyFile } from './utils'

export class MintFormattingProvider implements DocumentFormattingEditProvider {
  public provideDocumentFormattingEdits(document: TextDocument): Thenable<TextEdit[]> {
    return new Promise((resolve, reject) => {
      const file = getDirtyFile(document)

      const res = cp.spawnSync('mint', ['format', file], {
        cwd: workspace.workspaceFolders[0].uri.path,
      })

      if (res.status !== 0) {
        reject(res.error)
      } else {
        if (!fs.existsSync(file) || document.fileName) {
          reject(file + ' file not found')
        } else {
          const range = document.validateRange(
            new Range(new Position(0, 0), new Position(1000000, 1000000))
          )

          resolve([TextEdit.replace(range, document.getText())])
        }
      }
    })
  }
}
