import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import api from '../api'
import './FileList.scss'

const FileList = forwardRef((props, ref) => {
    const [item, setItem] = useState([])
    const load = async () => {
        const { data } = await api.get('/files', { params: { t: Date.now() } })
        console.log("GET /files 응답:", data.out)
        setItem(data.out)
    }
    useEffect(() => {
        load()
    }, [])
    useImperativeHandle(ref, () => ({ load }))
    const del = async (id) => {
        if (!window.confirm('삭제?')) return
        try {
            await api.delete(`/files/${id}`)
            await load()
            console.log('삭제 완료', id)
        } catch (error) {
            console.error('실패', error)
        }
    }
    return (
        <ul className='file-list'>
            {item.map((it) => (
                <li key={it._id}>
                    <h3>{it.title || it.originalName}</h3>
                    <div className="img-wrap">
                        {it.contentType?.startsWith('image/') && (
                            <img src={it.url} alt="" style={{ maxWidth: 200, display: "block" }} />
                        )}
                    </div>
                    <p>{it.description}</p>
                    <div className="btn-wrap">
                        <a href={it.url} target="_blank" rel="noreferrer" className='open-btn'>open</a>
                        <button onClick={() => del(it._id)} className='delete-btn'>delete</button>
                    </div>
                </li>
            ))}
        </ul>
    )
})

export default FileList