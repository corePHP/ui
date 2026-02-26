import { Command } from 'commander'
import { input, confirm } from '@inquirer/prompts'
import pc from 'picocolors'
import { configExists, writeConfig, DEFAULT_CONFIG, type ComponentsConfig } from '../lib/config.js'

export const init = new Command('init')
  .description('Configure @corephp/ui for your project')
  .action(async () => {
    console.log(pc.bold('\nConfiguring @corephp/ui...\n'))

    if (configExists()) {
      const overwrite = await confirm({
        message: 'components.json already exists. Overwrite?',
        default: false,
      })
      if (!overwrite) {
        console.log(pc.yellow('Aborted.'))
        process.exit(0)
      }
    }

    const uiAlias = await input({
      message: 'Where should UI components be installed?',
      default: DEFAULT_CONFIG.aliases.ui,
    })

    const utilsAlias = await input({
      message: 'Where is your utils file?',
      default: DEFAULT_CONFIG.aliases.utils,
    })

    const config: ComponentsConfig = {
      aliases: {
        ui: uiAlias,
        utils: utilsAlias,
      },
    }

    writeConfig(config)

    console.log(pc.green('\ncomponents.json created successfully.'))
    console.log(pc.dim('\nYou can now run:'))
    console.log(pc.cyan('  npx @corephp/ui add button\n'))
  })
