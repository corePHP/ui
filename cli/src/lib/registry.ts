const REGISTRY_URL =
  'https://raw.githubusercontent.com/corephp/core-ui/main/registry/registry.json'

export interface RegistryFile {
  path: string
  type: string
}

export interface RegistryItem {
  name: string
  type: string
  description: string
  dependencies: string[]
  files: RegistryFile[]
}

export interface Registry {
  name: string
  baseUrl: string
  items: RegistryItem[]
}

export async function fetchRegistry(): Promise<Registry> {
  const res = await fetch(REGISTRY_URL)
  if (!res.ok) {
    throw new Error(`Failed to fetch registry: ${res.status} ${res.statusText}`)
  }
  return res.json() as Promise<Registry>
}

export async function fetchComponentFile(
  baseUrl: string,
  filePath: string
): Promise<string> {
  const url = `${baseUrl}/${filePath}`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to fetch component file: ${url} (${res.status})`)
  }
  return res.text()
}

export function findComponent(
  registry: Registry,
  name: string
): RegistryItem | undefined {
  return registry.items.find((item) => item.name === name)
}
