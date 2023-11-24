import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Loading } from 'gobble-lib-react';
import { Day0 } from './day-0';
import { Day1 } from './day-1';

const DaysRouter = () => {
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                <Route path='/0' element={<Day0 />} />
                <Route path='/1' element={<Day1 />} />
            </Routes>
        </Suspense>
    );
};

export default DaysRouter;