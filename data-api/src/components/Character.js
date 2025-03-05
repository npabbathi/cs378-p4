const Character = ({name, image, amiiboSeries, gameSeries, type}) => {
    return (
        <div className="nintendo_card">
          <h3>{name}</h3>
          <hr/>
          <img src={image} alt="mario" />
          <p1>Series: {amiiboSeries}</p1><br/>
          <p1>Franchise: {gameSeries}</p1><br/>
          <p1>Type: {type}</p1>
        </div>
    );
};

export default Character;