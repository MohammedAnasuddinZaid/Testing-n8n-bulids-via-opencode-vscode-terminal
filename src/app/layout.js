export const metadata = {
  title: 'Pawverse - A 3D World for Dogs',
  description:
    'An immersive, interactive 3D website dedicated to our four-legged friends. Explore the Pawverse.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full m-0 p-0 overflow-hidden">{children}</body>
    </html>
  )
}
