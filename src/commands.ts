import { window, commands, Uri } from 'vscode'
import { runMintCommandAsTask, promiseSeconds } from './utils'

export function mintBuildCommand(): void {
  runMintCommandAsTask('build', 'Build production bundle')
}

export function mintCompileCommand(): void {
  runMintCommandAsTask('compile', 'Compile project into single JavaScript file')
}

export function mintDocsCommand(): void {
  runMintCommandAsTask('docs', 'Start documentation server')
}

export function mintFormatAllCommand(): void {
  runMintCommandAsTask('format', 'Format all files')
}

export async function mintInitCommand(): Promise<void> {
  const projectName = await window.showInputBox({
    prompt: 'Type the name of your project',
    placeHolder: 'mint-project',
  })

  const folder = await window.showOpenDialog({
    canSelectFiles: false,
    canSelectFolders: true,
    canSelectMany: false,
    openLabel: 'Create project',
  })

  const newProjectRoot = `${folder[0].path}/${projectName}`

  await runMintCommandAsTask(`init ${newProjectRoot}`, 'Init a new project')

  await promiseSeconds(2)

  await commands.executeCommand('vscode.openFolder', Uri.file(newProjectRoot))
}

export function mintInstallCommand(): void {
  runMintCommandAsTask('install', 'Install dependencies')
}

export function mintCountLinesCommand(): void {
  runMintCommandAsTask('loc', 'Count lines of code')
}

export function mintStartCommand(): void {
  runMintCommandAsTask('start', 'Start development server')
}

export function mintTestCommand(): void {
  runMintCommandAsTask('test', 'Run tests')
}

export function mintVersionCommand(): void {
  runMintCommandAsTask('version', 'Show current version')
}
