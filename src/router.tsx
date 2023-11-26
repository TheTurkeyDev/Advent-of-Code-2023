import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Loading, NotFound } from 'gobble-lib-react';
import { HomePage } from './pages/home';

const Days2015 = lazy(() => import(/* webpackChunkName: "Days 2015" */ './pages/2015/days-2015-router'));
const Days2023 = lazy(() => import(/* webpackChunkName: "Days 2023" */ './pages/2023/days-2023-router'));

export const AocRouter = () => {
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path='/2015/*' element={<Days2015 />} />
                <Route path='/2023/*' element={<Days2023 />} />
                <Route path='/*' element={<NotFound />} />
            </Routes>
        </Suspense>
    );
};
