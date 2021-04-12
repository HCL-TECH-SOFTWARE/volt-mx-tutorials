import React, { Component } from 'react'
import Head from 'next/head'

export default class Layout extends Component {
  render() {
    return(
      <div className='layout'>
      <Head>
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>
      { this.props.children }
    </div>
    )
  }
};

