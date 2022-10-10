import type log from 'loglevel'
import z from 'zod'

export const networkConfigSchema = z.object({
  name: z.string(),
  port: z.string(),
  host: z.string()
})

export type NetworkConfig = z.infer<typeof networkConfigSchema>

export const networkPresetSchema = z.object({
  name: z.string(),
  configFileUrl: z
    .string()
    .url({ message: 'Invalid network configuration url.' })
    .endsWith('.toml', {
      message:
        'Invalid network configuration file extension. Only ".toml" files are supported.'
    })
})

export type NetworkPreset = z.infer<typeof networkPresetSchema>

export const networkPresetsSchema = z.array(networkPresetSchema)

export const fetchNetworkPreset = (url: string, logger: log.Logger) =>
  fetch(url)
    .then(res => res.json())
    .then(r => {
      return networkPresetsSchema.parse(r)
    })
    .catch(err => {
      logger.error(err)
      return []
    })
