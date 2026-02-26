#!/usr/bin/env node
import { Command } from 'commander'
import { init } from './commands/init.js'
import { add } from './commands/add.js'

const program = new Command()
  .name('@corephp/ui')
  .description('CorePHP UI component installer')
  .version('0.1.0')

program.addCommand(init)
program.addCommand(add)

program.parse()
