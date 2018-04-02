import { Store } from 'vuex';
import { ipcRenderer } from 'electron';
import { RootState } from '../store';
import { EditMode } from '../utils/types/scoreTypes';

type IPCListener = { channel: string, listener: Function };

export function createIpcVuexListenerPlugin() {
  return (store: Store<RootState>) => {
    const listenerList: IPCListener[] = [
      {
        channel: 'toSelectMode',
        listener: () => { store.commit('editor/changeMode', EditMode.SELECT_MODE); },
      },
      {
        channel: 'toWriteMode',
        listener: () => { store.commit('editor/changeMode', EditMode.WRITE_MODE); },
      },
    ];
    
    listenerList.forEach((ipcListener) => {
      ipcRenderer.on(ipcListener.channel, ipcListener.listener);
    });
  };
}
