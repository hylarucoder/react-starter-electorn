import React, { useEffect, useState } from "react"
import { HashRouter, Link } from "react-router-dom"
import { Button, Layout, Menu, Modal } from "antd"
import { Router } from "./Router"
import "./App.css"
import { LoginForm } from "./components/Login"
import { fetchProfile } from "./api/http"
import { ProvideStore, useGlobalStore } from "./hooks/useStore"
import { observer } from "mobx-react"

const { Header, Content } = Layout

const PriceTable = () => {
  return (
    <div className="container flex flex-wrap pt-4 pb-10 m-auto mt-6 md:mt-15 lg:px-12 xl:px-16">
      <div className="w-full px-0 lg:px-4">
        <p className="py-1 text-sm text-center text-blue-700 mb-10">友情提示</p>
        <div className="flex flex-wrap items-center justify-center py-4 pt-0">
          <div className="w-full p-4 md:w-1/2 lg:w-1/4 plan-card">
            <label className="flex flex-col rounded-lg shadow-lg group relative cursor-pointer hover:shadow-2xl">
              <div className="w-full px-4 py-6 rounded-t-lg card-section-1">
                <h3 className="mx-auto text-base font-semibold text-center underline text-blue-500 group-hover:text-white">
                  Standard
                </h3>
                <p className="text-5xl font-bold text-center group-hover:text-white text-blue-500">
                  $25.<span className="text-3xl">95</span>
                </p>
                <p className="text-xs text-center uppercase group-hover:text-white text-blue-500">monthly</p>
              </div>
              <div className="flex flex-col items-center justify-center w-full h-full py-6 rounded-b-lg bg-blue-500">
                <p className="text-xl text-white">1 month</p>
                <button className="w-5/6 py-2 mt-2 font-semibold text-center uppercase bg-white border border-transparent rounded text-blue-500">
                  Get Started
                </button>
              </div>
            </label>
          </div>

          <div className="w-full p-4 md:w-1/2 lg:w-1/4">
            <label className="flex flex-col rounded-lg shadow-lg relative cursor-pointer hover:shadow-2xl">
              <div className="w-full px-4 py-8 rounded-t-lg bg-blue-500">
                <h3 className="mx-auto text-base font-semibold text-center underline text-white group-hover:text-white">
                  Premium
                </h3>
                <p className="text-5xl font-bold text-center text-white">
                  $21.<span className="text-3xl">95</span>
                </p>
                <p className="text-xs text-center uppercase text-white">monthly</p>
              </div>
              <div className="flex flex-col items-center justify-center w-full h-full py-6 rounded-b-lg bg-blue-700">
                <p className="text-xl text-white">3 months</p>
                <button className="w-5/6 py-2 mt-2 font-semibold text-center uppercase bg-white border border-transparent rounded text-blue-500">
                  Save 15%
                </button>
              </div>
            </label>
          </div>

          <div className="w-full p-4 md:w-1/2 lg:w-1/4 plan-card">
            <label className="flex flex-col rounded-lg shadow-lg group card-group relative hover:bg-jblue-secondary cursor-pointer hover:shadow-2xl">
              <div className="w-full px-4 py-6 rounded-t-lg card-section-1">
                <h3 className="mx-auto text-base font-semibold text-center underline text-blue-500 group-hover:text-white">
                  Elite
                </h3>
                <p className="text-5xl font-bold text-center group-hover:text-white text-blue-500">
                  $19.<span className="text-3xl">45</span>
                </p>
                <p className="text-xs text-center uppercase group-hover:text-white text-blue-500">monthly</p>
              </div>
              <div className="flex flex-col items-center justify-center w-full h-full py-6 rounded-b-lg bg-blue-500">
                <p className="text-xl text-white">6 months</p>
                <button className="w-5/6 py-2 mt-2 font-semibold text-center uppercase bg-white border border-transparent rounded text-blue-500">
                  Save 25%
                </button>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

const LoginContainer = observer(() => {
  const [subVisible, setSubVisible] = useState(false)
  const store = useGlobalStore()

  return (
    <>
      {store.loginSuccess ? (
        <Button
          onClick={() => {
            store.logout()
            store.hideLoginForm()
          }}
        >
          {`#${store.profile?.id} - ${store.profile?.mobile}`}
        </Button>
      ) : (
        <Button
          type="primary"
          onClick={() => {
            store.showLoginForm()
          }}
        >
          登陆
        </Button>
      )}
      <Modal visible={store.loginFormVisible} footer={null} closable={false} width={900}>
        <LoginForm />
      </Modal>
      <Button
        type="primary"
        onClick={() => {
          setSubVisible(true)
        }}
      >
        成为会员
      </Button>
      <Modal
        visible={subVisible}
        footer={null}
        closable={false}
        width={900}
        bodyStyle={{
          padding: 0,
        }}
      >
        <PriceTable />
      </Modal>
    </>
  )
})

function HeaderNav() {
  return (
    <Header className="header">
      <div className="logo"></div>
      <div className="flex">
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1">
            <Link to="/pdf" />
            PDF转其他文件
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/another" />
            其他文件转PDF
          </Menu.Item>
          <Menu.Item key="3">更多操作</Menu.Item>
        </Menu>
        <LoginContainer />
      </div>
    </Header>
  )
}

function Main() {
  const store = useGlobalStore()
  const initial = async () => {
    try {
      const res = await fetchProfile()
      if (res.item.id) {
        store.login(null, res.item)
      }
    } catch (e) {
      console.log("我是一个错误", e)
    } finally {
      store.hideLoading()
    }
  }
  useEffect(() => {
    // 验证是否登陆 VipkitSystem
    // 点击首次初始化
    // 拿 token 检查token
    initial().then()
  }, [])
  return (
    <HashRouter>
      <Layout>
        <HeaderNav />
        <Layout>
          <Layout style={{ padding: "0 2px 2px" }}>
            <Content
              className="site-layout-background"
              style={{
                margin: 0,
                minHeight: 400,
                height: 780,
                color: "#000",
              }}
            >
              <Router />
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </HashRouter>
  )
}

export default function App() {
  return (
    <ProvideStore>
      <Main />
    </ProvideStore>
  )
}
