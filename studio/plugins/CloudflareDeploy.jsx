import React, { useState } from 'react'
import { Card, Button, Heading } from '@sanity/ui'
const deploy_hook_url = process.env.SANITY_STUDIO_CLOUDFLARE_HOOK
// we should use a worker as proxy? https://github.com/estallio/cloudflare-pages-deployments-api-proxy
export default {
  name: 'cloudflare-deploy',
  component: () => {
    const [message, setMessage] = useState('');
    const [messageColor, setMessageColor] = useState('black');
    const [buttonTone, setButtonTone] = useState('default');

    const deploy = () => {
      const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
        'Access-Control-Max-Age': '86400'
      };
      fetch(deploy_hook_url, {
        method: 'post',
        mode: 'no-cors', // Add this line to disable CORS
        headers: {
          corsHeaders
        },
      })
      .then(response => {
        setMessage('Deployment triggered successfully. Your changes will be live in a few minutes.');
        setMessageColor('green');
        setButtonTone('positive');
        setTimeout(() => {
          setButtonTone('default');
          setMessage('');
        }, 5000);
      })
      .catch(error => {
        console.error('Error:', error);
        setMessage('Something went wrong with the deployment. Please try again later.');
        setMessageColor('red');
        setButtonTone('critical');
        setTimeout(() => {
          setButtonTone('default');
          setMessage('');
        }, 5000);
      });
    }

    return (
      <Card style={{ color: '#4e556d' }}>
        <Heading size={1} style={{ padding: '1.25rem 0.75rem', borderBottom: '1px solid #e0e0e0' }}>Cloudflare Pages Deploy</Heading>
        <p style={{ fontSize: '0.8125rem', padding: '0 0.75rem' }}>Deploy the latest changes to Production / Cloudflare Pages.</p>
        <p style={{ fontSize: '0.8125rem', padding: '0 0.75rem'}}><em>Estimated build time: 2-3min</em></p>
        {deploy_hook_url ? (
          <Button 
            onClick={deploy} 
            tone={buttonTone} 
            style={{ 
              margin: '1.25rem 0.75rem', 
              transition: 'background-color 0.3s ease', 
            }} 
            text="Deploy" 
          />
        ) : (
          <p style={{ fontSize: '0.75rem', padding: '0 0.75rem', color: 'red' }}>Please set the environment variable SANITY_STUDIO_CLOUDFLARE_HOOK to enable the deploy button.</p>
        )}
        {message && <p style={{ fontSize: '0.75rem',  padding: '0 0.75rem', color: messageColor }}>{message}</p>}
      </Card>
    )
  }
}