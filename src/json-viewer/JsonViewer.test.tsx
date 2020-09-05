import '@testing-library/jest-dom'

import React from 'react'
import { render } from '@testing-library/react'
import { FormattedJson } from './JsonViewerPage'

describe('FormattedJson component', () => {
   it('renders null', () => {
      const rendered = render(<FormattedJson value={null} />)
      expect(rendered.container.textContent).toBe('')
   })

   it('renders {}', () => {
      const rendered = render(<FormattedJson value={{}} />)
      expect(rendered.container.textContent).toBe('- {}')
   })

   it('renders {"x": 3}', () => {
      const rendered = render(<FormattedJson value={{ x: 3 }} />)
      expect(rendered.container.textContent).toBe('- {"x": 3}')
   })

   it('renders a more complex object', () => {
      const rendered = render(<FormattedJson value={{ x: 3, y: { z: 5 } }} />)
      expect(rendered.container.textContent).toBe('- {"x": 3,-"y": {"z": 5}}')
   })
})
