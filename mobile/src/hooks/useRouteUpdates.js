import { useMutation } from '@tanstack/react-query';
import { createRoute } from '../services/apiClient';

export const useRouteUpdates = (options = {}) => {
  const mutation = useMutation({
    mutationFn: createRoute,
    ...options,
  });

  return {
    requestRoute: mutation.mutate,
    requestRouteAsync: mutation.mutateAsync,
    isFetching: mutation.isPending,
    data: mutation.data,
    error: mutation.error,
    reset: mutation.reset,
  };
};
