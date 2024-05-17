import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components';
import { Provider } from 'react-redux';
import { store } from './store';
import { useAuth } from './hooks';
import { AscensoresRouter } from './router';

function App() {
  const status = useAuth();
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {status === 'authenticated' ? <AscensoresRouter/> : <Route exact path='/login' element={<Login/>}/>}
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;