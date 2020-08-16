import { css } from '@emotion/core';
import theme from './theme';
import { setupFonts } from './fonts';

export const globalStyles = css`
  ${setupFonts}

  h1,
      h2,
      h3,
      h4,
      h5 {
    font-family: ${theme.fonts.primary};
    color: ${theme.colors.text};
  }
  html,
  body,
  #root,
  #root > div {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    font-family: ${theme.fonts.secondary};
  }
  a {
    color: ${theme.colors.primary};
    font-weight: bold;
    text-decoration: none;
  }
`;
