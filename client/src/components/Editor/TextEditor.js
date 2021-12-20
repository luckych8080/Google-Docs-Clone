import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
  const { id: documentId } = useParams();
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();

  //socket.io connection to server
  useEffect(() => {
    const s = io("http://localhost:3001");
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  // load saved document
  useEffect(() => {
    if (socket == null || quill == null) {
      return;
    }

    socket.once("load-document", (document) => {
      quill.setContents(document);
      quill.enable();
    });

    socket.emit("get-document", documentId);
  }, [socket, quill, documentId]);

  // save document at every 2000 sec
  useEffect(() => {
    if (socket == null || quill == null) {
      return;
    }

    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents());
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [socket, quill]);

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
    q.disable(false);
    q.setText("Loading...");
    setQuill(q);
  }, []);

  return <div className="container" ref={inputRef}></div>;
};

export default TextEditor;
