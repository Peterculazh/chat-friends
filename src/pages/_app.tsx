import React, { Component } from 'react';
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

        const { Component, pageProps }: { Component: any, pageProps: any } = this.props;
        const getLayout = Component.getLayout || ((page: any) => page);
        return (
            getLayout(<Component {...pageProps}></Component>)
        )
    }
}


export default MyApp;