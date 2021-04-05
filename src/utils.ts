import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'
import {
  window,
  tasks,
  Task,
  ShellExecution,
  TaskScope,
  TextDocument,
  OutputChannel,
  TaskExecution,
} from 'vscode'

/**
 * Returns temporary file path of edited document.
 */
export function getDirtyFile(document: TextDocument): string {
  const dirtyFilePath = path.normalize(path.join(os.tmpdir(), 'vscodemintdirty.mint'))

  fs.writeFileSync(dirtyFilePath, document.getText())

  return dirtyFilePath
}

export function createAndShowOutputWindow(): OutputChannel {
  const channel = window.createOutputChannel('mint')

  channel.show()

  return channel
}

/**
 * Run a mint subcommand as a VSCode task, ie `mint format`
 *
 * @param subcommand The mint subcommand to run, ie `format`
 * @param description The VSCode description to show, ie "Format all files"
 */
export function runMintCommandAsTask(
  subcommand: string,
  description: string
): Thenable<TaskExecution> {
  return tasks.executeTask(
    new Task(
      { command: '', type: '' },
      TaskScope.Workspace,
      description,
      'mint',
      new ShellExecution(`mint ${subcommand}`)
    )
  )
}

/**
 * Wait for a number of seconds
 *
 * @param seconds The number of seconds to wait before completing
 */
export function promiseSeconds(seconds: number): Thenable<void> {
  return new Promise((res) => {
    setTimeout(res, 1000 * seconds)
  })
}
