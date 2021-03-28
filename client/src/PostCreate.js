import React, { useState } from 'react';
import axios from 'axios';

export default () => {
 
    const [title, setTitle] = useState('');
    
    const createPost = async event => {       // POSTS service
        event.preventDefault()
        await axios.post('http://posts.com/posts/create', {
            title
        })
        setTitle('');
    };

    return (
        <div>
        <form onSubmit={ createPost } >            
            <div className="form-group">
            <label>Title</label>
            <input
                value={title}
                onChange={ (e) => setTitle(e.target.value) }
                className="form-control"
            />
            </div>
            <button className="btn btn-primary"> Submit </button>
        </form>
        </div>
    )

}

