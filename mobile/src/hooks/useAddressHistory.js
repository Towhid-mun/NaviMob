import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { clearAddressHistory, fetchAddressHistory } from '../services/apiClient';

const HISTORY_QUERY_KEY = ['addressHistory'];

export const useAddressHistory = () => {
  const queryClient = useQueryClient();

  const historyQuery = useQuery({
    queryKey: HISTORY_QUERY_KEY,
    queryFn: () => fetchAddressHistory({ limit: 8 }),
    onSuccess: (data) => {
      console.debug('[history] received from API', data);
    },
  });

  const clearMutation = useMutation({
    mutationFn: clearAddressHistory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: HISTORY_QUERY_KEY }),
  });

  const refreshHistory = () =>
    queryClient.invalidateQueries({ queryKey: HISTORY_QUERY_KEY });

  return {
    history: historyQuery.data ?? [],
    isLoadingHistory: historyQuery.isLoading,
    refreshHistory,
    isClearingHistory: clearMutation.isPending,
    clearHistory: clearMutation.mutate,
    clearHistoryAsync: clearMutation.mutateAsync,
  };
};
