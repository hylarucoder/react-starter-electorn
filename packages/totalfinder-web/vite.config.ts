import path from "path"
import { defineConfig } from "vite"
import reactRefresh from "@vitejs/plugin-react-refresh"

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [reactRefresh()],
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(__dirname, "src") },
      { find: "~antd", replacement: path.resolve(__dirname, "../../node_modules/antd") },
      {
        find: "~antd/lib/style/themes/default",
        replacement: path.resolve(__dirname, "../../node_modules/antd/lib/style/themes/default.less"),
      },
    ],
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          hack: `true;@import "${require.resolve("antd/lib/style/color/colorPalette.less")}";`,
          "@primary-color": "#41adff",
        },
      },
    },
  },

  optimizeDeps: {
    // entries: [
    //   '@ant-design/colors',
    //   '@ant-design/icons-svg',
    //   '@ant-design/icons',
    //   '@ant-design/pro-card',
    //   '@ant-design/pro-descriptions',
    //   '@ant-design/pro-field',
    //   '@ant-design/pro-form',
    //   '@ant-design/pro-layout',
    //   '@ant-design/pro-list',
    //   '@ant-design/pro-provider',
    //   '@ant-design/pro-skeleton',
    //   '@ant-design/pro-table',
    //   '@ant-design/pro-utils',
    //   '@ant-design/react-slick',
    //   'react',
    // ],
  },
})
