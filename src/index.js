import { KeyboardNav, KeyboardNavItem, Loading } from 'cerebro-ui';
import fetch from 'node-fetch';
import rot13 from 'rot-thirteen';

import styles from './styles.css';

let ninjas;

function Icon({icon}) {
  return <i className={`fa fa-${icon} ${styles.fa}`} />;
}

ninjas = fetch('http://web-api.tretton37.com/ninjas')
  .then((res) => res.json());

const Preview = ({ninja, actions}) => (
  <div style={{width: '100%', height: '100%'}}>
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.13/css/solid.css" integrity="sha384-Rw5qeepMFvJVEZdSo1nDQD5B6wX0m7c5Z/pLNvjkB14W6Yki1hKbSEQaX9ffUbWe" crossorigin="anonymous" />
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.13/css/fontawesome.css" integrity="sha384-GVa9GOgVQgOk+TNYXu7S/InPTfSDTtBalSgkgqQ7sCik56N9ztlkoTr2f/T44oKV" crossorigin="anonymous" />
    <div style={{display: 'flex', flexDirection: 'column', textAlign: 'center', paddingBottom: '2rem'}}>
      <h2>{ninja.name}</h2>
      <img src={`http:${ninja.imagePortraitUrl}`} style={{objectFit: 'contain', height: '40vh'}} />
    </div>
    <KeyboardNav>
      <KeyboardNavItem onSelect={() => { console.log(actions); actions.open(`phone:${ninja.phoneNumber.replace(/ /g, '')}`); }} >
        <Icon icon={'phone'} />
        {ninja.phoneNumber}
      </KeyboardNavItem>
      <KeyboardNavItem onSelect={() => { console.log(actions); actions.open(`mailto:${rot13(ninja.email)}`); }}>
        <Icon icon={'envelope'} />
        {rot13(ninja.email)}
      </KeyboardNavItem>
    </KeyboardNav>
  </div>
);

export const fn = ({ isLoading, term, display, actions }) => {
  if (term.length < 3) {
    return;
  }
  ninjas.then(
    (ns) => {
      const found = ns.filter(n => n.name.match(new RegExp(`${term}`, 'i')))
        .map(n => ({
          title: n.name,
          icon: `https:${n.imagePortraitUrl}`,
          getPreview: () => (
            <Preview ninja={n} actions={actions} />
          ),
        }))
      display(found);
    }
  );
}
