import { createGlobalStyle } from 'styled-components';

// Define Global Styles
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background-color: #1c1e26;  // Dark background similar to Investopedia
    font-family: Arial, Helvetica, sans-serif;
    color: #f5f5f5;
  }

  h1, h2, h3, h4, h5, h6 {
    color: #ffffff; // Bright text for headings
  }

  a {
    color: #61dafb; // Blue link color similar to Investopedia
    text-decoration: none;
    &:hover {
      color: #21a1f1; // Lighter blue on hover
    }
  }
`;

export default GlobalStyle;