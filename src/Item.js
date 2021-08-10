const Item = (props) => {
  return (
    <div className="Item">
      <video controls autoPlay loop muted>
        <source src={props.url} />
        Your browser does not support the video tag.
      </video>
      <button
        className="CopyButton"
        onClick={() => navigator.clipboard.writeText(props.url)}
      >
        Copy GIF
      </button>
    </div>
  );
};

export default Item;
