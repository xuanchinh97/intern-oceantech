import { EgretLoadable } from "egret";
import { withTranslation } from "react-i18next";
import ConstantList from "../../appConfig";

const Employee = EgretLoadable({
  loader: () => import("./Employee")
});

const ViewComponent = withTranslation()(Employee);

const EmployeeRoutes = [
  {
    path: ConstantList.ROOT_PATH + "list/employee",
    exact: true,
    component: ViewComponent,
  },
];

export default EmployeeRoutes