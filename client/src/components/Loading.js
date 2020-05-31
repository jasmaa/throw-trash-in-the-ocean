import React from 'react';

const Loading = () => {

    return (
        <div className="d-flex justify-content-center m-5">
            <div className="spinner-border text-light" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
}

export default Loading;
