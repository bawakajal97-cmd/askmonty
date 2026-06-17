import * as React from 'react';
import { useSession } from "next-auth/react";

const useUser = () => {
  const { data: session, status } = useSession();

  return {
    data: session?.user || null,
    loading: status === 'loading',
  };
};

export { useUser };
export default useUser;
