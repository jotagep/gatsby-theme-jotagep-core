import React from 'react';

export default function Index({pageContext}) {
    const { name } = pageContext;
    return (
        <div>
            Player => {name}
        </div>
    )
}
