'use client'

import { useEffect, useRef, useState } from 'react'
// @ts-ignore
import EditorJS, { type BlockTool } from '@editorjs/editorjs'
// @ts-ignore
import Header from '@editorjs/header'
// @ts-ignore
import List from '@editorjs/list'
// @ts-ignore
import Checklist from '@editorjs/checklist'
// @ts-ignore
import Table from '@editorjs/table'
// @ts-ignore
import Code from '@editorjs/code'
// @ts-ignore
import InlineCode from '@editorjs/inline-code'
// @ts-ignore
import Underline from '@editorjs/underline'
// @ts-ignore
import Marker from '@editorjs/marker'
// @ts-ignore
import ImageTool from '@editorjs/image'
// @ts-ignore
import Embed from '@editorjs/embed'
// @ts-ignore
import Quote from '@editorjs/quote'
// @ts-ignore
import DragDrop from 'editorjs-drag-drop'

import StrikethroughInline from './strikethrough'

import {
  Type,
  Image as ImageIcon,
  Video,
  Volume2,
  Youtube,
  Hand,
  X,
  Link,
  Clock,
  Trash2,
  Upload,
} from 'lucide-react'
import DividerTool from './Divider'
import YoutubeModal from './YoutubeModal'
import CoverModal from './CoverModal'

// Helper to extract Youtube ID
const getYoutubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
}

const EDITOR_HOLDER_ID = 'editorjs'
class LiveMediaTool implements BlockTool {
  private data: any
  private wrapper: HTMLElement
  private descriptionField: HTMLElement | null = null

  constructor({ data }: { data: any }) {
    this.data = data || { url: '', type: '', name: '', description: '' }
    this.wrapper = document.createElement('div')
  }

