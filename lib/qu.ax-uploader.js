// Codigo creado por @Emma (Violet's Version)
// Github: Elpapiema
// Este código es parte de Alya Bot y está bajo licencia GPL-3.0
// Puedes usarlo, modificarlo y redistribuirlo bajo los términos de la GPL-3.0

import fetch from 'node-fetch'
import { FormData, Blob } from 'formdata-node'
import { fileTypeFromBuffer } from 'file-type'

export default async (buffer) => {
  const { ext, mime } = await fileTypeFromBuffer(buffer)
  if (!ext || !mime) throw new Error('❌ No se pudo determinar el tipo de archivo')

  const form = new FormData()
  const blob = new Blob([buffer], { type: mime })
  form.append('files[]', blob, 'tmp.' + ext)

  const res = await fetch('https://qu.ax/upload.php', {
    method: 'POST',
    body: form,
  })

  const result = await res.json()

  if (result && result.success && result.files?.[0]?.url) {
    return result.files[0].url
  } else {
    throw new Error(`❌ Falló la subida: ${JSON.stringify(result)}`)
  }
}
