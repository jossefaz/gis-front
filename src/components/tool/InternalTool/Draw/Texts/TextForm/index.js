import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default (props) => {
    const [value, setValue] = useState(props.editText || '');
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image'],
            [{ 'direction': 'rtl' }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': 'right' }],
            ['clean']
        ]
    }

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image', 'align', 'direction', 'color', 'background'
    ]
    return (
        <div style={{
            direction: 'ltr',
            textAlign: 'left'
        }} onMouseDownCapture={e => e.stopPropagation()}>
            <ReactQuill theme="snow" modules={modules}
                formats={formats} value={value} onChange={setValue} />
            <button
                className="ui icon button primary pointer"
                onClick={() => { props.onSubmit(value, props.overlayID); setValue('') }}
                style={{
                    margin: "0.1em"
                }}
            >
                "הוסף על המפה"
            </button>
            {
                props.overlayID && props.editText &&
                <button
                    className="ui icon button negative pointer"
                    onClick={() => { props.cancelEdit(); setValue('') }}
                    style={{
                        margin: "0.1em"
                    }}
                >
                    "ביטול"
            </button>

            }
        </div>


    );
}