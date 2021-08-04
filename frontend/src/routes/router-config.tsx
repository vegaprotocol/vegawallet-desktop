import Home from "./home";
import EditServiceConfig from "./config";

const routerConfig = [
    {
        path: "/",
        name: 'Home',
        children: [],
        component: Home,
        exact: true,
    }, {
        path: "/service/config/edit",
        name: "Edit service config",
        children: [],
        component: EditServiceConfig,
        exact: true,
    }
];

export default routerConfig;
