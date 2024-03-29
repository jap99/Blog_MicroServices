import React, { useState } from 'react';
import axios from 'axios';

export default ({ postId }) => {
  
    const [content, setContent] = useState('');

    const createComment = async event => {
        event.preventDefault();
        // await axios.post(`http://localhost:4001/posts/${postId}/comments`, {
            await axios.post(`http://posts.com/posts/${postId}/comments`, {
            content
        });
        setContent('');
    };

    return (
        <div>
        <form onSubmit={ createComment }>
            <div className="form-group">
            <label>New Comment</label>
            <input
                value={content}
                onChange={e => setContent(e.target.value)}
                className="form-control"
            />
            </div>
            <button className="btn btn-primary">Submit</button>
        </form>
        </div>
    );

};
