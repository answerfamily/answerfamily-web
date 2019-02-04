import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

function AppBarTabs({ value, onChange }) {
  return (
    <Tabs value={value} onChange={onChange}>
      <Tab label="愛家敘述" value="articles" />
      <Tab label="平權回應" value="paragraphs" />
    </Tabs>
  );
}

export default AppBarTabs;
