export const OpcionesGestion = ({ icon, title, subTitle, button, colorIcon}) => {
  return (
    <div className={`opcionGestion box ${colorIcon}`}>
      <section className="opcionesInfo">

        <div className="info">
          <h4>{title}</h4>
          <span>{subTitle}</span>
        </div>

        <div className="container-icon">{icon}</div>

      </section>
      <section className="contentButton">{button}</section>
    </div>
  );
};
