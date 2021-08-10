const Section = (props) => {
  return (
    <div>
      <h2 className="SectionHeader">{props.headerText}</h2>
      <div className="GifsList">{props.itemArr}</div>
    </div>
  );
};

export default Section;
