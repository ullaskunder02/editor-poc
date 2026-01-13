'use client'
import dynamic from 'next/dynamic'

const EditorComponent = dynamic(() => import('./EditorComponent'), { ssr: false })

export default function Page() {
  return <EditorComponent />
}
