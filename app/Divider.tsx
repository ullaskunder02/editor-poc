export default class DividerTool {
  static get toolbox() {
    return {
      title: 'Divider',
      icon: '―',
    }
  }

  render() {
    const hr = document.createElement('hr')
    hr.style.border = 'none'
    hr.style.borderTop = '1px solid #e5e7eb'
    hr.style.margin = '24px 0'
    return hr
  }

  save() {
    return {}
  }
}
