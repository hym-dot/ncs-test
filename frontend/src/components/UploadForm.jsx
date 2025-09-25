import { useState } from "react";
import api from "../api";

// 컴포넌트 이름을 UploadForm으로 설정
function UploadForm({ onDone }) {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [uploading, setUploading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            alert("파일을 선택해주세요.");
            return;
        }

        setUploading(true);

        try {
            // 1단계: Presigned URL 요청
            const presignResponse = await api.post("/files/presign", {
                filename: file.name,
                contentType: file.type,
            });
            const { url, key } = presignResponse.data;

            // 2단계: S3에 파일 직접 업로드
            await fetch(url, {
                method: "PUT",
                body: file,
                headers: { "Content-Type": file.type },
            });

            // 3단계: 메타데이터를 백엔드 DB에 저장
            await api.post("/files", {
                key,
                originalName: file.name,
                contentType: file.type,
                size: file.size,
                title,
                description,
            });

            alert("업로드 성공!");
            onDone?.(); // onUploadSuccess 대신 onDone 사용
            
            // 입력 필드 초기화
            setFile(null);
            setTitle("");
            setDescription("");
            if (document.getElementById('file-input')) {
                document.getElementById('file-input').value = '';
            }

        } catch (error) {
            console.error("업로드 실패:", error);
            alert("업로드 중 오류가 발생했습니다.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="upload-form">
            <input id="file-input" type="file" onChange={(e) => setFile(e.target.files[0])} />
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="title"
                required
            />
            <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="description"
            />
            <button type="submit" disabled={uploading}>
                {uploading ? "업로드 중..." : "upload"}
            </button>
        </form>
    );
}

export default UploadForm;