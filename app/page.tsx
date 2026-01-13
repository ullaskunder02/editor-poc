"use client"

import { useEffect, useRef, useState } from "react"
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
import Delimiter from "@editorjs/delimiter"
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

const EDITOR_HOLDER_ID = "editorjs"
class LiveMediaTool implements BlockTool {
  static get toolbox() {
    return { title: "Video / Audio", icon: "🎥" }
  }

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

export default function Page() {
  const editorInstance = useRef<EditorJS | null>(null)


  useEffect(() => {
    if (!editorInstance.current) initEditor()

    return () => {
      editorInstance.current?.destroy()
      editorInstance.current = null
    }
  }, [])




  const initEditor = () => {
    const editor = new EditorJS({
      holder: EDITOR_HOLDER_ID,
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
          class: Delimiter,
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
          style={{
            minHeight: 450,
            background: "#fff",
            paddingTop: 20
          }}
        />
      </div>

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

        <button onClick={() => insertBlock('image')} title="Image" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#444' }}>
          <ImageIcon size={20} />
        </button>

        <button onClick={() => insertBlock('media', { type: 'video' })} title="Video" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#444' }}>
          <Video size={20} />
        </button>

        <button onClick={() => insertBlock('media', { type: 'audio' })} title="Audio" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#444' }}>
          <Volume2 size={20} />
        </button>

        <button onClick={() => insertBlock('embed')} title="Embed/Youtube" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#444' }}>
          <Youtube size={20} />
        </button>

      </div>

    </div>
  )
}
