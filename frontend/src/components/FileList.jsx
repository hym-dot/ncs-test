import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import api from "../api";
import "./FileList.scss";

const FileList = forwardRef((props, ref) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const load = async () => {
        setLoading(true);
        try {
            const { data } = await api.get("/files", {
                params: { t: Date.now() }
            });
            // 서버 응답에 'out' 필드가 없거나 배열이 아닐 경우, 안전하게 빈 배열([])로 처리
            setItems(Array.isArray(data.out) ? data.out : []);
        } catch (error) {
            console.error("파일 목록 로딩 에러:", error);
            setItems([]); // 에러 발생 시에도 빈 배열로 초기화
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    useImperativeHandle(ref, () => ({ load }));

    const del = async (id) => {
        if (loading) return;
        if (!window.confirm("정말로 삭제하시겠습니까?")) return;

        setLoading(true);
        try {
            await api.delete(`/files/${id}`);
            setItems(prevItems => prevItems.filter(item => item._id !== id));
            console.log('파일 삭제 완료', id);
        } catch (error) {
            console.error('파일 삭제 에러', error);
            await load(); 
        } finally {
            setLoading(false);
        }
    };

    return (
        <ul className="file-list">
            {loading && <li className="loading-message">로딩 중...</li>}
            
            {!loading && items.length === 0 && <li className="empty-message">표시할 파일이 없습니다.</li>}
            
            {items.map((it) => (
                <li key={it._id}>
                    <h3>{it.title || "제목 없음"}</h3>
                    <div className="img-wrap">
                        {it.contentType?.startsWith("image/") && (
                            <img src={it.url} alt={it.title || "이미지"} style={{ maxWidth: 200, display: "block" }} />
                        )}
                    </div>
                    <p>{it.description || "설명 없음"}</p>
                    <div className="btn-wrap">
                        <a href={it.url} target="_blank" rel="noreferrer" className="open-btn">Open</a>
                        <button
                            onClick={() => del(it._id)}
                            disabled={loading}
                            className="delete-btn"
                        >
                            Delete
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
});

export default FileList;