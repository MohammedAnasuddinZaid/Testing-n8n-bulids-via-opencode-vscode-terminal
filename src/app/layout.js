export const metadata = {
  title: 'Pawverse — A 3D Interactive World for Dogs',
  description: 'An immersive, interactive 3D website built with React Three Fiber. Explore the Pawverse — where every paw leaves a print.',
  openGraph: {
    title: 'Pawverse — 3D World for Dogs',
    description: 'Interactive 3D experience with physics toys, a lovable dog, and a vibrant park environment.',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="h-full m-0 p-0 overflow-hidden bg-black">{children}</body>
    </html>
  )
}
