import React from "react";
import { Layout, Menu } from "antd";
import { routes } from "./route/index";
import { Link, Route, Switch, Redirect, useLocation } from "react-router-dom";

const { Header, Content, Sider } = Layout;
const MenuItem = Menu.Item;

const { useState } = React;

function App() {
    const location = useLocation();
    const [selectedKeys, setSelectedKeys] = useState(
        location ? [location.pathname] : [routes[0].path]
    );
    return (
        <Layout>
            <Header>
                <h2 style={{ color: "#fff" }}>D3-Force演示</h2>
            </Header>
            <Layout>
                <Sider collapsible={true}>
                    <Menu
                        theme="dark"
                        selectedKeys={selectedKeys}
                        style={{ width: "100%" }}
                        onSelect={(item) => setSelectedKeys(item.selectedKeys)}
                    >
                        {routes.map((route, index) => {
                            return (
                                <MenuItem key={route.path}>
                                    <Link to={route.path}>{route.name}</Link>
                                </MenuItem>
                            );
                        })}
                    </Menu>
                </Sider>
                <Layout>
                    <Content style={{ overflow: "hidden" }}>
                        <Switch>
                            {routes.map((route, index) => {
                                return (
                                    <Route
                                        path={route.path}
                                        component={route.component}
                                        key={index}
                                        ß
                                    ></Route>
                                );
                            })}
                            <Redirect to={routes[0].path} />
                        </Switch>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
}

export default App;
