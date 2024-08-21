import { TrashIcon } from "../../components/common/icons/TrashIcon";
import { MenuDeepIcon } from "../../components/common/icons/MenuDeepIcon";

export const HeaderTable = ({ title, btn3Text, btn3Color, btn3Icon, btn2Funcion, btn3Funcion, onDelete }) => {
  return (
    <div className="section-header">
      <div>
        <h4 className="section-title">{title}</h4>
      </div>
      <div className="section-buttons">
        <button className="btn-usuario btn-red" onClick={onDelete}><TrashIcon/> Eliminar </button>
        <button className="btn-usuario btn-blue" onClick={() => btn2Funcion(true)}><MenuDeepIcon/> Filtros </button>
        <button className={`btn-usuario btn-3 ${btn3Color}`} onClick={() => btn3Funcion(true)}>{btn3Icon} {btn3Text}</button>
      </div>
    </div>
  );
};
