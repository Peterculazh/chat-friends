import React from 'react';
import App from 'next/app';
import '../styles/main.sass';

class MyApp extends App {
    static async getInitialProps({ Component, ctx }: { Component: any, ctx: any }) {

        let pageProps: any = {}
        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx)
        }

        return { pageProps }
    }

    render() {

        const { Component, pageProps } = this.props;
        return (
            <Component {...pageProps} />
        )
    }
}


export default MyApp;