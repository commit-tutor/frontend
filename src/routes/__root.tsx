import {createRootRoute, Outlet} from '@tanstack/react-router'

export function RootLayout() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-neutral-800 font-sans">
      <div className="flex flex-col items-center w-[390px] h-[844px] bg-[#121212] text-white shadow-2xl rounded-3xl overflow-hidden">
        <div className="flex-1 w-full px-6 pt-6 py-6 overflow-y-auto scrollbar-hide">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export const Route = createRootRoute({
  component: RootLayout,
})
