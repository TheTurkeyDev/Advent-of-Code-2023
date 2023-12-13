import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Loading } from 'gobble-lib-react';
import { Day1 } from './day-1-2023';
import { Day10 } from './day-10-2023';
import { Day13 } from './day-13-2023';

const Days2023Router = () => {
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                <Route path='/1' element={<Day1 />} />
                <Route path='/10' element={<Day10 />} />
                <Route path='/13' element={<Day13 />} />
            </Routes>
        </Suspense>
    );
};

export default Days2023Router;