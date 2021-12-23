import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GamesProvider } from './contexts/GamesProvider';
import { CategorieProvider } from "./contexts/CategorieProvider";
import { PublisherProvider } from "./contexts/PublisherProvider";
import { PlatformProvider } from './contexts/PlatformProvider';
import { TaalProvider } from './contexts/TaalProvider';
import { CartProvider } from './contexts/CartProvider';
import { AuthProvider } from "./contexts/AuthProvider";
import { UsersProvider } from './contexts/UsersProvider';
import { BestellingenProvider } from './contexts/BestellingenProvider';

import {BrowserRouter} from "react-router-dom"
import {
  ThemeProvider,
  createTheme,
  StyledEngineProvider
} from "@mui/material/styles";

const theme = createTheme();


ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
        <AuthProvider>
          <UsersProvider>
            <CategorieProvider>
              <PublisherProvider>
                <PlatformProvider>
                  <TaalProvider>
                    <GamesProvider>
                      <BestellingenProvider>
                        <CartProvider>
                          <ThemeProvider theme={theme}>
                            <StyledEngineProvider injectFirst>
                                <App />
                            </StyledEngineProvider>
                          </ThemeProvider>
                        </CartProvider>
                      </BestellingenProvider>
                    </GamesProvider>
                  </TaalProvider>
                </PlatformProvider>
              </PublisherProvider>
            </CategorieProvider>
          </UsersProvider>
        </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
