import {createRootRoute, Outlet} from '@tanstack/react-router'

export function RootLayout() {
  return (
    <div className="w-full h-full bg-slate-950">
      <Outlet/>
    </div>
  )
}

export const Route = createRootRoute({
  component: RootLayout,
})
