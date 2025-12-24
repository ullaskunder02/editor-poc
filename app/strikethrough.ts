export default class StrikethroughInline {
  static get isInline() {
    return true;
  }

  static get title() {
    return "Strikethrough";
  }

  static get sanitize() {
    return {
      s: {},
    };
  }

  private tag = "S";

  surround(range: Range) {
    if (!range) return;

    const selectedText = range.extractContents();
    const mark = document.createElement(this.tag);
    mark.appendChild(selectedText);
    range.insertNode(mark);
  }

  checkState(selection: Selection) {
    if (!selection.anchorNode) return false;
    return this.findParentTag(selection.anchorNode, this.tag);
  }

  private findParentTag(node: Node, tagName: string): HTMLElement | null {
    while (node && node.nodeType !== Node.DOCUMENT_NODE) {
      if (
        node.nodeType === Node.ELEMENT_NODE &&
        (node as HTMLElement).tagName === tagName
      ) {
        return node as HTMLElement;
      }
      node = node.parentNode as Node;
    }
    return null;
  }
}
