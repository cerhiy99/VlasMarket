import React from 'react';
import './LeftPanel.scss';
import { Locale } from '@/i18n.config';

const LeftPanel = ({ lang, dictionary }: { lang: Locale; dictionary: any }) => {
  return (
    <div className="left-panel-container">Те що зліва тут можна верстати</div>
  );
};

export default LeftPanel;
