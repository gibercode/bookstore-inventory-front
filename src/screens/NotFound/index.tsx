import { Link } from 'react-router-dom'
import { Card, Notice } from '@/components'

export const NotFound = () => (
  <Card>
    <Notice
      title="Página no encontrada"
      action={<Link to="/">Volver a Libros</Link>}
    >
      La dirección que buscas no existe.
    </Notice>
  </Card>
)
