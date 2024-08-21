
// librerias
import { BrowserRouter as Router } from "react-router-dom";
import { MainContainer } from "./MainContainer";

export const PointOfSaleApp = () => {

  return (
    <>
      <div className="mainContainer">
        <Router>
          <MainContainer />
        </Router>
      </div>
      {/** fin de mainContainer */}
    </>
  );
};
