import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Loading } from 'gobble-lib-react';
import { Day14 } from './day-14-2024';
import { Day15 } from './day-15-2024';

const Days2024Router = () => {
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                <Route path='/14' element={<Day14 />} />
                <Route path='/15' element={<Day15 />} />
            </Routes>
        </Suspense>
    );
};

export default Days2024Router;