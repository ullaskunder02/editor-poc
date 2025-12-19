"use client"

import { useEffect, useRef, useState } from "react"
import EditorJS, { type OutputData } from "@editorjs/editorjs"
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
import LinkTool from "@editorjs/link"
// @ts-ignore
import AttachesTool from "@editorjs/attaches"
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

const EDITOR_HOLDER_ID = "editorjs"

if (typeof window !== "undefined" && navigator.keyboard) {
  const originalGetLayoutMap = navigator.keyboard.getLayoutMap
  if (originalGetLayoutMap) {
    navigator.keyboard.getLayoutMap = () => Promise.resolve(new Map())
  }
}

const convertToMarkdown = (data: OutputData): string => {
  let markdown = ""

  data.blocks.forEach((block) => {
    switch (block.type) {
      case "header":
        const level = block.data.level || 2
        markdown += `${"#".repeat(level)} ${block.data.text}\n\n`
        break

      case "paragraph":
        markdown += `${block.data.text}\n\n`
        break

      case "list":
        if (block.data.style === "ordered") {
          block.data.items.forEach((item: string, i: number) => {
            markdown += `${i + 1}. ${item}\n`
          })
        } else {
          block.data.items.forEach((item: string) => {
            markdown += `- ${item}\n`
          })
        }
        markdown += "\n"
        break

      case "checklist":
        block.data.items.forEach((item: any) => {
          const checked = item.checked ? "x" : " "
          markdown += `- [${checked}] ${item.text}\n`
        })
        markdown += "\n"
        break

      case "table":
        if (block.data.content && block.data.content.length > 0) {
          const headerRow = block.data.content[0]
          markdown += `| ${headerRow.join(" | ")} |\n`
          markdown += `| ${headerRow.map(() => "---").join(" | ")} |\n`

          for (let i = 1; i < block.data.content.length; i++) {
            markdown += `| ${block.data.content[i].join(" | ")} |\n`
          }
          markdown += "\n"
        }
        break

      case "code":
        markdown += `\`\`\`\n${block.data.code}\n\`\`\`\n\n`
        break

      case "quote":
        markdown += `> ${block.data.text}\n\n`
        break

      case "delimiter":
        markdown += `---\n\n`
        break

      case "image":
        if (block.data.file && block.data.file.url) {
          const caption = block.data.caption ? ` "${block.data.caption}"` : ""
          markdown += `![${block.data.caption || "Image"}](${block.data.file.url}${caption})\n\n`
        }
        break

      case "embed":
        if (block.data.embed) {
          markdown += `[${block.data.caption || "Video"}](${block.data.embed})\n\n`
        } else if (block.data.source) {
          markdown += `[${block.data.caption || "Embed"}](${block.data.source})\n\n`
        }
        break

      case "attaches":
        if (block.data.file) {
          markdown += `[${block.data.title || "Attachment"}](${block.data.file.url})\n\n`
        }
        break

      default:
        if (block.data.text) {
          markdown += `${block.data.text}\n\n`
        }
        break
    }
  })

  return markdown.trim()
}

