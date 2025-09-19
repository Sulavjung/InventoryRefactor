import { createBrowserRouter } from "react-router-dom";
import { Applayout } from "./components/layouts/AppLayout";
import NoMatch from "./pages/NoMatch";
import Empty from "./pages/Empty";
import ProductSearch from "./pages/newInventory";
import ApplicationSidebarLayout from "./components/layouts/ApplicationSidebarLayout";

// Main router configuration
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Applayout />,
    children: [
      {
        path: "",
        element: <ApplicationSidebarLayout />,
        children: [
          {
            path: "",
            element: <ProductSearch />,
          },
        ],
      },
      /*{
        path: ":listName",
        element: <CategoryListView />,
      }, */
      {
        path: "empty",
        element: <Empty />,
      },
    ],
  },
  {
    path: "*",
    element: <NoMatch />,
  },
]);
