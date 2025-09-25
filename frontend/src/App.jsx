import { useRef } from 'react';
// 파일 이름과 컴포넌트 이름에 맞게 import 수정
import UploadForm from './components/UploadForm.jsx'; 
import FileList from './components/FileList.jsx';   
import './App.css'; 

function App() {
    const fileListRef = useRef();

    // UploadForm의 onDone prop에 연결될 함수
    const handleUploadDone = () => {
        if (fileListRef.current) {
            fileListRef.current.load();
        }
    };

    return (
        <div className="App">
            <h1>S3 파일 업로드</h1>
            {/* 사용하는 컴포넌트와 prop을 UploadForm에 맞게 수정 */}
            <UploadForm onDone={handleUploadDone} />
            <hr />
            <FileList ref={fileListRef} />
        </div>
    );
}

export default App;