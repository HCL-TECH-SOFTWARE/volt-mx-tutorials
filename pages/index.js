import React,{ useEffect } from 'react';
import { useRouter } from 'next/router';
import { BASE_PATH_URL, isDev } from '../src/config';

const MpLanding = () => {
  const router = useRouter()

  useEffect(() => {
    // redirect to /hikes route
    const routePath = isDev ? '/hikes' : `/${BASE_PATH_URL}/hikes`
    router.push(routePath, undefined, { shallow: true })
  })
  
  return null;
}

export default MpLanding
