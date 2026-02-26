import { Command } from 'commander'
import { checkbox } from '@inquirer/prompts'
import pc from 'picocolors'
import ora from 'ora'
import { readConfig } from '../lib/config.js'
import {
  fetchRegistry,
  fetchComponentFile,
  findComponent,
} from '../lib/registry.js'
import { aliasToPath, writeFileSafe, fileExists, detectPackageManager, installPackages } from '../lib/utils.js'
import { basename } from 'node:path'

export const add = new Command('add')
  .description('Add a component to your project')
  .argument('[components...]', 'Component names to add')
  .option('-o, --overwrite', 'Overwrite existing files', false)
  .action(async (componentNames: string[], opts: { overwrite: boolean }) => {
    const spinner = ora('Fetching registry...').start()

    let registry
    try {
      registry = await fetchRegistry()
      spinner.succeed('Registry loaded')
    } catch (err) {
      spinner.fail('Failed to fetch registry')
      console.error(pc.red(String(err)))
      process.exit(1)
    }

    // If no components passed, show interactive picker
    if (componentNames.length === 0) {
      const choices = registry.items.map((item) => ({
        name: `${item.name} ${pc.dim(`— ${item.description}`)}`,
        value: item.name,
      }))
      componentNames = await checkbox({
        message: 'Select components to add:',
        choices,
      })
      if (componentNames.length === 0) {
        console.log(pc.yellow('No components selected.'))
        process.exit(0)
      }
    }

    let config
    try {
      config = readConfig()
    } catch (err) {
      console.error(pc.red(String(err)))
      process.exit(1)
    }

    const uiDir = aliasToPath(config.aliases.ui)
    const allDeps = new Set<string>()

    for (const name of componentNames) {
      const item = findComponent(registry, name)
      if (!item) {
        console.log(pc.red(`  Component "${name}" not found in registry.`))
        continue
      }

      console.log(pc.bold(`\nAdding ${name}...`))

      for (const file of item.files) {
        const fileName = basename(file.path)
        const dest = `${uiDir}/${fileName}`

        if (fileExists(dest) && !opts.overwrite) {
          console.log(pc.yellow(`  Skipped ${fileName} (already exists — use --overwrite to replace)`))
          continue
        }

        const spinner = ora(`Fetching ${fileName}`).start()
        try {
          const content = await fetchComponentFile(registry.baseUrl, file.path)
          writeFileSafe(dest, content)
          spinner.succeed(pc.green(`${fileName} → ${dest}`))
        } catch (err) {
          spinner.fail(`Failed to fetch ${fileName}`)
          console.error(pc.red(String(err)))
        }
      }

      for (const dep of item.dependencies) {
        allDeps.add(dep)
      }
    }

    if (allDeps.size > 0) {
      const deps = [...allDeps]
      const pm = detectPackageManager()
      const spinner = ora(`Installing dependencies via ${pm}...`).start()
      const ok = installPackages(deps)
      if (ok) {
        spinner.succeed(pc.green(`Installed: ${deps.join(', ')}`))
      } else {
        spinner.fail('Dependency installation failed')
        console.log(pc.yellow(`  Run manually: ${pm} ${pm === 'npm' ? 'install' : 'add'} ${deps.join(' ')}`))
      }
    }
  })
