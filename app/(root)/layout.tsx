import React, { ReactNode } from 'react'

const RootLayout =( { children } : {children: ReactNode}) => {
  return (
    <main>
        {/* TODO NAVBAR */}
      {children}
         {/* TODO FOOTER */}

    </main>
  )
}

export default RootLayout
