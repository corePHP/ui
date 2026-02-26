import { mkdirSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'

/**
 * Converts a registry alias (e.g. "@/components/ui") to a real filesystem path.
 * Assumes the alias uses "@" as the src root.
 */
export function aliasToPath(alias: string, cwd: string = process.cwd()): string {
  // Strip leading "@/" and resolve from cwd
  const relative = alias.replace(/^@\//, 'src/')
  return resolve(cwd, relative)
}

/**
 * Writes a file, creating parent directories if needed.
 */
export function writeFileSafe(filePath: string, content: string): void {
  mkdirSync(dirname(filePath), { recursive: true })
  writeFileSync(filePath, content, 'utf-8')
}

/**
 * Checks if a file already exists at the given path.
 */
export function fileExists(filePath: string): boolean {
  return existsSync(filePath)
}

/**
 * Detects the package manager in use by checking for lockfiles.
 */
export function detectPackageManager(cwd: string = process.cwd()): 'pnpm' | 'yarn' | 'bun' | 'npm' {
  if (existsSync(resolve(cwd, 'pnpm-lock.yaml'))) return 'pnpm'
  if (existsSync(resolve(cwd, 'yarn.lock'))) return 'yarn'
  if (existsSync(resolve(cwd, 'bun.lockb'))) return 'bun'
  return 'npm'
}

/**
 * Installs the given packages using the detected package manager.
 * Returns true on success, false on failure.
 */
export function installPackages(packages: string[], cwd: string = process.cwd()): boolean {
  const pm = detectPackageManager(cwd)
  const subcommand = pm === 'npm' ? 'install' : 'add'
  const result = spawnSync(pm, [subcommand, ...packages], { cwd, stdio: 'inherit' })
  return result.status === 0
}