  render() {
    this.wrapper.style.padding = '15px'
    this.wrapper.style.border = '1px solid #f0f0f0'
    this.wrapper.style.borderRadius = '10px'

    if (this.data.url) {
      this._renderPlayer(this.data.url, this.data.type)
    } else {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'video/*,audio/*'
      input.style.display = 'none'

      input.onchange = (e: any) => {
        const file = e.target.files[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (event) => {
          const url = event.target?.result as string
          const type = file.type.startsWith('video') ? 'video' : 'audio'
          this.data = { ...this.data, url, type, name: file.name }
          this._renderPlayer(url, type)
        }
        reader.readAsDataURL(file)
      }

      this.wrapper.appendChild(input)
      setTimeout(() => input.click(), 0)
    }

    return this.wrapper
  }

  _renderPlayer(url: string, type: 'video' | 'audio') {
    this.wrapper.innerHTML = ''

    const media = document.createElement(type)
    media.src = url
    media.controls = true
    media.style.width = '100%'

    const desc = document.createElement('div')
    desc.contentEditable = 'true'
    desc.dataset.placeholder = 'Add a description...'
    desc.innerHTML = this.data.description || ''
    desc.style.cssText =
      'margin-top:10px;padding:8px;border-left:2px solid #0070f3;'

    desc.addEventListener('input', () => {
      this.data.description = desc.innerHTML
    })

    this.descriptionField = desc
    this.wrapper.appendChild(media)
    this.wrapper.appendChild(desc)
  }

  save() {
    return {
      ...this.data,
      description: this.descriptionField
        ? this.descriptionField.innerHTML
        : this.data.description,
    }
  }
}

export default function EditorComponent() {
  const editorInstance = useRef<EditorJS | null>(null)
  const [showYoutubeModal, setShowYoutubeModal] = useState(false)
  const [showCoverModal, setShowCoverModal] = useState(false)
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [isHoveringCover, setIsHoveringCover] = useState(false)

  const holderRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const activeMediaType = useRef<string | null>(null)


  useEffect(() => {
    if (!editorInstance.current) {
      initEditor()
    }

    return () => {
      if (
        editorInstance.current &&
        typeof editorInstance.current.destroy === 'function'
      ) {
        const editorToDestroy = editorInstance.current
        editorInstance.current = null // Allow new instance to be created immediately if needed

        // Wait for ready before destroying to avoid "not ready" errors which leave ghost instances
        if (editorToDestroy.isReady) {
          editorToDestroy.isReady
            .then(() => {
              editorToDestroy.destroy()
            })
            .catch((e) => {
              console.error('Error destroying editor instance:', e)
            })
        }
      }
    }
  }, [])

  const initEditor = () => {
    if (!holderRef.current) return

    // Clean up any existing content in the holder to prevent duplicates
    holderRef.current.innerHTML = ''

    const editor = new EditorJS({
      holder: holderRef.current,
      placeholder: "Press '/' for tools...",

      onReady: () => {
        // @ts-ignore
        new DragDrop(editor)
      },

      tools: {
        h1: {
          class: Header,
          inlineToolbar: true,
          toolbox: { title: 'Main Title', icon: '<b>H1</b>' },
          config: { levels: [1], defaultLevel: 1 },
          shortcut: 'CMD+SHIFT+X',
          onReady: () => console.log('h1 tool is ready'),
        },
        h2: {
          class: Header,
          inlineToolbar: true,
          toolbox: { title: 'Subtitle', icon: '<b>H2</b>' },
          config: { levels: [2], defaultLevel: 2 },
        },
        h3: {
          class: Header,
          inlineToolbar: true,
          toolbox: { title: 'Section', icon: '<b>H3</b>' },
          config: { levels: [3], defaultLevel: 3 },
        },
        strikethrough: {
          class: StrikethroughInline,
          shortcut: 'CMD+SHIFT+S',
          onReady: () => console.log('Strikethrough tool is ready'),
        },
        media: {
          class: LiveMediaTool,
          toolbox: false as any, // Hides from toolbox
        },
        list: {
          class: List,
          inlineToolbar: true,
        },
        checklist: {
          class: Checklist,
          inlineToolbar: true,
        },
        table: Table,
        quote: {
          class: Quote,
          inlineToolbar: true,
        },
        code: Code,
        delimiter: {
          class: DividerTool,
          toolbox: { title: 'Divider' },
        },
        inlineCode: InlineCode,
        marker: Marker,
        underline: Underline,
        image: {
          class: ImageTool,
          toolbox: false as any,
          config: {
            uploader: {
              async uploadByFile(file: File) {
                return new Promise((resolve) => {
                  const reader = new FileReader()
                  reader.onload = () => {
                    resolve({
                      success: 1,
                      file: {
                        url: reader.result as string,
                      },
                    })
                  }
                  reader.readAsDataURL(file)
                })
              },
            },
          },
        },
        embed: Embed,
      },
    })

    editorInstance.current = editor
  }

  const insertBlock = (tool: string, data: any = {}) => {
    if (editorInstance.current) {
      // Special handling for paragraph to avoid multiple empty blocks
      if (tool === 'paragraph') {
        const index = editorInstance.current.blocks.getCurrentBlockIndex()
        const block = editorInstance.current.blocks.getBlockByIndex(index)

        // If current block is paragraph and is empty, just focus it
        if (block?.name === 'paragraph' && block.isEmpty) {
          editorInstance.current.caret.setToBlock(index)
          return
        }
      }

      editorInstance.current.blocks.insert(tool, data)
    }
  }

  const triggerFileSelect = (type: string, skipModal = false) => {
    activeMediaType.current = type

    if (type === 'cover' && !skipModal) {
      setShowCoverModal(true)
      return
    }

    if (fileInputRef.current) {
      if (type === 'image' || type === 'cover') fileInputRef.current.accept = 'image/*'
      else if (type === 'video') fileInputRef.current.accept = 'video/*'
      else if (type === 'audio') fileInputRef.current.accept = 'audio/*'
      else fileInputRef.current.accept = '*/*'

      fileInputRef.current.click()
    }
  }

  const handleCoverLinkSubmit = (url: string) => {
    setCoverImage(url)
    setShowCoverModal(false)
  }

  const handleCoverUploadClick = () => {
    // Determine if we should trigger file select immediately or through modal logic
    // Actually we just want to trigger the file input now essentially 'skipping' the modal check
    // but we can keep the modal open or close it? 
    // Usually selecting file eventually closes it. 
    // Let's trigger file select, and when file is selected, we close modal (in onFileChange)
    triggerFileSelect('cover', true)
    // We can close modal now or wait for file. Let's close modal when file is chosen or now.
    // Notion keeps it open until file selected? No, native file picker blocks.
    setShowCoverModal(false)
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const type = activeMediaType.current
    if (!type) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const url = event.target?.result as string

      if (editorInstance.current) {
        if (type === 'image') {
          editorInstance.current.blocks.insert('image', {
            file: { url },
          })
        } else if (type === 'cover') {
          setCoverImage(url)
        } else {
          editorInstance.current.blocks.insert('media', {
            url,
            type: type, // 'video' or 'audio'
            name: file.name,
          })
        }
      } else if (type === 'cover') {
        // Allow setting cover even if editor not fully ready (though it should be)
        setCoverImage(url)
      }
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleYoutubeSubmit = (
    ytUrl: string,
    ytStart: string,
    ytEnd: string
  ) => {
    if (!ytUrl) return

    const videoId = getYoutubeId(ytUrl)
    if (videoId && editorInstance.current) {
      let embedUrl = `https://www.youtube.com/embed/${videoId}`
      const params = []
      if (ytStart) params.push(`start=${ytStart}`)
      if (ytEnd) params.push(`end=${ytEnd}`)

      if (params.length > 0) {
        embedUrl += `?${params.join('&')}`
      }

      editorInstance.current.blocks.insert('embed', {
        service: 'youtube',
        source: ytUrl,
        embed: embedUrl,
        width: 580,
        height: 320,
      })

      setShowYoutubeModal(false)
    }
  }

  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#fff' }}>
      {/* Cover Image Area */}
      {coverImage && (
        <div
          style={{
            width: '100%',
            height: '30vh',
            minHeight: '200px',
            position: 'relative',
            backgroundColor: '#f6f6f6',
          }}
          onMouseEnter={() => setIsHoveringCover(true)}
          onMouseLeave={() => setIsHoveringCover(false)}
        >
          <img
            src={coverImage}
            alt="Cover"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />

          {/* Cover Controls */}
          {isHoveringCover && (
            <div
              style={{
                position: 'absolute',
                bottom: 20,
                right: 40,
                display: 'flex',
                gap: 8,
                zIndex: 10,
              }}
            >
              <button
                onClick={() => triggerFileSelect('cover')}
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(0,0,0,0.1)',
                  borderRadius: '4px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#37352f',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                  transition: 'background 0.1s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = '#fff')}
                onMouseOut={(e) =>
                  (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)')
                }
              >
                <Upload size={14} />
                Change cover
              </button>
              <button
                onClick={() => setCoverImage(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(0,0,0,0.1)',
                  borderRadius: '4px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#37352f',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                  transition: 'background 0.1s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = '#fff')}
                onMouseOut={(e) =>
                  (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)')
                }
              >
                <Trash2 size={14} />
                Remove
              </button>
            </div>
          )}
        </div>
      )}

      <div
        className="editor-container"
        style={{ maxWidth: 850, margin: '0 auto', position: 'relative', padding: '40px' }}
      >
        {!coverImage && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 40, // Match padding
              zIndex: 5,
            }}
          >
            <button
              onClick={() => triggerFileSelect('cover')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 12px',
                background: 'none',
                border: 'none',
                borderRadius: '4px',
                color: '#9ca3af',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#eff1f3'
                e.currentTarget.style.color = '#374151'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'none'
                e.currentTarget.style.color = '#9ca3af'
              }}
            >
              <div
                style={{
                  width: 14,
                  height: 14,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ImageIcon size={14} />
              </div>
              Add cover
            </button>
          </div>
        )}

        <div
          id={EDITOR_HOLDER_ID}
          ref={holderRef}
          style={{
            minHeight: 450,
            background: '#fff',
            paddingTop: 20,
          }}
        />
      </div >

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={onFileChange}
      />

      <YoutubeModal
        isOpen={showYoutubeModal}
        onClose={() => setShowYoutubeModal(false)}
        onSubmit={handleYoutubeSubmit}
      />

      <CoverModal
        isOpen={showCoverModal}
        onClose={() => setShowCoverModal(false)}
        onUploadClick={handleCoverUploadClick}
        onLinkSubmit={handleCoverLinkSubmit}
      />

      {/* Floating Bottom Toolbar */}
      <div
        style={{
          position: 'fixed',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'white',
          padding: '10px 24px',
          borderRadius: 999,
          boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
          display: 'flex',
          gap: 24,
          alignItems: 'center',
          zIndex: 9999,
          border: '1px solid #f0f0f0',
        }}
      >
        <button
          onClick={() => insertBlock('paragraph')}
          title="Text"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#444',
          }}
        >
          <Type size={20} />
        </button>

        <button
          onClick={() => triggerFileSelect('image')}
          title="Image"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#444',
          }}
        >
          <ImageIcon size={20} />
        </button>

        <button
          onClick={() => triggerFileSelect('video')}
          title="Video"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#444',
          }}
        >
          <Video size={20} />
        </button>

        <button
          onClick={() => triggerFileSelect('audio')}
          title="Audio"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#444',
          }}
        >
          <Volume2 size={20} />
        </button>

        <button
          onClick={() => setShowYoutubeModal(true)}
          title="Embed/Youtube"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#444',
          }}
        >
          <Youtube size={20} />
        </button>
      </div>
    </div >
  )
}
