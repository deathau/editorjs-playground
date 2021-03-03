import EditorJS from "@editorjs/editorjs";
import MyParagraph from "./myparagraph";
import "./style.scss";

const run = async () => {
  let saving = null;
  const editor = new EditorJS({
    holder: 'editorjs',
    //@ts-ignore
    tools: { myParagraph: MyParagraph },
    defaultBlock: "myParagraph",
    onChange: () => {
      if (!saving) {
        saving = editor.save().then((output) => {
          document.getElementById("output").innerText = JSON.stringify(output, null, 2);
          saving = null;
        })
      }
    }
  });

  try {
    await editor.isReady;
    console.log('Editor.js is ready to work!')
    /** Do anything you need after editor initialization */
  } catch (reason) {
    console.log(`Editor.js initialization failed because of ${reason}`)
  }
}

run();
