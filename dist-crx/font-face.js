/* eslint-disable */
const styleNode = document.createElement('style')
styleNode.type = 'text/css'
styleNode.textContent = `
@font-face {
  font-family:Roboto;src:url("${chrome.extension.getURL('dist/fonts/Roboto-Thin.woff2')}") format("woff2"),url("${chrome.extension.getURL('dist/fonts/Roboto-Thin.woff')}") format("woff");font-weight:100;font-style:normal
}

@font-face {
  font-family:Roboto-Thin;src:url("${chrome.extension.getURL('dist/fonts/Roboto-Thin.woff2')}") format("woff2"),url("${chrome.extension.getURL('dist/fonts/Roboto-Thin.woff')}") format("woff")
}

@font-face {
  font-family:Roboto;src:url("${chrome.extension.getURL('dist/fonts/Roboto-ThinItalic.woff2')}") format("woff2"),url("${chrome.extension.getURL('dist/fonts/Roboto-ThinItalic.woff')}") format("woff");font-weight:100;font-style:italic
}

@font-face {
  font-family:Roboto-ThinItalic;src:url("${chrome.extension.getURL('dist/fonts/Roboto-ThinItalic.woff2')}") format("woff2"),url("${chrome.extension.getURL('dist/fonts/Roboto-ThinItalic.woff')}") format("woff")
}

@font-face {
  font-family:Roboto;src:url("${chrome.extension.getURL('dist/fonts/Roboto-Light.woff2')}") format("woff2"),url("${chrome.extension.getURL('dist/fonts/Roboto-Light.woff')}") format("woff");font-weight:300;font-style:normal
}

@font-face {
  font-family:Roboto-Light;src:url("${chrome.extension.getURL('dist/fonts/Roboto-Light.woff2')}") format("woff2"),url("${chrome.extension.getURL('dist/fonts/Roboto-Light.woff')}") format("woff")
}

@font-face {
  font-family:Roboto;src:url("${chrome.extension.getURL('dist/fonts/Roboto-LightItalic.woff2')}") format("woff2"),url("${chrome.extension.getURL('dist/fonts/Roboto-LightItalic.woff')}") format("woff");font-weight:300;font-style:italic
}

@font-face {
  font-family:Roboto-LightItalic;src:url("${chrome.extension.getURL('dist/fonts/Roboto-LightItalic.woff2')}") format("woff2"),url("${chrome.extension.getURL('dist/fonts/Roboto-LightItalic.woff')}") format("woff")
}

@font-face {
  font-family:Roboto;src:url("${chrome.extension.getURL('dist/fonts/Roboto-Regular.woff2')}") format("woff2"),url("${chrome.extension.getURL('dist/fonts/Roboto-Regular.woff')}") format("woff");font-weight:400;font-style:normal
}

@font-face {
  font-family:Roboto-Regular;src:url("${chrome.extension.getURL('dist/fonts/Roboto-Regular.woff2')}") format("woff2"),url("${chrome.extension.getURL('dist/fonts/Roboto-Regular.woff')}") format("woff")
}

@font-face {
  font-family:Roboto;src:url("${chrome.extension.getURL('dist/fonts/Roboto-RegularItalic.woff2')}") format("woff2"),url("${chrome.extension.getURL('dist/fonts/Roboto-RegularItalic.woff')}") format("woff");font-weight:400;font-style:italic
}

@font-face {
  font-family:Roboto-RegularItalic;src:url("${chrome.extension.getURL('dist/fonts/Roboto-RegularItalic.woff2')}") format("woff2"),url("${chrome.extension.getURL('dist/fonts/Roboto-RegularItalic.woff')}") format("woff")
}

@font-face {
  font-family:Roboto;src:url("${chrome.extension.getURL('dist/fonts/Roboto-Medium.woff2')}") format("woff2"),url("${chrome.extension.getURL('dist/fonts/Roboto-Medium.woff')}") format("woff");font-weight:500;font-style:normal
}

@font-face {
  font-family:Roboto-Medium;src:url("${chrome.extension.getURL('dist/fonts/Roboto-Medium.woff2')}") format("woff2"),url("${chrome.extension.getURL('dist/fonts/Roboto-Medium.woff')}") format("woff")
}

@font-face {
  font-family:Roboto;src:url("${chrome.extension.getURL('dist/fonts/Roboto-MediumItalic.woff2')}") format("woff2"),url("${chrome.extension.getURL('dist/fonts/Roboto-MediumItalic.woff')}") format("woff");font-weight:500;font-style:italic
}

@font-face {
  font-family:Roboto-MediumItalic;src:url("${chrome.extension.getURL('dist/fonts/Roboto-MediumItalic.woff2')}") format("woff2"),url("${chrome.extension.getURL('dist/fonts/Roboto-MediumItalic.woff')}") format("woff")
}

@font-face {
  font-family:Roboto;src:url("${chrome.extension.getURL('dist/fonts/Roboto-Bold.woff2')}") format("woff2"),url("${chrome.extension.getURL('dist/fonts/Roboto-Bold.woff')}") format("woff");font-weight:700;font-style:normal
}

@font-face {
  font-family:Roboto-Bold;src:url("${chrome.extension.getURL('dist/fonts/Roboto-Bold.woff2')}") format("woff2"),url("${chrome.extension.getURL('dist/fonts/Roboto-Bold.woff')}") format("woff")
}

@font-face {
  font-family:Roboto;src:url("${chrome.extension.getURL('dist/fonts/Roboto-BoldItalic.woff2')}") format("woff2"),url("${chrome.extension.getURL('dist/fonts/Roboto-BoldItalic.woff')}") format("woff");font-weight:700;font-style:italic
}

@font-face {
  font-family:Roboto-BoldItalic;src:url("${chrome.extension.getURL('dist/fonts/Roboto-BoldItalic.woff2')}") format("woff2"),url("${chrome.extension.getURL('dist/fonts/Roboto-BoldItalic.woff')}") format("woff")
}

@font-face {
  font-family:Roboto;src:url("${chrome.extension.getURL('dist/fonts/Roboto-Black.woff2')}") format("woff2"),url("${chrome.extension.getURL('dist/fonts/Roboto-Black.woff')}") format("woff");font-weight:900;font-style:normal
}

@font-face {
  font-family:Roboto-Black;src:url("${chrome.extension.getURL('dist/fonts/Roboto-Black.woff2')}") format("woff2"),url("${chrome.extension.getURL('dist/fonts/Roboto-Black.woff')}") format("woff")
}

@font-face {
  font-family:Roboto;src:url("${chrome.extension.getURL('dist/fonts/Roboto-BlackItalic.woff2')}") format("woff2"),url("${chrome.extension.getURL('dist/fonts/Roboto-BlackItalic.woff')}") format("woff");font-weight:900;font-style:italic
}

@font-face {
  font-family:Roboto-BlackItalic;src:url("${chrome.extension.getURL('dist/fonts/Roboto-BlackItalic.woff2')}") format("woff2"),url("${chrome.extension.getURL('dist/fonts/Roboto-BlackItalic.woff')}") format("woff")
}

@font-face {
  font-family:Material Design Icons;src:url("${chrome.extension.getURL('dist/fonts/materialdesignicons-webfont.eot')}");src:url("${chrome.extension.getURL('dist/fonts/materialdesignicons-webfont.eot?#iefix&v=3.9.97')}") format("embedded-opentype"),url("${chrome.extension.getURL('dist/fonts/materialdesignicons-webfont.woff2')}") format("woff2"),url("${chrome.extension.getURL('dist/fonts/materialdesignicons-webfont.woff')}") format("woff"),url("${chrome.extension.getURL('dist/fonts/materialdesignicons-webfont.ttf')}") format("truetype");font-weight:400;font-style:normal
}
`
document.head.appendChild(styleNode)