export default function Page() {
  const editorInstance = useRef<EditorJS | null>(null)
  const [markdown, setMarkdown] = useState<string>("")
  const [showMarkdown, setShowMarkdown] = useState<boolean>(false)

  useEffect(() => {
    if (!editorInstance.current) {
      initEditor()
    }

    return () => {
      editorInstance.current?.destroy()
      editorInstance.current = null
    }
  }, [])

  const initEditor = () => {
    const editor = new EditorJS({
      holder: EDITOR_HOLDER_ID,
      placeholder: "Let`s write something awesome!",
      onReady: () => {
        new DragDrop(editor)
      },
      tools: {
        header: {
          class: Header,
          inlineToolbar: ["link", "bold", "italic"],
          config: {
            placeholder: "Enter a header",
            levels: [1, 2, 3, 4, 5, 6],
            defaultLevel: 2,
          },
        },
        image: {
          class: ImageTool,
          config: {
            uploader: {
              uploadByFile(file: File) {
                return new Promise((resolve) => {
                  const reader = new FileReader()
                  reader.onload = (e) => {
                    resolve({
                      success: 1,
                      file: {
                        url: e.target?.result,
                      },
                    })
                  }
                  reader.readAsDataURL(file)
                })
              },
              uploadByUrl(url: string) {
                return Promise.resolve({
                  success: 1,
                  file: {
                    url: url,
                  },
                })
              },
            },
          },
        },
        embed: {
          class: Embed,
          config: {
            services: {
              youtube: true,
              vimeo: true,
              coub: true,
              codepen: true,
              twitter: true,
              instagram: true,
              facebook: true,
            },
          },
        },
        list: {
          class: List,
          inlineToolbar: true,
          config: {
            defaultStyle: "unordered",
          },
        },
        checklist: {
          class: Checklist,
          inlineToolbar: true,
        },
        quote: {
          class: Quote,
          inlineToolbar: true,
          config: {
            quotePlaceholder: "Enter a quote",
            captionPlaceholder: "Quote's author",
          },
        },
        delimiter: Delimiter,
        table: {
          class: Table,
          inlineToolbar: true,
          config: {
            rows: 2,
            cols: 3,
          },
        },
        code: {
          class: Code,
          config: {
            placeholder: "Enter code",
          },
        },
        linkTool: {
          class: LinkTool,
          config: {
            endpoint: "http://localhost:8008/fetchUrl",
          },
        },
        attaches: {
          class: AttachesTool,
          config: {
            uploader: {
              uploadByFile(file: File) {
                return new Promise((resolve) => {
                  const reader = new FileReader()
                  reader.onload = (e) => {
                    resolve({
                      success: 1,
                      file: {
                        url: e.target?.result,
                        size: file.size,
                        name: file.name,
                        extension: file.name.split(".").pop(),
                      },
                    })
                  }
                  reader.readAsDataURL(file)
                })
              },
            },
          },
        },
        marker: {
          class: Marker,
        },
        underline: Underline,
        inlineCode: {
          class: InlineCode,
        },
      },
      data: {
        blocks: [
          {
            type: "header",
            data: {
              text: "Hey. Meet the new Editor",
              level: 2,
            },
          },
          {
            type: "paragraph",
            data: {
              text: "On this page you can see it in action — try to edit this text.",
            },
          },
          {
            type: "header",
            data: {
              text: "Key features",
              level: 3,
            },
          },
          {
            type: "list",
            data: {
              style: "unordered",
              items: [
                "It is a block-style editor",
                "It returns clean data output in JSON",
                "Designed to be extendable and pluggable with a simple API",
              ],
            },
          },
        ],
      },
    })

    editorInstance.current = editor
  }

  const handleSaveMarkdown = async () => {
    if (editorInstance.current) {
      try {
        const outputData: OutputData = await editorInstance.current.save()
        const md = convertToMarkdown(outputData)
        setMarkdown(md)
        setShowMarkdown(true)
      } catch (error) {
        console.error("Saving failed: ", error)
      }
    }
  }

  const handleDownloadMarkdown = () => {
    const blob = new Blob([markdown], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "document.md"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="editor-container">
      <div className="editor-wrapper">
        <div className="editor-card">
          <div id={EDITOR_HOLDER_ID} className="editor-holder" />

          <div className="button-group">
            <button className="btn btn-primary" onClick={handleSaveMarkdown}>
              Generate Markdown
            </button>
            {markdown && (
              <button className="btn btn-secondary" onClick={handleDownloadMarkdown}>
                <svg
                  className="download-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download MD
              </button>
            )}
          </div>
        </div>

        {showMarkdown && (
          <div className="markdown-output">
            <h2 className="output-title">Markdown Output:</h2>
            <div className="success-alert">
              <svg
                className="alert-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Markdown generated successfully!
            </div>
            <pre className="markdown-preview">
              <code>{markdown}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
