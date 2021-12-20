import { useCallback, useEffect, useState } from "react";

import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";

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
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();

  useEffect(() => {
    //socket.io connection to server
    const s = io("http://localhost:3001");
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  // reciveing changes
  useEffect(() => {
    if (socket == null || quill == null) {
      return;
    }
    const handler = (delta) => {
      // function provided quill
      quill.updateContents(delta);
    };
    socket.on("receive-changes", handler);

    return () => {
      socket.off("receive-changes", handler);
    };
  }, [socket, quill]);

  // on editor change
  useEffect(() => {
    if (socket == null || quill == null) {
      return;
    }
    const handler = (delta, oldDelta, source) => {
      if (source !== "user") {
        return;
      }
      socket.emit("send-changes", delta);
    };
    // function provided quill
    quill.on("text-change", handler);

    return () => {
      // function provided quill
      quill.off("text-change", handler);
    };
  }, [socket, quill]);

  const inputRef = useCallback((input) => {
    if (input === null) {
      return;
    }

    input.innerHTML = "";
    const editor = document.createElement("div");
    input.append(editor);
    const q = new Quill(editor, {
      modules: {
        toolbar: TOOLBAR,
      },
      theme: "snow",
    });
    setQuill(q);
  }, []);

  return <div className="container" ref={inputRef}></div>;
};

export default TextEditor;
