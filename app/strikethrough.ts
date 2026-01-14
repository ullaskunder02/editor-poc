export default class StrikethroughInline {
  static get isInline() {
    return true
  }

  static get title() {
    return 'Strikethrough'
  }

  static get sanitize() {
    return {
      s: {},
    }
  }

  private tag = 'S'

  render() {
    const button = document.createElement('button')
    button.type = 'button'
    button.innerHTML =
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4H9a3 3 0 0 0-2.83 4"/><path d="M14 12a4 4 0 0 1 0 8H6"/><line x1="4" y1="12" x2="20" y2="12"/></svg>'
    button.classList.add('ce-inline-tool')
    return button
  }

  surround(range: Range) {
    if (!range) return

    const selectedText = range.extractContents()
    const mark = document.createElement(this.tag)
    mark.appendChild(selectedText)
    range.insertNode(mark)
  }

  checkState(selection: Selection) {
    if (!selection.anchorNode) return false
    return this.findParentTag(selection.anchorNode, this.tag)
  }

  private findParentTag(node: Node, tagName: string): HTMLElement | null {
    while (node && node.nodeType !== Node.DOCUMENT_NODE) {
      if (
        node.nodeType === Node.ELEMENT_NODE &&
        (node as HTMLElement).tagName === tagName
      ) {
        return node as HTMLElement
      }
      node = node.parentNode as Node
    }
    return null
  }
}
