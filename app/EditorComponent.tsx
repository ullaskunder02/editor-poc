"use client"

import { useEffect, useRef } from "react"
// @ts-ignore
import EditorJS, { type BlockTool } from "@editorjs/editorjs"
// @ts-ignore
import Header from "@editorjs/header"
// @ts-ignore
import List from "@editorjs/list"
// @ts-ignore
import Checklist from "@editorjs/checklist"
// @ts-ignore
import Table from "@editorjs/table"
// @ts-ignore
import Code from "@editorjs/code"
// @ts-ignore
import InlineCode from "@editorjs/inline-code"
// @ts-ignore
import Underline from "@editorjs/underline"
// @ts-ignore
import Marker from "@editorjs/marker"
// @ts-ignore
import ImageTool from "@editorjs/image"
// @ts-ignore
import Embed from "@editorjs/embed"
// @ts-ignore
import Quote from "@editorjs/quote"
// @ts-ignore
import DragDrop from "editorjs-drag-drop"

import StrikethroughInline from "./strikethrough"

import {
  Type,
  Image as ImageIcon,
  Video,
  Volume2,
  Youtube,
  Hand,
} from "lucide-react"
import DividerTool from "./Divider"

const EDITOR_HOLDER_ID = "editorjs"
class LiveMediaTool implements BlockTool {

  private data: any
  private wrapper: HTMLElement
  private descriptionField: HTMLElement | null = null

  constructor({ data }: { data: any }) {
    this.data = data || { url: "", type: "", name: "", description: "" }
    this.wrapper = document.createElement("div")
  }

  render() {
    this.wrapper.style.padding = "15px"
    this.wrapper.style.border = "1px solid #f0f0f0"
    this.wrapper.style.borderRadius = "10px"

    if (this.data.url) {
      this._renderPlayer(this.data.url, this.data.type)
    } else {
      const input = document.createElement("input")
      input.type = "file"
      input.accept = "video/*,audio/*"
      input.style.display = "none"

      input.onchange = (e: any) => {
        const file = e.target.files[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (event) => {
          const url = event.target?.result as string
          const type = file.type.startsWith("video") ? "video" : "audio"
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

  _renderPlayer(url: string, type: "video" | "audio") {
    this.wrapper.innerHTML = ""

    const media = document.createElement(type)
    media.src = url
    media.controls = true
    media.style.width = "100%"

    const desc = document.createElement("div")
    desc.contentEditable = "true"
    desc.dataset.placeholder = "Add a description..."
    desc.innerHTML = this.data.description || ""
    desc.style.cssText =
      "margin-top:10px;padding:8px;border-left:2px solid #0070f3;"

    desc.addEventListener("input", () => {
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

  const holderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!editorInstance.current) {
      initEditor()
    }

    return () => {
      if (editorInstance.current && typeof editorInstance.current.destroy === 'function') {
        const editorToDestroy = editorInstance.current
        editorInstance.current = null // Allow new instance to be created immediately if needed

        // Wait for ready before destroying to avoid "not ready" errors which leave ghost instances
        if (editorToDestroy.isReady) {
          editorToDestroy.isReady
            .then(() => {
              editorToDestroy.destroy()
            })
            .catch((e) => {
              console.error("Error destroying editor instance:", e)
            })
        }
      }
    }
  }, [])

  const initEditor = () => {
    if (!holderRef.current) return

    // Clean up any existing content in the holder to prevent duplicates
    holderRef.current.innerHTML = ""

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
          toolbox: { title: "Main Title", icon: "<b>H1</b>" },
          config: { levels: [1], defaultLevel: 1 },
          shortcut: "CMD+SHIFT+X",
          onReady: () => console.log("h1 tool is ready"),
        },
        h2: {
          class: Header,
          toolbox: { title: "Subtitle", icon: "<b>H2</b>" },
          config: { levels: [2], defaultLevel: 2 },
        },
        h3: {
          class: Header,
          toolbox: { title: "Section", icon: "<b>H3</b>" },
          config: { levels: [3], defaultLevel: 3 },
        },
        strikethrough: {
          class: StrikethroughInline,
          shortcut: "CMD+SHIFT+S",
          onReady: () => console.log("Strikethrough tool is ready"),

        },
        media: {
          class: LiveMediaTool,
          toolbox: false as any, // Hides from toolbox
        },
        list: List,
        checklist: Checklist,
        table: Table,
        quote: Quote,
        code: Code,
        delimiter: {
          class: DividerTool,
          toolbox: { title: "Divider" },
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

  const fileInputRef = useRef<HTMLInputElement>(null)
  const activeMediaType = useRef<string | null>(null)

  const triggerFileSelect = (type: string) => {
    activeMediaType.current = type
    if (fileInputRef.current) {
      if (type === 'image') fileInputRef.current.accept = "image/*"
      else if (type === 'video') fileInputRef.current.accept = "video/*"
      else if (type === 'audio') fileInputRef.current.accept = "audio/*"
      else fileInputRef.current.accept = "*/*"

      fileInputRef.current.click()
    }
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
            file: { url }
          })
        } else {
          editorInstance.current.blocks.insert('media', {
            url,
            type: type, // 'video' or 'audio'
            name: file.name
          })
        }
      }
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }



  return (
    <div style={{ padding: 40, maxWidth: 850, margin: "0 auto" }}>
      <div className="editor-container" style={{ maxWidth: 850, margin: "0 auto", position: 'relative' }}>

        {/* Top "Add Cover" Button */}
        <div style={{
          position: "absolute",
          top: -40,
          left: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 16px',
            background: '#f3f4f6',
            border: 'none',
            borderRadius: '99px',
            color: '#4b5563',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}>
            <div style={{ width: 8, height: 8, background: '#374151', borderRadius: '50%' }} />
            ADD COVER
          </button>
        </div>

        <div
          id={EDITOR_HOLDER_ID}
          ref={holderRef}
          style={{
            minHeight: 450,
            background: "#fff",
            paddingTop: 20
          }}
        />
      </div>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={onFileChange}
      />

      {/* Floating Bottom Toolbar */}
      <div style={{
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
        border: '1px solid #f0f0f0'
      }}>
        <button onClick={() => insertBlock('paragraph')} title="Text" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#444' }}>
          <Type size={20} />
        </button>

        <button onClick={() => triggerFileSelect('image')} title="Image" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#444' }}>
          <ImageIcon size={20} />
        </button>

        <button onClick={() => triggerFileSelect('video')} title="Video" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#444' }}>
          <Video size={20} />
        </button>

        <button onClick={() => triggerFileSelect('audio')} title="Audio" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#444' }}>
          <Volume2 size={20} />
        </button>

        <button onClick={() => insertBlock('embed')} title="Embed/Youtube" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#444' }}>
          <Youtube size={20} />
        </button>

      </div>

    </div>
  )
}
