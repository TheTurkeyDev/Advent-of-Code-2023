import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Loading } from 'gobble-lib-react';
import { Day1 } from './day-1-2015';

const Days2023Router = () => {
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                <Route path='/1' element={<Day1 />} />
            </Routes>
        </Suspense>
    );
};

export default Days2023Router;