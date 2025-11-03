import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/repo/$repoId/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/repo/$repoId/"!</div>
}
