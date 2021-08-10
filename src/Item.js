const Item = (props) => {
  return (
    <div className="Item">
      <video className="Video" controls autoPlay loop muted>
        <source src={props.url} />
        Your browser does not support the video tag.
      </video>
      <button
        className="CopyButton"
        onClick={() =>
          navigator.clipboard.writeText(props.url).then(
            function () {
              //successful
              alert("COPY SUCCESSFUL!");
            },
            function () {
              //fail
              alert("COPY FAILED!");
            }
          )
        }
      >
        Copy GIF
      </button>
    </div>
  );
};

export default Item;
