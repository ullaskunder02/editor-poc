"use client"

import { useEffect, useRef, useState } from "react"
// @ts-ignore
import EditorJS, { type OutputData, type BlockTool } from "@editorjs/editorjs"
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

const convertToMarkdown = (data: OutputData): string => {
  let markdown = ""

  data.blocks.forEach((block) => {
    if (block.type.match(/^h[1-6]$/)) {
      const level = Number(block.type.charAt(1))
      markdown += `${"#".repeat(level)} ${block.data.text}\n\n`
      return
    }

    switch (block.type) {
      case "header":
        markdown += `${"#".repeat(block.data.level || 2)} ${
          block.data.text
        }\n\n`
        break
      case "paragraph":
        markdown += `${block.data.text}\n\n`
        break
      case "media":
        const tag = block.data.type === "video" ? "video" : "audio"
        markdown += `<${tag} controls src="${block.data.url}"></${tag}>\n`
        if (block.data.description) {
          markdown += `*${block.data.description.replace(
            /<[^>]*>/g,
            ""
          )}*\n\n`
        }
        break
      case "delimiter":
        markdown += `---\n\n`
        break
      default:
        if (block.data?.text) markdown += `${block.data.text}\n\n`
    }
  })

  return markdown.trim()
}

export default function Page() {
  const editorInstance = useRef<EditorJS | null>(null)
  const [markdown, setMarkdown] = useState("")
  const [showMarkdown, setShowMarkdown] = useState(false)

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
        media: LiveMediaTool,
        list: List,
        checklist: Checklist,
        table: Table,
        quote: Quote,
        code: Code,
        delimiter: Delimiter,
        inlineCode: InlineCode,
        marker: Marker,
        underline: Underline,
      },
    })

    editorInstance.current = editor
  }

  const handleSave = async () => {
    const data = await editorInstance.current?.save()
    if (data) {
      setMarkdown(convertToMarkdown(data))
      setShowMarkdown(true)
    }
  }

  return (
    <div style={{ padding: 40, maxWidth: 850, margin: "0 auto" }}>
      {/* 🔥 REMOVE PLUS MENU */}
      <style>{`
        .ce-toolbar__plus {
          display: none !important;
        }
        .ce-toolbar__actions {
          margin-left: 0 !important;
        }
      `}</style>

      <div
        id={EDITOR_HOLDER_ID}
        style={{
          border: "1px solid #e0e0e0",
          padding: 30,
          borderRadius: 16,
          minHeight: 450,
          background: "#fff",
        }}
      />

      <div style={{ textAlign: "center", marginTop: 30 }}>
        <button
          onClick={handleSave}
          style={{
            padding: "14px 32px",
            background: "#0070f3",
            color: "#fff",
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Preview Content
        </button>
      </div>

      {showMarkdown && (
        <pre
          style={{
            marginTop: 40,
            background: "#111",
            color: "#7ee787",
            padding: 24,
            borderRadius: 12,
            overflowX: "auto",
          }}
        >
          <code>{markdown}</code>
        </pre>
      )}
    </div>
  )
}
