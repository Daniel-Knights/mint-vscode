import * as fs from 'fs'
import * as cmd from './commands'
import { commands, languages, workspace, window, ExtensionContext } from 'vscode'
import { LanguageClient } from 'vscode-languageclient'
import { MintFormattingProvider } from './formatter'

let client: LanguageClient

export function activate(context: ExtensionContext): void {
  // Set context activated
  commands.executeCommand('setContext', 'mint:isActivated', true)

  // Register formatting provider
  languages.registerDocumentFormattingEditProvider('mint', new MintFormattingProvider())

  // Register commands
  commands.registerCommand('mint.build', cmd.mintBuildCommand)
  commands.registerCommand('mint.compile', cmd.mintCompileCommand)
  commands.registerCommand('mint.docs', cmd.mintDocsCommand)
  commands.registerCommand('mint.formatAll', cmd.mintFormatAllCommand)
  commands.registerCommand('mint.init', cmd.mintInitCommand)
  commands.registerCommand('mint.install', cmd.mintInstallCommand)
  commands.registerCommand('mint.loc', cmd.mintCountLinesCommand)
  commands.registerCommand('mint.start', cmd.mintStartCommand)
  commands.registerCommand('mint.test', cmd.mintTestCommand)
  commands.registerCommand('mint.version', cmd.mintVersionCommand)

  const binaryLocation: string = workspace.getConfiguration('mint.languageServer').get('location')

  if (!binaryLocation) return

  if (fs.existsSync(binaryLocation)) {
    // Create the language client
    client = new LanguageClient(
      'mint_language_server',
      'Mint Language Server',
      {
        command: binaryLocation,
        args: ['ls'],
      },
      {
        documentSelector: [{ scheme: 'file', language: 'mint' }],
      }
    )

    // Start the client
    context.subscriptions.push(client.start())
  } else {
    window.showErrorMessage('Mint binary not found! You specified ' + binaryLocation)
  }
}

export function deactivate(): void {
  // Set context deactivated
  commands.executeCommand('setContext', 'mint:isActivated', false)

  // Stop the language server client.
  if (client) client.stop()
}
