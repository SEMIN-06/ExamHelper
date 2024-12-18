import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<App />);

// calling IPC exposed from preload script
/* window.electron.ipcRenderer.once('test', (arg) => {
  // eslint-disable-next-line no-console
  console.log(arg);
}); */
