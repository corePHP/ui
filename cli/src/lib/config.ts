import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

export interface ComponentsConfig {
  aliases: {
    ui: string
    utils: string
  }
}

const CONFIG_FILE = 'components.json'

const DEFAULT_CONFIG: ComponentsConfig = {
  aliases: {
    ui: '@/components/ui',
    utils: '@/lib/utils',
  },
}

export function configExists(cwd: string = process.cwd()): boolean {
  return existsSync(resolve(cwd, CONFIG_FILE))
}

export function readConfig(cwd: string = process.cwd()): ComponentsConfig {
  const configPath = resolve(cwd, CONFIG_FILE)
  if (!existsSync(configPath)) {
    throw new Error(
      `components.json not found. Run 'npx @corephp/ui init' first.`
    )
  }
  return JSON.parse(readFileSync(configPath, 'utf-8')) as ComponentsConfig
}

export function writeConfig(
  config: ComponentsConfig,
  cwd: string = process.cwd()
): void {
  const configPath = resolve(cwd, CONFIG_FILE)
  writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n', 'utf-8')
}

export { DEFAULT_CONFIG }
