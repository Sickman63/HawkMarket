import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background-color: #121212; /* Consistent with other components */
    font-family: 'Roboto', Arial, Helvetica, sans-serif; /* Modern font */
    color: #e0e0e0; /* Off-white for better readability */
  }

  h1, h2, h3, h4, h5, h6 {
    color: #f0f0f0;
    font-weight: 600;
  }

  a {
    color: #61dafb;
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: #3d7ba8; /* Matches the improved navbar link color */
    }
  }

  button {
    font-family: inherit;
  }

  @media (max-width: 768px) {
    body {
      font-size: 14px;
    }
  }

  @media (max-width: 480px) {
    body {
      font-size: 12px;
    }
  }
`;

export default GlobalStyle;
