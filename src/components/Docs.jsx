import React from 'react'
import Header from './Header'
import Footer from './Footer'
import { SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from './ui/sidebar'

const Docs = () => {
  return (
    <div>
      <div className='xl:px-44 lg:px-20 md:px-14 px-6'>
        <Header />
        <aside className=''>
          {/* <SidebarMenuItem>
            <SidebarMenuButton />
            <SidebarMenuSub>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton />
              </SidebarMenuSubItem>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton />
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </SidebarMenuItem> */}
        </aside>
        <main className='h-screen'>
          <h1 className='text-white'>Docs</h1>
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default Docs