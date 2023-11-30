import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Loading } from 'gobble-lib-react';
import { Day1 } from './day-1-2015';
import { Day6 } from './day-6-2015';

const Days2023Router = () => {
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                <Route path='/1' element={<Day1 />} />
                <Route path='/6' element={<Day6 />} />
            </Routes>
        </Suspense>
    );
};

export default Days2023Router;