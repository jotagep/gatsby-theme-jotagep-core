import React from 'react';

import Layout from '../components/Layout';

export default function Index({pageContext}) {
    const { name } = pageContext;
    return (
        <Layout>
            Player => {name}
        </Layout>
    )
}
