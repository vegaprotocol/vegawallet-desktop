import { Config } from "./config";
import { Home } from "./home";

const routerConfig = [
  {
    path: "/config",
    name: "Config",
    component: Config,
  },
  {
    path: "/",
    name: "Home",
    component: Home,
    exact: true,
  },
];

export default routerConfig;
