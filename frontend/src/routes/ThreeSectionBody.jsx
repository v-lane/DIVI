import React from 'react';

import '../styles/ThreeSectionBody.scss';
import RecentTransaction from '../components/RecentTransaction';
import Groups from '../components/Groups';
import TransactionChart from '../components/TransactionChart';

const ThreeSectionBody = (props) => {
  const { user, userGroups, transactionData, memberTransactions } = props;

  

  return (
    <section className='body-articles'>
      <div className='left'>
        <article className='top'><section className='chart-area' ><TransactionChart transactionData={transactionData} memberTransactions={memberTransactions} user={user} group={userGroups}/></section></article>
        <article className='bottom'><RecentTransaction transactionData={transactionData} /></article>
      </div>
      <article className='right'>
        <Groups userGroups={userGroups}/>
      </article>
    </section>
  );
};

export default ThreeSectionBody;