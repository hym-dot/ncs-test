import { useRef } from "react";
import FileList from "./components/FileList";
import UploadForm from "./components/UploadForm";
import './App.css'; // 간단한 스타일링을 위해 추가

function App() {
    const listRef = useRef(null);

    // FileList의 load 함수를 호출하는 함수
    const reload = () => listRef.current?.load?.();

    return (
        <div className="container">
            <h1>S3 파일 업로드 및 목록 보기</h1>
            <hr />
            <UploadForm onDone={reload} />
            <hr />
            <FileList ref={listRef} />
        </div>
    );
}

export default App;