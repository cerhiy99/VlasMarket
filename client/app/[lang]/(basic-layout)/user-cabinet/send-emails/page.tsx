import React from 'react';
import './SendEmails.scss';

type Props = {};

const page = (props: Props) => {
  return (
    <div className="send-emailes-container">
      <h1 className="send-emailes-title">Розсилка на пошту</h1>

      <div className="send-emailes-info">
        <span className="send-emailes-label">Email для повідомлень</span>
        <p className="send-emailes-email">7551991@gmail.com</p>
      </div>

      <div className="send-emailes-grid">
        <label className="send-emailes-card">
          <input type="checkbox" />
          <span className="send-emailes-checkmark"></span>

          <div className="send-emailes-card-content">
            <h3>Відповіді на ваші відгуки</h3>
            <p>Отримуйте сповіщення про відповіді</p>
          </div>
        </label>

        <label className="send-emailes-card">
          <input type="checkbox" defaultChecked />
          <span className="send-emailes-checkmark"></span>

          <div className="send-emailes-card-content">
            <h3>Нагадування про відгук</h3>
            <p>Лист-нагадування після покупки</p>
          </div>
        </label>

        <label className="send-emailes-card">
          <input type="checkbox" />
          <span className="send-emailes-checkmark"></span>

          <div className="send-emailes-card-content">
            <h3>Акції та знижки</h3>
            <p>Отримуйте повідомлення про актуальні акції та спеціальні пропозиції</p>
          </div>
        </label>

        <label className="send-emailes-card">
          <input type="checkbox" />
          <span className="send-emailes-checkmark"></span>

          <div className="send-emailes-card-content">
            <h3>Нові вигідні пропозиції</h3>
            <p>Будьте першими, хто дізнається про новинки та вигідні пропозиції</p>
          </div>
        </label>
      </div>
    </div>
  );
};

export default page;