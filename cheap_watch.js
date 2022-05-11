import { resolve } from 'path'
import { execSync as exec_sync } from 'child_process'
import cheap_watch from 'cheap-watch'

const [ ,, input_directory, ...cmd_args ] = process.argv

const full_command = cmd_args.join(' ')

const execute = () => {
	try {
		exec_sync(full_command, {
			stdio: 'inherit',
		})
	} catch (_) {}
}

execute()

const watcher = new cheap_watch({ dir: input_directory })

watcher.init()
watcher.on('+', execute)
