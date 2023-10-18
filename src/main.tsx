import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { App, ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import store from "./store";
import { Provider } from "react-redux";
import Main from "./App";
import "normalize.css";
createRoot(document.getElementById("root") as Element).render(
  <StrictMode>
    <Provider store={store}>
      <ConfigProvider locale={zhCN}>
        <App>
          <Main />
        </App>
      </ConfigProvider>
    </Provider>
  </StrictMode>
  // <App />
);
