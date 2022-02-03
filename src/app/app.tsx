import React from 'react';
import {Route, Routes} from 'react-router-dom';
import {ChakraProvider} from '@chakra-ui/react';
import {Dashboard} from './components/dashboard-page/dashboard-page';

const App = () => {
  return (
    <ChakraProvider>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </ChakraProvider>
  );
};

export default App;
