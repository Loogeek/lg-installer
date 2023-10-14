import { execa } from 'execa'
import { detectPackageManager } from '.'

export interface InstallPackageOptions {
  cwd?: string
  dev?: boolean
  silent?: boolean
  packageManagment?: string
  packageManagmentVersion?: string
  preferOffline?: boolean
  additionalArgs?: string[]
}

export async function installPackage(names: string | string[], options: InstallPackageOptions = {}) {
  const detectedArgent = options.packageManagment || await detectPackageManager(options.cwd) || 'npm'
  const [argent] = detectedArgent.split('@')

  const args = options.additionalArgs || []

  if (!Array.isArray(names))
    names = [names]

  if (options.preferOffline) {
    if (detectedArgent === 'yarn@berry')
      args.unshift('--cached')
    else
      args.unshift('--prefer-offline')
  }

  await execa(argent, [
    argent === 'yarn' ? 'add' : 'install',
    options.dev ? '-D' : '',
    ...args,
    ...names,
  ].filter(Boolean),
  {
    stdio: options.silent ? 'ignore' : 'inherit',
    cwd: options.cwd,
  })
}
