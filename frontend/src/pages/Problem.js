import { useContext, useRef, useState } from "react";
import { QuestionContext } from "../contexts/QuestionContext";
import parse from "html-react-parser";
import Editor from "@monaco-editor/react";
import { Button } from "@mui/material";
import SelectLanguage from "../components/common/SelectLanguage";
import axios from "axios";
import { ModeContext } from "../contexts/ModeContext";

function ProblemPage(props) {
  const { question } = useContext(QuestionContext);
  const { mode } = useContext(ModeContext);
  const [code, setCode] = useState("console.log('hello world')");
  const [consoleResult, setConsoleResult] = useState({});
  const [language, setLanguage] = useState({
    id: 63,
    name: "JavaScript (Node.js 12.14.0)",
    raw: "javascript",
  });
  const [hide, setHide] = useState(true);
  const [chatHeight, setChatHeight] = useState(5);
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    monacoRef.current = monaco;
  }
  function handleLanguageChange(event) {
    setLanguage(JSON.parse(event.target.value));
  }
  // function showValue() {
  //   console.log(editorRef.current.getPosition()); //get current position useful to show peer where you are currently at
  // }
  function onHide() {
    setHide(true);
    setChatHeight(5);
  }
  function onShow() {
    setHide(false);
    setChatHeight(30);
  }
  const onRun = async () => {
    try {
      const r1 = await axios.post(
        "http://localhost:5000/api/v1/judge/submission",
        {
          userID: "1234",
          titleSlug: question["titleSlug"],
          language_id: language.id,
          source_code: code,
        }
      );
      const { data } = await axios.get(
        `http://localhost:5000/api/v1/judge/submission?token=${r1.data.token}`
      );
      setConsoleResult({
        stdout: data.stdout ? atob(data.stdout) : "None",
        time: data.time,
        memory: data.memory,
        stderr: data.stderr ? atob(data.stderr) : "None",
        compile_output: data.compile_output,
        message: data.message ? atob(data.message) : "None",
        status: data.status,
      });
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <>
      <div className="problem-page-container">
        <div className="problem-description-container">
          {parse(question["problem"])}
        </div>
        <div className="editor-container">
          <div
            className="editor-component"
            style={{ height: `${100 - chatHeight}%` }}
          >
            <Editor
              height="100%"
              language={language.raw}
              theme={"vs-" + mode}
              value={code}
              onChange={setCode}
              onMount={handleEditorDidMount}
              options={{
                inlineSuggest: true,
                fontSize: "16px",
                formatOnType: true,
                autoClosingBrackets: true,
                minimap: { scale: 10 },
              }}
            />
          </div>
          <div
            className="console-and-chat-container"
            style={{ height: `${chatHeight}%` }}
          >
            {hide && (
              <Button variant="contained" onClick={onShow} color="secondary">
                Show
              </Button>
            )}
            {!hide && (
              <>
                <div className="console-options">
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={onHide}
                    sx={{ marginInline: 1 }}
                  >
                    Hide
                  </Button>

                  <Button variant="contained" color="secondary" onClick={onRun}>
                    Run
                  </Button>
                  <SelectLanguage
                    language={language}
                    handleChange={handleLanguageChange}
                  />
                </div>
                <div className="console-message">
                  <div>
                    <div>
                      <strong>Status: </strong>
                      {consoleResult?.status?.description}
                    </div>
                    <strong>Time: </strong>
                    {consoleResult?.time ? consoleResult?.time : ""}
                  </div>
                  <div>
                    <strong>Memory: </strong>
                    {consoleResult?.memory}
                  </div>
                  <div>
                    <strong>Message: </strong>
                    {consoleResult?.message}
                  </div>
                  <div>
                    <strong>Output: </strong>
                    {consoleResult?.stdout}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProblemPage;
