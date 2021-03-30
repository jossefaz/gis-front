import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const TextForm = (props) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      [{ direction: "rtl" }],
      [{ color: [] }, { background: [] }],
      [{ align: "right" }],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "align",
    "direction",
    "color",
    "background",
  ];

  return (
    <div
      style={{
        direction: "ltr",
        textAlign: "left",
      }}
      onMouseDownCapture={(e) => e.stopPropagation()}
    >
      <ReactQuill
        theme="snow"
        modules={modules}
        formats={formats}
        value={props.value}
        onChange={props.setValue}
      />
      <button
        className="ui icon button primary pointer"
        onClick={() => {
          props.onSubmit(props.value, props.overlayID);
          props.setValue("");
        }}
        style={{
          margin: "0.1em",
        }}
      >
        {props.overlayID ? "עדכן" : "הוסף על המפה"}
      </button>
      {props.overlayID && (
        <button
          className="ui icon button negative pointer"
          onClick={() => {
            props.cancelEdit();
            props.setValue("");
          }}
          style={{
            margin: "0.1em",
          }}
        >
          "ביטול"
        </button>
      )}
    </div>
  );
};
export default TextForm;
