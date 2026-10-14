import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/newsreader/opsz.css'
import '@fontsource-variable/newsreader/opsz-italic.css'
import '@fontsource-variable/ibm-plex-sans'
import './styles/tokens.css'
import './styles/global.css'
import { Presentation } from './shell/Presentation'
import { stages } from './content/stages'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Presentation stages={stages} />
  </StrictMode>,
)
