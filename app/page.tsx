"use client"

import { useEffect, useRef, useState } from "react"

const EDITOR_HOLDER_ID = "editorjs"

// --- MEDIA TOOL (VIDEO/AUDIO) ---
class LiveMediaTool {
  static get toolbox() {
    return { title: "Video/Audio", icon: "🎥" }
  }

  private data: any
  private wrapper: HTMLElement
  private descriptionField: HTMLElement | null = null

  constructor({ data }: { data: any }) {
    this.data = data || { url: "", type: "", name: "", description: "" }
    this.wrapper = document.createElement("div")
  }

  render() {
    this.wrapper.innerHTML = ""
    this.wrapper.style.padding = "15px"
    this.wrapper.style.border = "1px solid #eee"
    this.wrapper.style.borderRadius = "10px"

    if (this.data.url) {
      this.renderPlayer(this.data.url, this.data.type)
    } else {
      const input = document.createElement("input")
      input.type = "file"
      input.accept = "video/*,audio/*"
      input.onchange = (e: any) => {
        const file = e.target.files[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = () => {
          const type = file.type.startsWith("video") ? "video" : "audio"
          this.data = { ...this.data, url: reader.result, type }
          this.renderPlayer(reader.result as string, type)
        }
        reader.readAsDataURL(file)
      }
      input.click()
    }

    return this.wrapper
  }

  renderPlayer(url: string, type: "video" | "audio") {
    this.wrapper.innerHTML = ""
    const media = document.createElement(type)
    media.src = url
    media.controls = true
    media.style.width = "100%"

    const desc = document.createElement("div")
    desc.contentEditable = "true"
    desc.innerText = this.data.description || ""
    desc.style.marginTop = "10px"
    desc.oninput = () => (this.data.description = desc.innerText)

    this.descriptionField = desc
    this.wrapper.append(media, desc)
  }

  save() {
    return this.data
  }
}

// --- MARKDOWN CONVERTER ---
const convertToMarkdown = (data: any) => {
  let md = ""
  data.blocks.forEach((block: any) => {
    switch (block.type) {
      case "header":
        md += `${"#".repeat(block.data.level)} ${block.data.text}\n\n`
        break
      case "paragraph":
        md += `${block.data.text}\n\n`
        break
      case "list":
        block.data.items.forEach((i: string) => (md += `- ${i}\n`))
        md += "\n"
        break
      case "code":
        md += `\`\`\`\n${block.data.code}\n\`\`\`\n\n`
        break
      case "media":
        md += `<${block.data.type} src="${block.data.url}" controls></${block.data.type}>\n\n`
        break
    }
  })
  return md.trim()
}

export default function Page() {
  const editorRef = useRef<any>(null)
  const [markdown, setMarkdown] = useState("")
  const [showMarkdown, setShowMarkdown] = useState(false)

  useEffect(() => {
    let editor: any

    const init = async () => {
      if (typeof window === "undefined") return

      const [
        { default: EditorJS },
        { default: Header },
        { default: List },
        { default: Quote },
        { default: Embed },
        { default: ImageTool },
        { default: Code },
        { default: Delimiter },
        { default: DragDrop },
        { default: Underline },
        { default: InlineCode },
        { default: Strikethrough },
        { default: Superscript },
        { default: Subscript },
        { default: Marker },
      ] = await Promise.all([
        import("@editorjs/editorjs"),
        import("@editorjs/header"),
        import("@editorjs/list"),
        import("@editorjs/quote"),
        import("@editorjs/embed"),
        import("@editorjs/image"),
        import("@editorjs/code"),
        import("@editorjs/delimiter"),
        import("editorjs-drag-drop"),
        import("@editorjs/underline"),
        import("@editorjs/inline-code"),
        import("editorjs-strikethrough"),
        import("editorjs-superscript"),
        import("editorjs-subscript"),
        import("@editorjs/marker"),
      ])

      editor = new EditorJS({
        holder: EDITOR_HOLDER_ID,
        placeholder: "Type '/' for commands...",
        inlineToolbar: true,
        onReady: () => new DragDrop(editor),
        tools: {
          header: Header,
          list: List,
          quote: Quote,
          embed: Embed,
          image: ImageTool,
          code: Code,
          delimiter: Delimiter,
          underline: Underline,
          inlineCode: InlineCode,
          strikethrough: Strikethrough,
          superscript: Superscript,
          subscript: Subscript,
          marker: Marker,
          media: LiveMediaTool,
        },
      })

      editorRef.current = editor
    }

    init()

    return () => {
      editor?.destroy()
      editorRef.current = null
    }
  }, [])

  const handleSave = async () => {
    const data = await editorRef.current?.save()
    if (data) {
      setMarkdown(convertToMarkdown(data))
      setShowMarkdown(true)
    }
  }

  return (
    <div style={{ padding: 40, maxWidth: 900, margin: "auto" }}>
      <div
        id={EDITOR_HOLDER_ID}
        style={{
          border: "1px solid #ddd",
          padding: 30,
          borderRadius: 16,
          minHeight: 500,
        }}
      />

      <button
        onClick={handleSave}
        style={{
          marginTop: 30,
          padding: "14px 28px",
          background: "#0070f3",
          color: "#fff",
          border: "none",
          borderRadius: 10,
          cursor: "pointer",
        }}
      >
        Generate CMS Output
      </button>

      {showMarkdown && (
        <pre
          style={{
            marginTop: 40,
            background: "#111",
            color: "#80cbc4",
            padding: 20,
            borderRadius: 12,
            overflowX: "auto",
          }}
        >
          {markdown}
        </pre>
      )}
    </div>
  )
}
