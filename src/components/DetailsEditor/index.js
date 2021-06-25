import React, { useState, useEffect, useRef } from "react";

export default function DetailsEditor({ onChangeData, ckData, checksum }) {
  const editorRef = useRef();
  const [editorLoaded, setEditorLoaded] = useState(false);
  const { CKEditor, ClassicEditor } = editorRef.current || {};

  useEffect(() => {
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor,
      ClassicEditor: require("@ckeditor/ckeditor5-build-classic"),
    };

    setEditorLoaded(true);
  }, []);

  return editorLoaded ? (
    <div>
      <CKEditor
        editor={ClassicEditor}
        data={ckData}
        onInit={(editor) => {
          // You can store the "editor" and use when it is needed.
          console.log("Editor is ready to use!", editor);
        }}
        config={{
          ckfinder: {
            uploadUrl: `http://localhost:3200/api/tour/upload?checksum=${checksum}`,
          },
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          console.log({ event, editor, data });
          onChangeData(data);
        }}
      />
    </div>
  ) : (
    <div>Editor loading</div>
  );
}
