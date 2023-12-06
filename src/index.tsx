import { AppRoutes } from "./Routes"
import { store } from "./core/redux/store"
import { Provider } from "react-redux"
import { createRoot } from "react-dom/client"
import reportWebVitals from "./reportWebVitals"
import { SnackbarProvider } from "notistack"
import { ToastConfigurator } from "./utils"
import { ThemeProvider } from "react-bootstrap"

import { PhotoProvider } from "react-photo-view"
import "react-photo-view/dist/react-photo-view.css"
import "./i18n"

import "./index.scss"

const container = document.getElementById("root")!
const root = createRoot(container)

root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <ThemeProvider>
      <SnackbarProvider maxSnack={2} anchorOrigin={{ horizontal: "center", vertical: "bottom" }}>
        <ToastConfigurator />
        <PhotoProvider bannerVisible={false} maskOpacity={0.7}>
          <AppRoutes />
        </PhotoProvider>
      </SnackbarProvider>
    </ThemeProvider>
  </Provider>
  // </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
