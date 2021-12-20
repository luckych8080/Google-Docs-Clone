import { Fragment, useCallback } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "./TextEditor.css";


// tool option for quill editor
const TOOLBAR = [
  ["bold", "italic", "underline", "strike"],
  ["blockquote", "code-block"],
  [{ header: 1 }, { header: 2 }][({ list: "ordered" }, { list: "bullet" })],
  [{ script: "sub" }, { script: "super" }],
  [{ indent: "-1" }, { indent: "+1" }],
  [{ direction: "rtl" }],
  [{ size: ["small", false, "large", "huge"] }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ color: [] }, { background: [] }],
  [{ font: [] }],
  [{ align: [] }],
  ["clean"],
];

const TextEditor = () => {
  const inputRef = useCallback((input) => {
    if (input === null) {
      return;
    }

    input.innerHTML = "";
    const editor = document.createElement("div");
    input.append(editor);
    new Quill(editor, {
      modules: {
        toolbar: TOOLBAR,
      },
      theme: "snow",
    });
  }, []);

  return (
    <Fragment>
      <div className="container" ref={inputRef}></div>
    </Fragment>
  );
};

export default TextEditor;
