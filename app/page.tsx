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

const EDITOR_HOLDER_ID = "editorjs"

// --- MEDIA TOOL (STAYS THE SAME) ---
class LiveMediaTool implements BlockTool {
  static get toolbox() { return { title: 'Video/Audio', icon: '🎥' }; }
  private data: any;
  private wrapper: HTMLElement;
  private descriptionField: HTMLElement | null = null;
  constructor({ data }: { data: any }) {
    this.data = data || { url: '', type: '', name: '', description: '' };
    this.wrapper = document.createElement('div');
  }
  render() {
    this.wrapper.style.padding = "15px";
    this.wrapper.style.border = "1px solid #f0f0f0";
    this.wrapper.style.borderRadius = "10px";
    if (this.data && this.data.url) { this._renderPlayer(this.data.url, this.data.type); } 
    else {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'video/*,audio/*';
      input.style.display = 'none';
      input.onchange = (e: any) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          const url = event.target?.result as string;
          const type = file.type.startsWith('video') ? 'video' : 'audio';
          this.data = { ...this.data, url, type, name: file.name };
          this._renderPlayer(url, type);
        };
        reader.readAsDataURL(file);
      };
      this.wrapper.appendChild(input);
      setTimeout(() => input.click(), 0);
    }
    return this.wrapper;
  }
  _renderPlayer(url: string, type: 'video' | 'audio') {
    this.wrapper.innerHTML = '';
    const mediaTag = document.createElement(type);
    mediaTag.src = url; mediaTag.controls = true; mediaTag.style.width = "100%";
    const desc = document.createElement('div');
    desc.contentEditable = "true";
    desc.dataset.placeholder = "Add a description...";
    desc.innerHTML = this.data.description || '';
    desc.style.cssText = "margin-top:10px; padding:8px; border-left:2px solid #0070f3;";
    desc.addEventListener('input', () => { this.data.description = desc.innerHTML; });
    this.descriptionField = desc;
    this.wrapper.appendChild(mediaTag);
    this.wrapper.appendChild(desc);
  }
  save() { return { ...this.data, description: this.descriptionField ? this.descriptionField.innerHTML : this.data.description }; }
}

// --- CONVERTER (UPDATED TO HANDLE MULTIPLE HEADER TYPES) ---
const convertToMarkdown = (data: OutputData): string => {
  let markdown = ""
  data.blocks.forEach((block) => {
    // Check if the type is h1, h2, etc., or the default 'header'
    if (block.type.match(/^h[1-6]$/)) {
        const level = block.type.charAt(1);
        markdown += `${"#".repeat(parseInt(level))} ${block.data.text}\n\n`
    } else {
        switch (block.type) {
          case "header":
            markdown += `${"#".repeat(block.data.level || 2)} ${block.data.text}\n\n`
            break
          case "paragraph":
            markdown += `${block.data.text}\n\n`
            break
          case "media":
            const tag = block.data.type === 'video' ? 'video' : 'audio';
            markdown += `<${tag} controls src="${block.data.url}" style="width:100%"></${tag}>\n`
            if (block.data.description) markdown += `\n*${block.data.description.replace(/<[^>]*>/g, '')}*\n\n`
            else markdown += `\n`
            break
          case "delimiter":
            markdown += `---\n\n`
            break
          default:
            if (block.data.text) markdown += `${block.data.text}\n\n`
            break
        }
    }
  })
  return markdown.trim()
}

export default function Page() {
  const editorInstance = useRef<EditorJS | null>(null)
  const [markdown, setMarkdown] = useState<string>("")
  const [showMarkdown, setShowMarkdown] = useState<boolean>(false)

  useEffect(() => {
    if (!editorInstance.current) initEditor()
    return () => { editorInstance.current?.destroy(); editorInstance.current = null; }
  }, [])

  const initEditor = () => {
    const editor = new EditorJS({
      holder: EDITOR_HOLDER_ID,
      placeholder: "Press '/' for commands...",
      onReady: () => { /* @ts-ignore */ new DragDrop(editor) },
        tools: {
        // We override the 'toolbox' property for each level so they show H1, H2, etc.
        h1: { 
          class: Header, 
          toolbox: { title: 'Main Title', icon: '<b style="font-size: 1.2em">H1</b>' },
          config: { placeholder: 'Heading 1', levels: [1], defaultLevel: 1 } 
        },
        h2: { 
          class: Header, 
          toolbox: { title: 'Subtitle', icon: '<b>H2</b>' },
          config: { placeholder: 'Heading 2', levels: [2], defaultLevel: 2 } 
        },
        h3: { 
          class: Header, 
          toolbox: { title: 'Section', icon: '<b style="font-size: 0.9em">H3</b>' },
          config: { placeholder: 'Heading 3', levels: [3], defaultLevel: 3 } 
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
      }
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
    <div style={{ padding: "40px", maxWidth: "850px", margin: "0 auto", fontFamily: "system-ui" }}>
      <div id={EDITOR_HOLDER_ID} style={{ border: "1px solid #e0e0e0", padding: "30px", borderRadius: "16px", minHeight: "450px", backgroundColor: "#fff" }} />
      <div style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
        <button onClick={handleSave} style={{ padding: "14px 32px", background: "#0070f3", color: "white", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: "600" }}>
          Preview Content
        </button>
      </div>
      {showMarkdown && (
        <div style={{ marginTop: "50px" }}>
          <div style={{ border: "1px solid #ddd", padding: "40px", borderRadius: "16px", background: "#fff" }} dangerouslySetInnerHTML={{ __html: markdown.replace(/\n/g, '<br/>') }} />
          <pre style={{ background: "#1a1a1a", color: "#80cbc4", padding: "25px", borderRadius: "12px", marginTop: "20px", overflowX: "auto" }}>
            <code>{markdown}</code>
          </pre>
        </div>
      )}
    </div>
  )
}