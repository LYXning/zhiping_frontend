import React from 'react';
import App from './App';

// 直接导出App组件，因为App.tsx中已经包含了Provider
const AppWithRedux: React.FC = () => <App />;

export default AppWithRedux;
