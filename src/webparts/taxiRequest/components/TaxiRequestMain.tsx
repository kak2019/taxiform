import * as React from 'react';
import App from './App';


import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";

import { useUrlQueryParam } from '../hooks/useUrlQueryParam'





export default function TaxiRequestMain() {

  const [{ ID }] = useUrlQueryParam(['ID'])
 

  return (
   <App/>
  );
}
