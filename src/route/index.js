import Basic from "../container/basic";
import ChangeData from "../container/change-data";
import AddIcon from "../container/add-icon";
import SideText from "../container/side-text";
import OutSideClick from "../container/outside-click";

export const routes = [
    {
        path: "/step1",
        name: "基础入门",
        component: Basic,
    },
    {
        path: "/step3",
        name: "更改数据",
        component: ChangeData,
    },
    {
        path: "/step5",
        name: "小图标",
        component: AddIcon,
    },
    {
        path: "/step6",
        name: "两边文字",
        component: SideText,
    },
    {
        path: "/step7",
        name: "外部点击交互",
        component: OutSideClick,
    },
];
