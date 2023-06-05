import * as React from "react";
import { useUrlQueryParam } from '../hooks/useUrlQueryParam'
import { memo, useEffect } from "react";
import TaxiRequest from "./TaxiRequest";
import TaxiRequestNew from "./TaxiRequestNew";


export default memo(function App() {
    const [{ID}] = useUrlQueryParam(['ID'])
    if (ID === "-1") return <TaxiRequestNew />;
    if (ID !== "-1") return <TaxiRequest />;
})