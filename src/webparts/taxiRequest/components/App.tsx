import * as React from "react";
import { useUrlQueryParam } from '../hooks/useUrlQueryParam'
import { memo, useEffect } from "react";
import TaxiRequest from "./TaxiRequest";
import TaxiRequestNew from "./TaxiRequestNew";


export default memo(function App() {
    const [{ITEMID}] = useUrlQueryParam(['ITEMID'])
    if (ITEMID === "-1") return <TaxiRequestNew />;
    if (ITEMID !== "-1") return <TaxiRequest />;
})