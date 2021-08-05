import Home from "./home";

const routerConfig = [
    {
        path: "/",
        name: 'Home',
        children: [],
        // Not lazy as loaded when a user first hits the site
        component: Home,
        exact: true,
    },
];

export default routerConfig;
