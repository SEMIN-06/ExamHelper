import { History, Transition } from 'history';
import { useCallback, useContext, useEffect } from "react";
import { Navigator } from 'react-router';
import { UNSAFE_NavigationContext as NavigationContext } from "react-router-dom";
import useModal from './useModal';

type ExtendNavigator = Navigator & Pick<History, "block">;
export function useBlocker(blocker: (tx: Transition) => void, when = true) {
  const { navigator } = useContext(NavigationContext);

  useEffect(() => {
    if (!when) return;

    const unblock = (navigator as ExtendNavigator).block((tx) => {
      const autoUnblockingTx = {
          ...tx,
          retry() {
              unblock();
              tx.retry();
          },
      };

      blocker(autoUnblockingTx);
    });

    return unblock;
  }, [navigator, blocker, when]);
}

export default function usePrompt(message: string, when = true) {
  const { showModal } = useModal();

  const blocker = useCallback((tx: Transition) => {
    showModal({
      text: message,
      callback: (confirmed: boolean) => {
        confirmed && tx.retry();
      }
    });
  }, [message]);

  useBlocker(blocker, when);
}
