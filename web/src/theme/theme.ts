import { ThemeConfig } from 'antd';

const theme: ThemeConfig = {
  components: {
    Modal: {
      titleFontSize: 20,
      zIndexBase: 400,
      zIndexPopupBase: 400,
    },
    Layout: {
      bodyBg: '#fff'
    },
    Popover: {
      zIndexPopup: 5,
    },
    Menu: {
      controlHeightLG: 64,
      fontSize: 16,
      fontWeightStrong: 600
    },
    Button: {
      defaultHoverBorderColor: 'none',
      contentFontSize: 16,
      fontWeight: 400,
      paddingInlineLG: 16
    },
    Typography: {
      titleMarginBottom: 0,
    },
    Table: {
      cellFontSize: 16,
      padding: 20,
      lineHeight: 1.438,
      cellPaddingBlockMD: 13,
      cellPaddingInlineMD: 16,
      cellPaddingBlock: 20,
      cellPaddingInline: 16,
      headerBorderRadius: 0
    },
    Tag: {
      marginXS: 0
    },
    Badge: {
      indicatorHeight: 26,
      textFontSize: 14
    },
    Message: {
      zIndexPopup: 999999
    }
  },
}

export default theme;